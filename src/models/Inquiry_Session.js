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
        this.treats = [];
        this.perceives = [];
        this.fullBelief = [];
        this.underlyingBeliefs=[];
        this.date = undefined;

        this.whenBelieved={
            "A_Thought":[],
            "A_Mental_Image":[],
            "A_Emotion":[],
            "A_Perception":[],
            "A_Form":[],
            "A_Body_Sensation":[],
            "A_Body_Location":[]
        };
        this.whenNotBelieved={
            "A_Thought":[],
            "A_Mental_Image":[],
            "A_Emotion":[],
            "A_Perception":[],
            "A_Form":[],
            "A_Body_Sensation":[],
            "A_Body_Location":[]
        };
        this.newKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{},
            "A_Body_Sensation":{},
            "A_Body_Location":{}
        };
        this.existingKeys={
            "A_Thought":{},
            "A_Mental_Image":{},
            "A_Emotion":{},
            "A_Perception":{},
            "A_Form":{},
            "A_Body_Sensation":{},
            "A_Body_Location":{}
        };
    }



    prepareForSubmission(){

    }

    checkForCompletion(){
        let completion = true;
        if(completion){
            this.inquiryThought = [];
        }
        return true;
    }

    setupSession(a,m){
        if(this.inquiryThought.length === 0){
            let isHistoric = m.properties.timestampOfInput.value !==m.properties.timestampOfPerception.value;
            this.properties.dateOfInput.setDefaultValue();
            this.properties.timestampOfInputStart.setDefaultValue();
            this.properties.dateOfPerception = m.properties.dateOfPerception.value
            this.properties.timestampOfPerception = m.properties.timestampOfPerception.value
            if(isHistoric){
                this.properties.realtime.value = false;
                this.historic = isHistoric;
                this.date = m.properties.dateOfPerception.value;
              }else {
                this.properties.realtime.value = true;
                this.historic = false;
              }
              this.inquiryThought = [a, m];
    
        }else{
            alert("Inquiry Session already started");
        }
        return this;
    }
}