class NodeProperty{
    constructor(data){
        this.value = undefined;
    }

    setValue(value){
        this.value = value;
    }
    getValue(){
        return this.value;
    }

}

export default NodeProperty;