import neo4j from "neo4j-driver";

var driver = neo4j.driver(
  "neo4j://localhost",
  neo4j.auth.basic("neo4j", "neo4j")
);

let api = {
  nodeListQuery:function(label, field, queryText){
    let query = `
    MATCH (n:${label})
    WHERE n.${field} =~ '(?i).*${queryText}.*'
    RETURN n
    `
    console.log(query);
    return driver.session().run(query)
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

  }
}


export default api;
