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
    ORDER BY size(n.${field}) ASC
    LIMIT 5
    `
    let params={
      text:`(?i)${queryText}.*`
    }
   
    return driver.session().run(query,params)
      .then(results=>{

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
  submitThought:function(aThought, mThought){
    console.log(aThought, mThought);
    if(mThought.properties[mThought.defaultQueryKey].value.length > 0){
      let mThoughtQuery = mThought.generateCypherCreateNode();
      let query = [];
      let params = {};
      params[mThoughtQuery.paramVariable] = mThoughtQuery.properties;
      query.push(
          mThoughtQuery.create,
          mThoughtQuery.set,
          mThought.generateCypherTargetRelationship(aThought,'MANIFESTATION_OF')
        );

      if(aThought.exists){
        let aThoughtQuery = aThought.generateCypherMatchNode();
        query.unshift(aThoughtQuery.match, aThoughtQuery.where);

      }else{
        let aThoughtQuery = aThought.generateCypherCreateNode();
        console.log(aThoughtQuery);
        params[aThoughtQuery.paramVariable] = aThoughtQuery.properties;
        query.unshift(aThoughtQuery.create, aThoughtQuery.set)
      }
      console.log(query.join("\n"), params);
      return driver.session().run(query.join("\n"), params)
  
    }else{
      console.log("Empty Thought...haha")
    }

  },cypherQuery:function(query,params=null){
    if(params!==null){
      return driver.session().run(query, params)
    }else{
      return driver.session().run(query);
    }
  }
}


export default api;
