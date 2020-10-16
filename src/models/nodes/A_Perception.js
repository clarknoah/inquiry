import GraphNode from "../GraphNode";
function getCurrentLocalDateTime(value = null){
    let date = new Date();
    if(value!==null){
        date = new Date(value);
    }

    let offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000))
    let time = date.getTime();
    return time;
}
class A_Perception extends GraphNode{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.defaultQueryKey = "perception";
    }
    // setNewPerceptionTimes(){
    //     this.properties.dateOfPerception.setDefaultValue();
    //     this.properties.dateOfInput.setDefaultValue();
    //     this.properties.timestampOfPerception.setDefaultValue();
    //     this.properties.timestampOfInput.value = this.properties.timestampOfPerception.value;
    //     return this;
    //   }
    // setExistingPerceptionTimes(date){
    //     this.properties.dateOfPerception.setValue(date);
    //     this.properties.dateOfInput.setDefaultValue();
    //     this.properties.timestampOfPerception.setValueByDate(date);
    //     this.properties.timestampOfInput.setDefaultValue();
    //     return this;
    // }

}

export default A_Perception