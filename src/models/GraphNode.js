import NodeProperties from "./properties/NodeProperties";
import utils from "../services/utils";
class GraphNode{
    constructor(data){
        this.labels = [data.collectionName];
        this.properties = new NodeProperties(data.properties);
        this.relationships = {};
        this.variable = `node_${utils.getUniqueId()}`
    }

    addLabel(label){
        this.labels.push(label);
    }
    generateCypherTargetRelationship(target, rel){
        return `CREATE (${this.variable})-[:${rel}]->(${target.varible})`
    }
    generateCypherSourceRelationship(source, rel){
        return `CREATE (${source.variable})-[:${rel}]->(${this.varible})`
    }
}

export default GraphNode;