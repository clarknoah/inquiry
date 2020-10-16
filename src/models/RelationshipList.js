import NodeProperties from "./properties/NodeProperties";
import utils from "../services/utils";
import Relationship from "./Relationship";
export default class RelationshipList{
    constructor(data){
        this.type = data.name.toUpperCase();
        this.variables = {};
        this.properties = data.properties;
        this.data = data;
    }

    addRelationship(source, target){
        let variable = `rel_${utils.getUniqueId()}`;
        this.variables[variable] = new Relationship(source,target,this.data)
        // this.variables[variable] = {
        //     variable:variable,
        //     properties: new NodeProperties(this.properties),
        //     params:undefined,
        //     target:target,
        //     source:source,
        //     create:`CREATE (${source})-[${variable}:${this.type}]->(${target})`,
        //     set:`SET ${variable} = $${variable}_props`
        // }
        return this.variables[variable];
    }
}

