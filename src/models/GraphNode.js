import NodeProperties from "./properties/NodeProperties";
import NodeRelationships from "./NodeRelationships";
import utils from "../services/utils";
class GraphNode{
    constructor(data, id=undefined, properties=undefined){
        this.labels = [data.collectionName];
        this.properties = new NodeProperties(data.properties);
        this.relationships = new NodeRelationships(data.relationships);
        this.variable = `node_${utils.getUniqueId()}`
        this.exists = false;
        if(id!==undefined && properties!== undefined){
            this.id = id;
            this.exists = true;
            this.setExistingProperties(properties);
        }
    }

    addLabel(label){
        this.labels.push(label);
    }
    generateCypherTargetRelationship(target, rel){
        return `CREATE (${this.variable})-[:${rel}]->(${target.variable})`
    }
    generateCypherSourceRelationship(source, rel){
        return `CREATE (${source.variable})-[:${rel}]->(${this.variable})`
    }
    generateCypherCreateNode(){
        let data = {};
        data.create = `CREATE (${this.variable}:${this.labels.join(":")})`
        data.set = `SET ${this.variable} = $${this.variable}_props`
        data.paramVariable = this.variable+"_props";
        data.properties = this.getPropertyObject();
        return data;
    }
    generateCypherMatchNode(){
        let data = {};
        data.match = `MATCH (${this.variable})`
        data.where = `WHERE id(${this.variable})=${this.id}`;
        return data;
    }
    setMatchingProperties(node){
        for(let key in this.properties){
            for(let nodeKey in node.properties){
                if(nodeKey==key){
                    this.properties[key].value = node.properties[nodeKey].value;
                }
            }
        }
        return this;
    }
    getPropertyObject(){
        let props = {};
        let required = [];
        for(let key in this.properties){
            let propertyValue = this.properties[key].value;
            if(propertyValue!==undefined){
                props[key]=propertyValue;
            } else if (propertyValue==undefined&& this.properties[key].required==true){
                required.push(key);
            }

        }
        if(required.length == 0){
            return props;
        }else{
            throw `${this.variable}:${this.labels.join(":")} is missing the following required properties: ${required.join(", ")}`
        }
    }
    setProperty(propertyKey, value){
        this.properties[propertyKey].setValue(value);
        return this;
    }
    addRelationship(relationshipKey, target){
       let rel= this.relationships[relationshipKey].addRelationship(this.variable,target);
       return rel;
    }
    setDefaultProperty(propertyKey){
        this.properties[propertyKey].setValue();
        return this;
    }
    setAllDefaultProperties(){
        for(let key in this.properties){
            let prop = this.properties[key];
            if(prop.value==undefined 
                && prop.required==true 
                && prop.__proto__.hasOwnProperty('setDefaultValue')){
                    this.properties[key].setDefaultValue();
            }
        }
        return this;
    }
    checkForUpdatedProperties(){
        let update = false;
        this.properties.propertyKeys.forEach(key=>{
            if(this.properties[key].changed==true){
                update = true;
            }
        })
        if(update){
            return this.getPropertyObject()
        }else{
            return false
        }
    }
    setExistingProperties(props){
        for(let key in props){
            try{
                if(this.properties.hasOwnProperty(key)){
                    this.properties[key].setInitialValue(props[key]);
                }
            }catch(err){
                console.log(err);
                throw `${this.variable}(${this.labels.join(":")}) is missing ${key}`;
            }
            
        }
    }
}

export default GraphNode;