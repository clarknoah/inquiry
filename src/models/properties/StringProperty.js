import NodeProperty from "./NodeProperty";

export default class StringProperty extends NodeProperty{
    constructor(data){
        super(data);
        if(data.default!==""){
            this.value = data.default;
        }
    }
}