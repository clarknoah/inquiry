import NodeProperties from "./properties/NodeProperties";

export default class Relationship{
    constructor(relData, source, target, id=undefined, properties=undefined){
        this.type = data.relationshipType.toUpperCase();
        this.properties = new NodeProperties(relData.properties);
        this.variable = `node_${utils.getUniqueId()}`
    }
}