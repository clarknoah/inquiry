import RelationshipList from "./RelationshipList";

export default class NodeRelationships{
    constructor(relationships){
        this.setRelationshipKeys(relationships);
    }
    setRelationshipKeys(data){
        data.forEach(rel=>{
            let name = rel.name.toUpperCase();
            this[name] = new RelationshipList(rel);
        })
        
    }
    generateCypherPropertyObject(){

    }

}