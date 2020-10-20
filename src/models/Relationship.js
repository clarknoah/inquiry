import NodeProperties from "./properties/NodeProperties";
import utils from "../services/utils";
export default class Relationship {
    constructor(source, target, data){
        this.type=data.name;
        this.variable = "rel_"+utils.getUniqueId();
        this.properties = new NodeProperties(data.properties);
        this.target = target;
        this.source = source;
        this.params = undefined;
        this.create = `CREATE (${source})-[${this.variable}:${this.type}]->(${target})`;
        this.set = `SET ${this.variable} = $${this.variable}_props`;
    }
    getCreateQuery(){
        let query = {
            variable:this.variable,
            create:this.create,
            set:this.set,
            type:this.type,
            paramKey:`${this.variable}_params`,
            params:this.properties.generateCypherPropertyObject()
        }
        return query;
    }
}