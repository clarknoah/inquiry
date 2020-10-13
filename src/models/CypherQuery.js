import utils from "../services/utils";
export default class CypherQuery{
    constructor(){
        this.match = [];
        this.where = [];
        this.create = [];
        this.set = [];
        this.params = {};
        this.matchVariables = {};
        this.createVariables = {};
        this.relationshipVariables={};
    }
    //At some point I can probably push all deduplication to here
    doesMatchNodeExist(node){
        if(this[`matchVariables`].hasOwnProperty(node.id)){
            return true
        }else {
            return false;
        }
    }
    doesCreateNodeExist(node){
        if(this[`createVariables`].hasOwnProperty(node.variable)){
            return true
        }else {
            return false;
        }
    }
    
    doesRelationshipExist(source,rel,target){
        let relName = `${source.variable}_${rel}_${target.variable}`;
        if(this.relationshipVariables.hasOwnProperty(relName)){
            return true
        }else {
            return false;
        }
    }
    
    addMatch(node){
        let alreadyAdded = this.doesMatchNodeExist(node,'match');
        if(alreadyAdded){
            console.log("Duplicate node");
        }else{
        this.matchVariables[`${node.id}`] = node.variable;
        let match = `(${node.variable})`
        let where = `id(${node.variable}) = ${node.id}`;
        this.match.push(match);
        this.where.push(where);
        return this;}
    }
    addCreate(node){
        let alreadyAdded = this.doesCreateNodeExist(node);
        if(alreadyAdded){
            console.log("Duplicate THought");
        }else{
            let create = `CREATE (${node.variable}:${node.labels.join(":")})`
            let set = `SET ${node.variable} = $${node.variable}_props`;
            let props = node.getPropertyObject();
            this.params[`${node.variable}_props`] = props;
            this.create.push(create)
            this.set.push(set);
            this.createVariables[`${node.variable}`] = true;
            return set;
        }
    }

    addRelationship(source,rel,target,relProps=undefined){
        let alreadyAdded = this.doesRelationshipExist(source,rel,target);
        if(alreadyAdded){
            console.log("Duplicate Relationship");
        }else{
        let relName = `${source.variable}_${rel}_${target.variable}`;
        let relVariable = "rel_"+utils.getUniqueId();
        let create = `CREATE (${source.variable})-[${relVariable}:${rel}]->(${target.variable})`;
        this.create.push(create);
        this.relationshipVariables[relName] = true;
        if(relProps!==undefined){
            let set = `SET ${relVariable} = $${relVariable}_props`;
            this.set.push(set);
            this.params[`${relVariable}_props`]= relProps;
        }}
    }
    generateQuery(){
        let query = [];
        if(this.match.length > 0){
            query.push(`MATCH ${this.match.join(",")}`);
        }
        if(this.where.length> 0){
            query.push(`WHERE ${this.where.join(" AND ")}`);
        }
        if(this.create.length> 0){
            query.push(...this.create);
        }
        if(this.set.length > 0){
            query.push(...this.set);
        }
        return query.join("\n");

    }
}