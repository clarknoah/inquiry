import neo4j from "neo4j-driver";

var driver = neo4j.driver(
  "neo4j://localhost",
  neo4j.auth.basic("neo4j", "neo4j")
);

let api = {
  nodeListQuery:function(label, field, queryText){
    let query = `
    MATCH (n:${label})
    WHERE n.${field} =~ $text
    RETURN n
    `
    let params={
      text:`(?i).*${queryText}.*`
    }
    console.log(query);
    return driver.session().run(query,params)
      .then(results=>{
        console.log(results);
        //return results;
        return results.records.map((val)=>{
            let node = val._fields[0];
            node.identity = node.identity.low;
            node.name = node.properties[field];
            return node;
        });
      })
  },
  submitInquiryPayload:function(payload){

  },
  prepareInquiryForSubmission:function(data){
    let postObject = {
      loadVariables:{},
      createNodes:{},
      createRels:{}
    }

  },
  submitThoughtPayload: function(){

  },
  submitThought:function(thought){
    if(thought.properties.thought.length > 0){
      let query;
      query = `CREATE (${thought.manifestedVar}:M_Thought)
      SET ${thought.manifestedVar} = $data
      `
      if(thought.exists){
        query = `MATCH (${thought.abstractVar}:A_Thought)
        WHERE id(${thought.abstractVar}) = ${thought.nodeId}
        `+query+`
        CREATE (${thought.manifestedVar})-[:MANIFESTATION_OF]->(${thought.abstractVar})
        `
        return driver.session().run(query, {data:thought.properties})
      }else{
        query+=`
        CREATE (${thought.manifestedVar}_a:A_Thought)
        SET ${thought.manifestedVar}_a = $data_a
        CREATE (${thought.manifestedVar})-[:MANIFESTATION_OF]->(${thought.manifestedVar}_a)
        `
        let a_thought = {thought:thought.properties.thought};
        console.log(query);
        return driver.session().run(query, {data:thought.properties,data_a:a_thought})
      }
      console.log(query);
   
  
    }else{
      console.log("Empty Thought...haha")
    }

  }
}


export default api;
