import DateProperty from "./DateProperty";
import LocalDateTimeProperty from "./LocalDateTimeProperty";
import NumberProperty from "./NumberProperty.js";
import NodeProperty from "./NodeProperty";
class NodeProperties{
    constructor(data){
        this.propertyKeys = this.setPropertyKeys(data);
        this.setProperties(data);
    }
    getPropertiesObject(){

    }
    setPropertyKeys(data){
        return data.map(field=>field.name);
    }
    setProperties(data){
        console.log(data.filter(field=>field.enum.length >0));
        data.forEach(field=>{
            if(field.type==="string" && field.childType ==="temporal"){
                if(field.mode=="date"){
                    this[field.name] = new DateProperty(field);
                }else if(field.mode="localdatetime"){
                    this[field.name] = new LocalDateTimeProperty(field);
                }
            }else if(field.type=="string"){
                this[field.name] = new NodeProperty(field);
            }else if(field.type=="numeric"){
                this[field.name] = new NumberProperty(field);
            }else if(field.type=="boolean" || field.type=="array"){
                this[field.name] = new NodeProperty(field);
            }
        })
    }

    generateCypherPropertyObject(){
        let properties = {};
        this.propertyKeys.forEach(key=>{
            if(this[key]!==null&&this[key!==undefined])
            properties[key]=this[key].value;
        })
        return properties;
    }
    setAllDefaults(){
        //Iterate through all properties with default values and set them
    }

    
}

export default NodeProperties;