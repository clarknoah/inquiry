import NodeProperty from "./NodeProperty.js";

function getCurrentLocalDateTime(){
    let date = new Date();
    let offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000))
    return date.getTime();
}

class LocalDateTimeProperty extends NodeProperty{
    constructor(data){
        super(data);
    }

    setValue(value = getCurrentLocalDateTime()){
        
        this.value = value;
    }
}

export default LocalDateTimeProperty;