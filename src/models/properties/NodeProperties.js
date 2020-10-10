import DateProperty from "./DateProperty";
import LocalDateTimeProperty from "./LocalDateTimeProperty";
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
        data.forEach(field=>{
            if(field.childType!==undefined&&field.mode!==undefined){
                if(field.mode=="date"){
                    this[field.name] = new DateProperty(field);
                }else if(field.mode="localdatetime"){
                    this[field.name] = new LocalDateTimeProperty(field);
                }
            }else if(field.type==""){

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

    
}

export default NodeProperties;