import NodeProperty from "./NodeProperty.js";

function getCurrentLocalDateTime(value = null){
    let date = new Date();
    if(value!==null){
        date = new Date(value);
    }

    // let offset = date.getTimezoneOffset();
    // date = new Date(date.getTime() - (offset*60*1000))
    let time = date.getTime();
    return time;
}

class LocalDateTimeProperty extends NodeProperty{
    constructor(data){
        super(data);
    }

    setValue(value = getCurrentLocalDateTime()){
        this.value = value;
    }
    setDefaultValue(){
        this.value = getCurrentLocalDateTime();
    }
    setInitialValue(value){
        if(typeof value=="object"){
            this.value = value.toNumber();
            this.originalValue = value.toNumber();
        }else{
            this.originalValue = value;
            this.value = value;

        }
    }
    setValueByDate(date){
    date = new Date(date);
    let offset = date.getTimezoneOffset();
     date = new Date(date.getTime() - (offset*60*1000))
        this.value = getCurrentLocalDateTime(date.getTime());
    }
}

export default LocalDateTimeProperty;