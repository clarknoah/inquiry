import models from "./inquiry_models_v1.json";
import GraphNode from "./GraphNode";
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
        return new GraphNode(model);
    }
    getExistingModelClass(label, id, properties){
        let model = this.getLabelModel(label);
        return new GraphNode(model, id, properties);
    }
}

let InquiryModel = new GraphModel(models, "Hackolade");

export default InquiryModel;