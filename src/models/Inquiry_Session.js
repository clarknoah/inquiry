import GraphNode from "./GraphNode";
import CypherQuery from "./CypherQuery";
import api from "../services/api";



export default class Inquiry_Session extends GraphNode{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.cypherQuery = new CypherQuery();
        this.historic = false;
        this.inquiryThought = [];
        this.turnarounds = [];
        this.fullBelief = [];
        this.desires = [];
        this.fears = [];
        this.definitions = [];
        this.treats = [];
        this.perceives = [];
        this.serves = [];
        this.fullBelief = [];
        this.underlyingBeliefs=[];
        this.date = undefined;
        this.stepsCompleted={
            thought:false,
            truth: false,
            whenBelieved:false,
            whenNotBelieved:false,
            turnarounds:false,
            letGo:false
        }
        this.whenBelieved={
            "Thought":[],
            "Mental_Image":[],
            "Emotion":[],
            "Perception":[],
            "Body_Sensation":[],
        };
        this.whenNotBelieved={
            "Thought":[],
            "Mental_Image":[],
            "Emotion":[],
            "Perception":[],
            "Body_Sensation":[],
        };
        this.newKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{},
            "A_Body_Sensation":{},
            "A_Body_Location":{},
            "A_Meaning":{}
        };
        this.existingKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{},
            "A_Body_Sensation":{},
            "A_Body_Location":{},
            "A_Meaning":{}
        };
    }



    prepareForSubmission(){

    }

    checkForCompletion(){
        let completed = true;
        for(let key in this.stepsCompleted){
            if(this.stepsCompleted[key]==false){
                completed = false;
            }
        }
        //TODO: CHANGE THIS BACK!
        return completed;
    }

    setupSession(a,m){
        if(this.inquiryThought.length === 0){
            let isHistoric = m.properties.timestampOfInput.value !==m.properties.timestampOfPerception.value;
            this.properties.dateOfInput.setDefaultValue();
            this.properties.timestampOfInputStart.setDefaultValue();
            this.properties.dateOfPerception.value = m.properties.dateOfPerception.value
            this.properties.timestampOfPerception.value = m.properties.timestampOfPerception.value
            if(isHistoric){
                this.properties.realtime.value = false;
                this.historic = isHistoric;
                this.date = m.properties.dateOfPerception.value;
              }else {
                this.properties.realtime.value = true;
                this.historic = false;
              }
              this.inquiryThought = [a, m];
              this.stepsCompleted.thought = true;
        }else{
            alert("Inquiry Session already started");
        }
        return this;
    }

    checkForNewDuplicate(node){
        let thought = node.properties[node.defaultQueryKey].value.toLowerCase().trim();
        let newNode = node.id==undefined;
        console.log()
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

    checkPerceptionForDuplicate(a){
        if(a.exists){
            a = this.checkForExistingDuplicate(a);
        }else if(a.exists===false){
            a = this.checkForNewDuplicate(a);
        }
        return a;
    }

    addPerception(perception, specialRelationship,addToQuery=true){
        console.log(perception);
        let [a,m] = perception;
        a = this.checkPerceptionForDuplicate(a);
        m.properties.inputType.setValue("inquiry");
        m.addRelationship("MANIFESTATION_OF",a.variable);
        //might have to switch this into addToQuery to prevent duplicate
        this.inquiryThought[1].addRelationship(specialRelationship, m.variable);
        if(addToQuery){

            this.cypherQuery.addNode(m);
            this.cypherQuery.addNode(a);
        }
        return [a,m];
    }

    addNestedPerceptions(source, specialRelationship,addToQuery=true){
        console.log(source, specialRelationship);
        source.collectorList.forEach((target, index)=>{
            source = this.addNestedPerception(source, index, specialRelationship,addToQuery);
        })
        return source;
    }

    addNestedPerception(source, index, specialRelationship,addToQuery=true){
        console.log(source, index, specialRelationship);
        let [a,m] = source.collectorList[index];
        a = this.checkPerceptionForDuplicate(a);
        m.properties.inputType.setValue("inquiry");
        if(addToQuery){
            m.addRelationship("MANIFESTATION_OF",a.variable);
            source.addRelationship(specialRelationship, m.variable);
            this.cypherQuery.addNode(m);
            this.cypherQuery.addNode(a);

        }
        source.collectorList[index] = [a,m];
        return source;
    }

    createPerceptionObjectMarkdown(object){
        let text = ``
        console.log(object);
        for(let key in object){
            if(object[key].length>0){
                text+=`##### ${key}:\n`;
                object[key].forEach(val=>{
                    let props = val[1].properties;
                    text+=`* ${props.perception.value}`
                    if(val[1].collectorList!==undefined && val[1].collectorList.length >0){
                        let perceptions = val[1].collectorList.map(item=>item[1].properties.perception.value)
                        text+=`: ${perceptions.join(",")}\n`
                    }else{
                        text+=`\n`
                    }
                })
            }
        }
        return text;
    }

    createMarkdown(){
        let mdArr = [];
        let thought = this.inquiryThought[1].properties;
        console.log(thought);
        let thoughtText = `## Thought (${thought.dateOfPerception.value}): ${thought.perception.value}`;
    
        let isItTrue = `### Is it true?\n${thought.isItTrue.value}`
        let certainlyTrue = thought.certainlyTrue.value !==undefined ? thought.certainlyTrue.value+"\n" : "\n";
        let desires = "### Desires:\n";
        desires += this.desires.map(desire=>`* ${desire[1].properties.perception.value}`).join("\n")
        let fears = "### Fears:\n";
        fears += this.fears.map(fear=>`* ${fear[1].properties.perception.value}`).join("\n")
        let fullBelief = ``;
        if(this.fullBelief.length >0){
            fullBelief = `### Full Belief: ${this.fullBelief[1].properties.perception.value}\n`;
        }
        let whenBelieved  = `### When Believed:\n\n`;
        whenBelieved += this.createPerceptionObjectMarkdown(this.whenBelieved);
        console.log(this.treats);
        let treats = `### How do you treat self and others when you believe this thought?\n`;
        treats += this.treats.map(val=>{
            console.log(val);
            let text = `#### ${val[1].properties.perception.value}\n`;
            text+=val[1].collectorList.map(item=>{
                return `* ${item[1].properties.perception.value}`
            }).join("\n")
            return text;
        }).join("\n")
        let perceives = `### How do I perceive self and others when you believe this thought?\n`;

        perceives += this.perceives.map(val=>{
            console.log(val);
            let text = `#### ${val[1].properties.perception.value}\n`;
            text+=val[1].collectorList.map(item=>{
                return `* ${item[1].properties.perception.value}`
            }).join("\n")
            return text;
        }).join("\n")
        let underlyingBeliefs = `### Underlying Beliefs\n`;

        underlyingBeliefs += this.underlyingBeliefs.map(val=>{
            return `* ${val[1].properties.perception.value}`
        }).join("\n")

        let serves = `### Does this serve me in any beneficial way?\n${thought.doesThisBenefitMe.value}\n\n`;
        serves+= this.serves.map(val=>`* ${val[1].properties.perception.value}`).join("\n")

        let whenNotBelieved = `### When Not Believed:\n`;
        whenNotBelieved += this.createPerceptionObjectMarkdown(this.whenNotBelieved);
        let turnarounds = `### Turnarounds:\n`;
        this.turnarounds.forEach(val=>{
            turnarounds+=`#### ${val[1].properties.perception.value}\n`
            turnarounds+=this.createPerceptionObjectMarkdown(val[2]);
        })

        let letGo = `### Would Let Go:\n`
        letGo+=`#### Would let go of emotion\n ${thought.couldLetGoEmotion.value}\n`
        letGo+=`#### Would let go of thought\n ${thought.couldLetGoThought.value}\n`
        letGo+=`#### could let go of emotion\n ${thought.wouldLetGoEmotion.value}\n`
        letGo+=`#### could let go of emotion\n ${thought.wouldLetGoThought.value}\n`
        letGo+=`#### when?\n ${thought.whenLetGo.value}`
        mdArr.push(thoughtText, 
            isItTrue, 
            certainlyTrue, 
            desires, 
            fears, 
            fullBelief,
            whenBelieved,
            treats,
            perceives,
            serves,
            underlyingBeliefs,
            whenNotBelieved,
            turnarounds,
            letGo

            );
    
        window.inquiryMarkdown = mdArr.join("\n")
        console.log(window.inquiryMarkdown);

    }

    addPerceptions(list, specialRelationship,subList=undefined,addToQuery=true){
        console.log(list);
        if(list.length > 0){

            list.forEach((perception, index)=>{
                if(subList!==undefined && list[index][1].collectorList !== undefined && list[index][1].collectorList.length > 0){

                    list[index][1] = this.addNestedPerceptions(list[index][1], subList.specialRelationship,addToQuery)
                }

                    list[index] = this.addPerception(list[index],specialRelationship,addToQuery)
                
            })
            // if(subList!==undefined && list[1].collectorList !== undefined && list[1].collectorList.length > 0){
            //     list[1] = this.addNestedPerceptions(list[1], subList.specialRelationship,addToQuery)
            // }
        }
 
        return list;
    }

    addObjectOfPerceptions(perceptions,specialRelationship,subList=undefined){
        for(let key in perceptions){

            perceptions[key] = this.addPerceptions(perceptions[key], specialRelationship,subList[key]);
        }
        return perceptions;
    }

    addNestedObjectOfPerceptions(source, perceptions, specialRelationship,subList=undefined){

    }

    generateCypherQuery(){
        //Add Thought relationship Inquiry 
        console.log("Adding Thought")
        let [a_iThought, m_iThought] = this.inquiryThought;
        a_iThought = this.checkPerceptionForDuplicate(a_iThought);
        this.addRelationship(`INQUIRED_INTO`,m_iThought.variable);
        m_iThought.addRelationship(`MANIFESTATION_OF`,a_iThought.variable);
        m_iThought.properties.inputType.setValue("inquiry");
        this.properties.completed.value = this.checkForCompletion();
        this.cypherQuery.addNode(this);
        this.inquiryThought=[a_iThought, m_iThought];
        this.cypherQuery.addNodeWithoutRelationships(this.inquiryThought[1])
        this.cypherQuery.addNode(this.inquiryThought[0])
        // Add all associated desires 
        console.log("Adding Desires")
        this.desires = this.addPerceptions(this.desires,"ASSOCIATED_DESIRE");
        // Add All associated fears 
        console.log("Adding fears")
        this.fears = this.addPerceptions(this.fears, "ASSOCIATED_FEAR");
        
        //Add Full Belief 
        console.log("Adding full belief")
        if(this.fullBelief.length>0){
            
            this.fullBelief = this.addPerception(this.fullBelief, "FULL_BELIEF");
        }
        let believedSubList = {
            "Emotion":{
                specialRelationship:"IN_RELATIONSHIP_TO"
            },
            "Body_Sensation":{
                specialRelationship:"LOCATION"
            }
        }
        console.log("Adding when believed")
        this.whenBelieved = this.addObjectOfPerceptions(this.whenBelieved,"WHEN_BELIEVED", believedSubList);
        console.log("Adding treat and perceive")
        let treatAndPerceiveList = {specialRelationship:"ASSOCIATED_PERCEPTION"};
        this.definitions = this.addPerceptions(this.definitions, "ASSOCIATED_FORM", {specialRelationship:"ASSOCIATED_DEFINITION"})
        this.treats = this.addPerceptions(this.treats,"TREAT_WHEN_BELIEVED", treatAndPerceiveList);
        this.perceives = this.addPerceptions(this.perceives,"PERCEIVED_WHEN_BELIEVED", treatAndPerceiveList);
        console.log("Adding serves")
        this.serves = this.addPerceptions(this.serves, "HOW_THOUGHT_SERVES_ME");
        console.log("Adding uderling beliefs")
        this.underlyingBeliefs = this.addPerceptions(this.underlyingBeliefs,"UNDERLYING_BELIEF")
        console.log("Adding when not believed")
        this.whenNotBelieved = this.addObjectOfPerceptions(this.whenNotBelieved,"WHEN_NOT_BELIEVED",believedSubList)
        
        console.log("adding turnarounds", this.turnarounds)
        this.turnarounds.forEach((turnaround,index)=>{
            let associations = turnaround[2];
            console.log(associations);
            //We're not adding the turnaround to the query yet, because it will have a lot more relationships
            let output  = this.addPerception(turnaround,"TURNAROUND",false);
            console.log(output)
            this.turnarounds[index][0] = output[0];
            this.turnarounds[index][1] = output[1];
            //this.turnarounds[index][1].
            // All the turn arounds have been added to the inquiry thought (without adding the turnaround to the query)
            
            // We need to ensure that the nested nested relationships are first added to the perceptions before
            
            //We're iterating through the individual turnarounds associated perceptions 
            for(let key in associations){
                if(associations[key].length > 0){

                    console.log(key, this.turnarounds[index], index)
                    //We're setting collectorList to make the turnaround work for this particular association
                    this.turnarounds[index][1].collectorList = associations[key];
                    
                    //We're checking to see if this association has sub associations 
                    if(believedSubList[key]!==undefined){
                        console.log(this.turnarounds[index][1].collectorList);
                        //If there are sub associations, we need to ensure that the association is first unique
                        // and will get associated with the correct abstract node 
                        
                        // Here we're ensuring that the associations to the turnaround are unique 
                        console.log("First call", )
                        this.turnarounds[index][1] = this.addNestedPerceptions(this.turnarounds[index][1], "WHEN_BELIEVED",false);
                        console.log(this.turnarounds[index][1].collectorList);
                        //Once we know the associations are unique, we can add the nested perception associations to the perceptions
                        console.log("second call ", this.turnarounds)
                        console.log(this.turnarounds[index][1].collectorList);
                        this.turnarounds[index][1].collectorList.forEach((subPerception,subIndex)=>{
                            console.log(subPerception, subIndex)
                            console.log(this.turnarounds[index][1].collectorList[subIndex])
                            this.turnarounds[index][1].collectorList[subIndex][1] = this.addNestedPerceptions(subPerception[1],believedSubList[key].specialRelationship)
                        })
                        //Once the nested perception associations are added, we can add the turnaround itself 
                    }
                    console.log("thirdCall", this.turnarounds)
                    this.turnarounds[index][1] = this.addNestedPerceptions(this.turnarounds[index][1], "WHEN_BELIEVED");
                    
                    //associations[key] = this.addNestedPerceptions(this.turnarounds[index][1])
                }
            }
            this.cypherQuery.addNode(this.turnarounds[index][0]);
            this.cypherQuery.addNode(this.turnarounds[index][1]);
        });
        this.cypherQuery.addNode(this.inquiryThought[0]);
        this.cypherQuery.addNode(this.inquiryThought[1]);
        this.cypherQuery.addTestProperty("first_real_data",this.inquiryThought[1].properties.dateOfInput.value);
        this.query = {
            query:this.cypherQuery.generateQuery(),
            params:this.cypherQuery.params}
        console.log(this.query);
    }
        //Add 

}