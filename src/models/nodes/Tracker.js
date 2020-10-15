import GraphNode from "../GraphNode";
import CypherQuery from "../CypherQuery";
import api from "../../services/api";
class Tracker extends GraphNode{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.thoughts = [];
        this.relationships = [];
        this.status = "setup";
        this.currentTime = undefined;
        this.historic = false;
        this.cypherQuery = new CypherQuery();
        this.finalInput = undefined;
    }

    addThought(aThought,mThought){
        aThought.properties.inputType.setValue("tracker");
        this.thoughts.push([aThought,mThought])
        return this;
    }

    updateTrackerProperty(property,value){
        this[property] = value;
        return this;
    }

    deduplicateExistingThoughts(){
        let uniqueIds = {};
        this.thoughts.forEach((val,index)=>{
            let abstractId = val[0].id;
            if(uniqueIds.hasOwnProperty(abstractId)!==true){
                this.cypherQuery.
                uniqueIds[abstractId] = val[0].variable;
            }
           
        })
        console.log(uniqueIds);
        for(let key in uniqueIds){
            let uniqueVariable = uniqueIds[key];
            this.thoughts.forEach((val, index)=>{
                let abstractId = val[0].id;
                if (abstractId == key){
                    this.thoughts[index][0].variable = uniqueVariable;
                }
            })
        }
        return this;
    }

    setThoughtGapMetrics(){
        let gaps = [];
        let longestGap = 0;
        let shortestGap = 99999;
        let lastElement = this.thoughts.length - 1;
        this.thoughts.forEach((val,index)=>{
            if(index < lastElement){
                let timestamp = val[1].properties.timestampOfThought.value
                let inputDuration = val[1].properties.inputDuration.value;
                let nextTimestamp = this.thoughts[index+1][1].properties.timestampOfThought.value;
                let gap = nextTimestamp - (timestamp+(inputDuration*1000));
                gap = gap/1000;
                gaps.push(gap);
                if(gap>longestGap){
                    longestGap = gap;
                }
                if(gap<shortestGap){
                    shortestGap = gap;
                }

                
            }
        })
        this.properties.longestThoughtGap.setValue(longestGap);
        this.properties.thoughtGaps.setValue(gaps);
        this.properties.shortestThoughtGap.setValue(shortestGap);

    }

    setAverageThoughtGapTotal(){
        let gaps = this.properties.thoughtGaps.value;
        let total = gaps.reduce((a,b)=>a+b);
        let avg = total/gaps;
        console.log(gaps, total, avg);
        this.properties.averageThoughtGap.setValue(avg);
    }

    setAverageThoughtPerMinute(){
        let duration = this.properties.duration.value;
        let minutes = duration/60;
        let thoughtCount = this.thoughts.length;
        let avgPerMinute = thoughtCount/minutes;
        this.properties.averageThoughtsPerMinute.setValue(avgPerMinute);
    }


    setThoughtCount(){
        this.properties.thoughtCount.setValue(this.thoughts.length);
    }

    setDistinctThoughtCount(){
        let prop = "thought";
        let thoughts = this.thoughts.filter(function(obj, index, self) { 
            return index === self.findIndex(function(t) {
                 return t[0].properties[prop].value.toLowerCase().trim() === obj[0].properties[prop].value.toLowerCase().trim();
                }); 
        })
        this.properties.distinctThoughtCount.setValue(thoughts.length);
    }
        

    setDistinctNewThoughtCount(){
        let newThoughts = 0;
        let uniqueNewThoughts = {};
        this.thoughts.forEach((val,index)=>{
            let thought = val[0].properties.thought.value.toLowerCase().trim();
            let newNode = val[0].id==undefined;
            let variable = val[0].variable;
            let notAdded = !uniqueNewThoughts.hasOwnProperty(thought);
            if(newNode && notAdded){
                uniqueNewThoughts[thought] = val[0].variable;
                newThoughts++;
            }
        })
        return this.properties.distinctNewThoughtCount.setValue(newThoughts);
    }

    setNewThoughtCount(){
        let count = this.thoughts.filter(val=>val[0].exists==false).length;
        this.properties.newThoughtCount.setValue(count);
    }

    setExistingThoughtCount(){
        let thoughts = this.thoughts.filter(val=>val[0].exists);
        this.properties.existingThoughtCount.setValue(thoughts.length);

    }
    
    setDistinctExistingThoughtCount(){
        let thoughts = this.thoughts.filter(val=>val[0].exists==true);
        let prop = "thought";
        thoughts = thoughts.filter(function(obj, index, self) { 
            return index === self.findIndex(function(t) {
                 return t[0].properties[prop].value.toLowerCase().trim() === obj[0].properties[prop].value.toLowerCase().trim();
                }); 
        })
    
        this.properties.distinctExistingThoughtCount.setValue(thoughts.length);

    }
    
    deduplicateNewThoughts(){
        let uniqueNewThoughts = {};
        this.thoughts.forEach((val,index)=>{
            let thought = val[0].properties.thought.value.toLowerCase().trim();
            let newNode = val[0].id==undefined;
            let variable = val[0].variable;
            let notAdded = !uniqueNewThoughts.hasOwnProperty(thought);
            if(newNode && notAdded){
                uniqueNewThoughts[thought] = val[0].variable;
            }
        })

        for(let key in uniqueNewThoughts){
            let uniqueThought = uniqueNewThoughts[key];
            this.thoughts.forEach((val, index)=>{
                let thought = val[0].properties.thought.value.toLowerCase().trim();
                let sameThought = thought==key;
                //let variableExists = 
                if (sameThought){
                    this.thoughts[index][0].variable = uniqueNewThoughts[thought];
                }
            })
        }
        return this;
    }


    generateMetrics(){
        this.setThoughtCount();
        this.setDistinctThoughtCount();
        this.setNewThoughtCount();
        this.setDistinctNewThoughtCount();
        this.setExistingThoughtCount();
        this.setDistinctExistingThoughtCount();
        if(this.properties.realtime.value==true){
            this.setAverageThoughtPerMinute();
            this.setThoughtGapMetrics();
            this.setAverageThoughtGapTotal();
        }
    }


    

    generateCypherQuery(){
        this.generateMetrics();
        console.log(this.properties.generateCypherPropertyObject())
        this.deduplicateNewThoughts();
        let pRels = [];
        let mRels = [];
        let fRels = [];

        this.cypherQuery.addCreate(this);
        console.log(this.thoughts);
        let lastElement = this.thoughts.length - 1;
       this.thoughts.forEach((val,index)=>{
            let aThought = val[0];
            let mThought = val[1];
            this.cypherQuery.addCreate(mThought);

            if(aThought.exists===false){
                this.cypherQuery.addCreate(aThought);
            }else{
                this.cypherQuery.addMatch(aThought);
            }
            pRels.push([this,'PERCEIVED',mThought])
            mRels.push([mThought,'MANIFESTATION_OF',aThought]);
            if(index<lastElement){
                let nextThought = this.thoughts[index+1][1];
                let duration = nextThought.properties.timestampOfThought.value - mThought.properties.timestampOfThought.value
                let relProps = {
                    durationBetween:(duration/1000)
                }
                fRels.push([mThought,"FOLLOWED_BY",nextThought,relProps])
            }
       })
       console.log(pRels,mRels);
       pRels.forEach(val=>{
            this.cypherQuery.addRelationship(val[0],val[1],val[2])
       })
        mRels.forEach(val=>{
            this.cypherQuery.addRelationship(val[0],val[1],val[2])
        })
        fRels.forEach(val=>{
            if(this.properties.realtime.value == true){
                this.cypherQuery.addRelationship(val[0],val[1],val[2],val[3])
            }else{
                this.cypherQuery.addRelationship(val[0],val[1],val[2])
            }
            
        })
       let query = this.cypherQuery.generateQuery();
       console.log(query, this.cypherQuery.params);
       return api.cypherQuery(query,this.cypherQuery.params);
    }



}

export default Tracker;