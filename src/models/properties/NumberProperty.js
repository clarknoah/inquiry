import NodeProperty from "./NodeProperty";

export default class NumberProperty extends NodeProperty{
    constructor(data){
        super(data);
 
    }
    setValue(value){
        this.value = parseInt(value);
    }
}