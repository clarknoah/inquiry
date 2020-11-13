import models from "./inquiry_models_v1.json";
import GraphNode from "./GraphNode";
import M_Thought from "./nodes/M_Thought";
import M_Perception from "./nodes/M_Perception";
import A_Thought from "./nodes/A_Thought";
import A_Perception from "./nodes/A_Perception";
import Tracker from "./nodes/Tracker";
import Inquiry_Session from "./Inquiry_Session";
import User from "./nodes/User";

class GraphModel{
    constructor(data,format){
        this.model = data;
        this.format = format;
    }
    getLabelModel(label){
        try{
            return this.model.collections.filter(node=>node.collectionName==label)[0]
        }catch(err){
            console.log(err, "Node Label likely does not exist")
        }
        
    }
    getLabelRelationships(label){
        console.log(label);
        let guid = this.getLabelModel(label).GUID;
        let relationships = this.model.relationships.filter(rel=>{
            return rel.parentCollection==guid;
        })
        return relationships;
    }

    getNewModelClass(label){
        let model = this.getLabelModel(label);
        model.relationships = this.getLabelRelationships(label);
        if(label=="M_Thought"){
            return new M_Thought(model);
        }else if(label.startsWith("M_")){
            return new M_Perception(model);
        }else if(label.startsWith("A_")){
            if(label=="A_Thought"){
                return new A_Thought(model);
            }else{
                return new A_Perception(model);
            }
        }else if(label =="Thought_Tracker"){
            return new Tracker(model);
        }else if(label == "Inquiry_Session"){
            return new Inquiry_Session(model);
        }else if(label == "User"){
            return new User(model);
        }else{
            return new GraphNode(model);
        }
    }
    getExistingModelClass(label, id, properties){
        let model = this.getLabelModel(label);
        model.relationships = this.getLabelRelationships(label);
        if(label=="M_Thought"){
            return new M_Thought(model, id, properties);
        }else if(label.startsWith("M_")){
            return new M_Perception(model, id, properties);
        }else if(label.startsWith("A_")){
            if(label=="A_Thought"){
                return new A_Thought(model, id, properties);
            }else{
                return new A_Perception(model, id, properties);
            }
        }else if(label =="Thought_Tracker"){
            return new Tracker(model, id, properties);
        }else if(label =="User"){
            return new User(model, id, properties);
        }else{
            return new GraphNode(model, id, properties);
        }
        
    }
}

let InquiryModel = new GraphModel(models, "Hackolade");

export default InquiryModel;