import utils from "../services/utils";
export default class CypherQuery{
    constructor(){
        this.match = [];
        this.where = [];
        this.createNodes = [];
        this.createRels = [];
        this.set = [];
        this.params = {};
        this.matchVariables = {};
        this.createVariables = {};
        this.relationshipVariables={};
        this.query = "";
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
        let relName = `${source}_${rel}_${target}`;
        if(this.relationshipVariables.hasOwnProperty(relName)){
            return true
        }else {
            return false;
        }
    }

    doesNewRelationshipExist(rel){
        if(this.relationshipVariables.hasOwnProperty(rel.variable)){
            return true
        }else {
            return false;
        }
    }
    addNode(node){
        this.addAllRelationships(node);
        if(node.exists===true){
            this.addMatch(node);
        }else if(node.exists===false){
            this.addCreate(node);
        }
    }
    addNodeWithoutRelationships(node){
        if(node.exists===true){
            this.addMatch(node);
        }else if(node.exists===false){
            this.addCreate(node);
        }
    }
    addAllRelationships(node){
        for(let key in node.relationships){
            for(let relKey in node.relationships[key].variables){
                let rel = node.relationships[key].variables[relKey];
                this.addNewRelationship(rel);
            }
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
            this.createNodes.push(create)
            this.set.push(set);
            this.createVariables[`${node.variable}`] = true;
            return set;
        }
    }

    // addRelationship(source,rel,target,relProps=undefined){
    //     let alreadyAdded = this.doesRelationshipExist(source,rel,target);
    //     if(alreadyAdded){
    //         console.log("Duplicate Relationship");
    //     }else{
    //     let relName = `${source.variable}_${rel}_${target.variable}`;
    //     let relVariable = "rel_"+utils.getUniqueId();
    //     let create = `CREATE (${source.variable})-[${relVariable}:${rel}]->(${target.variable})`;
    //     this.createRels.push(create);
    //     this.relationshipVariables[relName] = true;
    //     if(relProps!==undefined){
    //         let set = `SET ${relVariable} = $${relVariable}_props`;
    //         this.set.push(set);
    //         this.params[`${relVariable}_props`]= relProps;
    //     }}
    // }
    addNewRelationship(rel){
        console.log(rel);
        let alreadyAdded = this.doesRelationshipExist(rel.source,rel.type,rel.target);
        if(alreadyAdded){
            console.log("Duplicate Relationship");
        }else{
        this.createRels.push(rel.create);
        this.relationshipVariables[rel.variable] = true;
        if(rel.params!==undefined){
            this.set.push(rel.set);
            this.params[`${rel.variable}_props`]= rel.params;
        }}
    }

    addTestProperty(){
        for(let key in this.params){
            this.params[key].rollbackProperty = true;
        }
    }

    generateQuery(){
        let query = [];
        if(this.match.length > 0){
            query.push(`MATCH ${this.match.join(",")}`);
        }
        if(this.where.length> 0){
            query.push(`WHERE ${this.where.join(" AND ")}`);
        }
        if(this.createNodes.length> 0){
            query.push(...this.createNodes);
        }
        if(this.createRels.length> 0){
            query.push(...this.createRels);
        }
        if(this.set.length > 0){
            query.push(...this.set);
        }
        this.query = query.join("\n");
        return query.join("\n");

    }
}