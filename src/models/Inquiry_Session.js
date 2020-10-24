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
        this.fullBelief = [];
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
}