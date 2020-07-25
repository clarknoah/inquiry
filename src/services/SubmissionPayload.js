import utils from "./utils";

class SubmissionPayload{
  constructor(){
    this.nodeVariables = {};
    this.createNodes = {};
    this.createRelationships = [];
  }

  addInquiredThought(thought){
    let thought = thought.properties.thought;
    let abstractVar = this.doesAbstractVarExist('thought',thought)
    if(thought.exists){

      this.nodeVariables[thought.abstractVar] = thought.nodeId;
      this.createNodes[thought.manifestedVar] = {
        properties:thought.properties,
        labels:["M_Thought"]
      }

      let rel = {
        relVar:utils.getRelVariable(),
        sourceVar:thought.manifestedVariable,
        targetVar:thought.abstractVariable,
        relType:"MANIFESTATION_OF",
        properties:{}
      }
      this.createRelationships.push(rel);
    }else if(!thought.exists && abstractVar === false){
      let abstractThought = {
        properties:thought.properties,
        labels:["Abstract_Thought"],
      }
    }else if(!thought.exists && abstractVar !== false){
      let rel = {
        relVar:utils.getRelVariable(),
        sourceVar:thought.manifestedVariable,
        targetVar:abstractVar,
        relType:"MANIFESTATION_OF",
        properties:{}
      }
      this.createRelationships.push(rel);
    }
  }

  doesAbstractVarExist(property, value){
    /*
      This method should return either `false` if an abstract thought
      doesn't already exist, or it should return the nodeVariable
      for that particular Abstract node
    */
    let returnObject = false;
    for (element in this.createNodes){
      if(this.createNodes[element].properties[type]===value){
        returnObject = element;
      }
    }
    return returnObject;
  }
  addAbstractVar(labels, properties){
    /*
      1. Create Abstract Variable
      2.
    */
    let abstractThought = {
      labels:labels,
      properties:
    }
  }



}
