import NodeProperty from "./NodeProperty.js";

function getCurrentLocaleDate(){
    let date = new Date();
    let offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0];
}

class DateProperty extends NodeProperty{
    constructor(data){
        super(data);
    }

    setValue(value = getCurrentLocaleDate()){
        
        this.value = value;
    }
}

export default DateProperty;