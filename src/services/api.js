import neo4j from "neo4j-driver";

var driver = neo4j.driver(
  "neo4j://localhost",
  neo4j.auth.basic("neo4j", "neo4j")
);

let api = {
  nodeListQuery:function(label, field, queryText, limit = 5, skip=0){
    let query = `
    MATCH (user:User)-[:HAS_ABSTRACT]->(n:${label})
    WHERE n.${field} =~ $text AND ID(user)=${localStorage.getItem("activeUser_id")}
    RETURN n
    ORDER BY size(n.${field}) ASC
    SKIP ${skip}
    LIMIT ${limit}
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
  nodeListQuerySize:function(label, field, queryText=undefined, limit = 5, skip=0){
    let query = `
    MATCH (user:User)-[:HAS_ABSTRACT]->(n:A_${label})<-[:MANIFESTATION_OF]-(m:M_${label})
    WHERE ${queryText!==undefined ? `n.${field} =~ $text AND` : ""}ID(user)=${localStorage.getItem("activeUser_id")} AND n.hedonicAffect = "unassigned"
    RETURN n, count(distinct m)
    ORDER BY count(distinct m) DESC
    SKIP ${skip}
    LIMIT ${limit}
    `
    let params={
      text:`(?i)${queryText}.*`
    }
   
    return driver.session().run(query,params)
      .then(results=>{

        return results.records.map((val)=>{
            let node = val._fields[0];
            node.count = val._fields[1];
            node.identity = node.identity.low;
            node.name = node.properties[field];
            return node;
        });
      })
  },
  updateNode:function(id,props){
    let query = `
    MATCH (node)
    WHERE ID(node) = ${id}
    SET node = $props
    return properties(node)
    `
    let params={
      props: props
    }
   
    return driver.session().run(query,params)
      .then(results=>{
        console.log(results);
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
  },
  login:(user,pass)=>{
    let query = `
    MATCH (n:User)
    WHERE n.email = $user AND n.password = $password
    return n
    `
    let params = {user:user,password:pass};
    return driver.session().run(query, params)
      .then(res=>{
        let response = {};
        if(res.records.length ===1){
          response.success=true;
          response.user = res.records[0]._fields[0];
        }else{
          response.success=false;
          response.message="No user found, check email and password";
        }
        return response;
      })
  },
  registerUser:(params)=>{
    let query = `CREATE (user:User)
    SET user = $user
    return user
    `
    return driver.session().run(query,{user:params})
      .then(res=>{
        return {
          success:true,
          user: res.records[0]._fields[0]
        }
      })
      .catch(err=>{
        return {
          success:false,
          error:err
        }
      })
  },
  getThoughtTimeSeries:()=>{
    let query = `
    MATCH (n:User {firstName:"Noah"})-[:HAS_ABSTRACT]->(a:A_Thought)<-[:MANIFESTATION_OF]-(m:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
    RETURN {date:m.dateOfPerception, perception:m.perception,timestamp:m.timestampOfPerception, hedonicAffect:a.hedonicAffect, trackerId:id(t), duration:t.duration}
    `
    return driver.session().run(query)
  },
  getThoughtTrackerTimeSeries:()=>{
    let query = `
    MATCH (n:User {firstName:"Noah"})-[:CONDUCTED_SESSION]->(tracker:Thought_Tracker)
    RETURN tracker
    `
    return driver.session().run(query)
  },
  getTrackerDatesAndDuration:()=>{
    let query = `
    MATCH (user:User {firstName:"Noah"})-[:CONDUCTED_SESSION]->(n:Thought_Tracker)
    RETURN distinct n.date, collect(n.duration), collect(n.timestampOfStart)
    ORDER BY n.date
    `
    return driver.session().run(query)
      .then(res=>{
        let dates = {};
        res.records.forEach(field=>{
          let totalDuration = field._fields[1].reduce((a,b)=>a+b);
          let date = 
          dates[field._fields[0]]={
            date:field._fields[0],
            duration:field._fields[1],
            totalDuration:totalDuration

          }
        })
        return dates;
      })
  },
  getTrackerDatesAndDuration2:()=>{
    let query = `
    MATCH (user:User {firstName:"Noah"})-[:CONDUCTED_SESSION]->(n:Thought_Tracker)
    RETURN n
    `
    return driver.session().run(query)
      .then(res=>{
        let dates = {};
        res.records.forEach(field=>{
          let tracker = field._fields[0];
          let date;
          console.log(tracker);
          if(tracker.properties.hasOwnProperty("timestampOfStart")){

            date = new Date(tracker.properties.timestampOfStart-(300*1000*60)).toISOString().split('T')[0];
          }else{
            date = tracker.properties.date;
          }
          if(dates.hasOwnProperty(date)){
            dates[date].totalDuration += tracker.properties.duration;
            dates[date].duration.push(tracker.properties.duration);
          }else{
            dates[date] = {
              date:date,
              duration: [tracker.properties.duration],
              totalDuration:tracker.properties.duration
            }
          }
        })
        return dates;
      })
  }
}


export default api;


