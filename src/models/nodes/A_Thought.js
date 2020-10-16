import M_Perception from "./M_Perception";
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
class A_Thought extends M_Perception{
    constructor(data, id=undefined, properties=undefined){
        super(data, id, properties);
        this.defaultQueryKey = "perception";
    }
    // setNewThoughtTimes(){
    //     this.properties.dateOfThought.setDefaultValue();
    //     this.properties.dateOfInput.setDefaultValue();
    //     this.properties.timestampOfThought.setDefaultValue();
    //     this.properties.timestampOfInput.value = this.properties.timestampOfThought.value;
    //     return this;
    //   }
    // setExistingThoughtTimes(date){
    //     this.properties.dateOfThought.setValue(date);
    //     this.properties.dateOfInput.setDefaultValue();
    //     this.properties.timestampOfThought.setValueByDate(date);
    //     this.properties.timestampOfInput.setDefaultValue();
    //     return this;
    // }

}

export default A_Thought