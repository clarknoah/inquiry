class NodeProperty{
    constructor(data){
        this.value = undefined;
        this.required = data.required;
    }

    setValue(value){
        this.value = value;
    }
    getValue(){
        return this.value;
    }


}

export default NodeProperty;