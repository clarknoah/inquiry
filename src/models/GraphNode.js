import NodeProperties from "./properties/NodeProperties";
import utils from "../services/utils";
class GraphNode{
    constructor(data, id=undefined, properties=undefined){
        this.labels = [data.collectionName];
        this.properties = new NodeProperties(data.properties);
        this.relationships = {};
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
        for(let key in this.properties){
            let propertyValue = this.properties[key].value;
            if(propertyValue!==undefined){
                props[key]=propertyValue;
            }
        }
        return props;
    }
    setProperty(propertyKey, value){
        this.properties[propertyKey].setValue(value);
        return this;
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
    setExistingProperties(props){
        console.log(props);
        for(let key in props){
            this.properties[key].value = props[key];
        }
    }
}

export default GraphNode;