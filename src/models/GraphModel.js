import models from "./inquiry_models_v1.json";
import GraphNode from "./GraphNode";
import M_Thought from "./nodes/M_Thought";
import M_Perception from "./nodes/M_Perception";
import Tracker from "./nodes/Tracker";
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
    getNewModelClass(label){
        let model = this.getLabelModel(label);
        if(label=="M_Thought"){
            return new M_Thought(model);
        }else if(label.includes("M_")){
            return new M_Perception(model);
        }else {
            return new GraphNode(model);
        }
    }
    getExistingModelClass(label, id, properties){
        let model = this.getLabelModel(label);
        if(label=="M_Thought"){
            return new M_Thought(model, id, properties);
        }else if(label.includes("M_")){
            return new M_Perception(model, id, properties);
        }else {
            return new GraphNode(model, id, properties);
        }
        
    }
}

let InquiryModel = new GraphModel(models, "Hackolade");

export default InquiryModel;