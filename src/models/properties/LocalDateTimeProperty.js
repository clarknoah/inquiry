import NodeProperty from "./NodeProperty.js";

function getCurrentLocalDateTime(value = null){
    let date = new Date();
    if(value!==null){
        date = new Date(value);
    }

    let offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000))
    return date.getTime();
}

class LocalDateTimeProperty extends NodeProperty{
    constructor(data){
        super(data);
        console.log(data);
    }

    setValue(value = getCurrentLocalDateTime()){
        this.value = value;
    }
    setDefaultValue(){
        this.value = getCurrentLocalDateTime();
    }
    setValueByDate(date){
        this.value = getCurrentLocalDateTime(date);
    }
}

export default LocalDateTimeProperty;