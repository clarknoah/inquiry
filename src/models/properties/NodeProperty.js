class NodeProperty{
    constructor(data){
        //console.log(data);
        this.value = undefined;
        this.originalValue = undefined;
        this.meta = data;
        this.changed=false;
        this.required = data.required;
        this.edittable = true;
    }

    setValue(value){
        this.value = value;
        if(this.value!==this.originalValue){
            this.changed = true;
        }else{
            this.changed = false;
        }
    }
    setInitialValue(value){
        this.originalValue = value;
        this.value = value;
    }
    getValue(){
        return this.value;
    }


}

export default NodeProperty;