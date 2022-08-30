import GraphNode from "../GraphNode";
import CypherQuery from "../CypherQuery";
import api from "../../services/api";
class Tracker extends GraphNode{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.api = api;
        this.thoughts = [];
        this.perceptions = [];
        this.followedBy = [];
        this.status = "setup";
        this.currentTime = undefined;
        this.historic = false;
        this.cypherQuery = new CypherQuery();
        this.finalInput = undefined;
        this.newKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{}
        };
        this.existingKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{}
        };
    }

    addThought(aThought,mThought){
        mThought.properties.inputType.setValue("tracker");
        if(aThought.exists===true){
            aThought = this.checkForExistingDuplicate(aThought);
        }else if(aThought.exists===false){
            aThought = this.checkForNewDuplicate(aThought);
        }
        mThought.addRelationship(
            "MANIFESTATION_OF",
            aThought.variable
        )
        this.addRelationship(`PERCEIVED`,mThought.variable);
        if(this.thoughts.length > 0){
            let index = this.thoughts.length-1;
            let durationRel = this.thoughts[index][1].addRelationship("FOLLOWED_BY",mThought.variable);
            if(this.historic==false){
                let duration = mThought.properties.timestampOfPerception.value 
                - this.thoughts[index][1].properties.timestampOfPerception.value;
            durationRel.properties.durationBetween.setValue(duration/1000);
            this.followedBy.push(duration/1000);
            }
            this.cypherQuery.addNewRelationship(durationRel.getCreateQuery());
        }
        this.thoughts.push([aThought,mThought])
        this.perceptions.push(aThought,mThought);
        this.cypherQuery.addNode(aThought);
        this.cypherQuery.addNode(mThought);
        return this;
    }

    checkForNewDuplicate(node){
        let thought = node.properties[node.defaultQueryKey].value.toLowerCase().trim();
        let newNode = node.id==undefined;
        let variable = node.variable;
        let notAdded = !this.newKeys[node.labels[0]].hasOwnProperty(thought);
        if(newNode && notAdded){
            this.newKeys[node.labels[0]][thought] = node.variable;
        }else if(newNode && !notAdded){
            node.variable = this.newKeys[node.labels[0]][thought];
        }
        return node;
    }

    checkForExistingDuplicate(node){
        let abstractId = node.id;
        if(this.existingKeys[node.labels[0]].hasOwnProperty(abstractId)!==true){
            this.existingKeys[node.labels[0]][abstractId] = node.variable;
        }else{
            node.variable = this.existingKeys[node.labels[0]][abstractId]
        }
       return node;
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
        let startTimestamp = this.properties.timestampOfStart.value;
        let endTimestamp = this.properties.timestampOfEnd.value;
        let sessionDuration = this.properties.duration.value;
        let first;
        let last;
        let gaps = [];
        let longestGap = this.thoughts.length === 0 ? sessionDuration : 0;
        let shortestGap = sessionDuration;
        let lastElement = this.thoughts.length - 1;
        if(this.thoughts.length > 0){
            first = this.thoughts[0][1];
            last = this.thoughts[this.thoughts.length - 1][1];
            let firstTimestamp = first.properties.timestampOfPerception.value;
            let lastTimestamp = last.properties.timestampOfPerception.value;
            let firstInputDuration = first.properties.inputDuration.value;
            let lastInputDuration = last.properties.inputDuration.value;
            let firstGap = (firstTimestamp - (startTimestamp))/1000;
            let secondGap = (endTimestamp - (lastTimestamp+(lastInputDuration*1000)))/1000;
            gaps.push(firstGap, secondGap);
            longestGap = firstGap > secondGap ? firstGap : secondGap;
            shortestGap = firstGap < secondGap ? firstGap : secondGap;
        }
        if(this.thoughts.length > 1){
            this.thoughts.forEach((val,index)=>{
                if(index < lastElement){
                    let timestamp = val[1].properties.timestampOfPerception.value
                    let inputDuration = val[1].properties.inputDuration.value;
                    let nextTimestamp = this.thoughts[index+1][1].properties.timestampOfPerception.value;
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
        }
        this.properties.longestThoughtGap.setValue(longestGap);
        this.properties.thoughtGaps.setValue(gaps);
        this.properties.shortestThoughtGap.setValue(shortestGap);

    }

    setAverageThoughtGapTotal(){
        let gaps = this.properties.thoughtGaps.value;
        let avg;
        if(gaps.length){
            let total = gaps.reduce((a,b)=>a+b);
            let avg = total/gaps.length;
        }else{
            avg = this.properties.duration.value;
        }
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
        let prop = "perception";
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
            let thought = val[0].properties.perception.value.toLowerCase().trim();
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
        let prop = "perception";
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

    submitTracker(){
        return api.cypherQuery(this.query.query,this.query.params)

    }


    generateCypherQuery(){
        this.properties.completed.setValue(true);
        this.properties.usedSuggestions.setValue(true);
        this.generateMetrics();
        this.cypherQuery.addNode(this);
        this.cypherQuery.addTransactionId();
       let query = this.cypherQuery.generateQuery();
       this.query = {query:query, params:this.cypherQuery.params};
       return this;
    }



}

export default Tracker;