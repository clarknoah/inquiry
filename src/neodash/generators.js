import { v4 as uuidv4 } from "uuid";
let fs = require("fs");

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

const getMonth = (date) => {
  let month = date.getMonth()
  let year = date.getFullYear()
  let start = new Date(year, month, 1).getTime()
  let end = (new Date(year, month + 1).getTime() - 1)
  return { start, end }
}

// Function that accepts a start date and end date, and outputs an array of YYYY-MM strings
const getMonths = (start, end) => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  let months = [];
  let currentDate = new Date(startDate.getTime());
  while (endDate.getTime() >= currentDate.getTime()) {
    let month = (currentDate.getMonth() + 1).toString();
    let year = currentDate.getFullYear().toString();
    if(month == 10) month = '10';
    if(parseInt(month) <= 9) month = '0' + month;
    let { start, end } = getMonth(currentDate);
    let obj = {
      title: monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear(),
      value: year + '-' + month,
      start, 
      end
    }
    months.unshift(obj);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

const getWeeks = (start, end) => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  let weeks = [];
  let currentDate = new Date(startDate.getTime());
  while (endDate.getTime() >= currentDate.getTime()) {
    let month = (currentDate.getMonth() + 1).toString();
    let year = currentDate.getFullYear().toString();
    let day = currentDate.getDate().toString();
    let nextDay = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24 * 7));
    if(month == 10) month = '10';
    if(parseInt(month) <= 9) month = '0' + month;
    let obj = {
      title: day+" - "+nextDay.getDate().toString()+" "+monthNames[nextDay.getMonth()] + ' ' + nextDay.getFullYear(),
      value: year + '-' + month,
      start: currentDate.getTime(),
      end: nextDay.getTime()
    }
    weeks.unshift(obj);
    currentDate = nextDay;
  }
  return weeks;
};

let months = getMonths('2020-07', new Date().toISOString().split('T')[0].slice(0,7));
let weeks = getWeeks('2022-01', new Date().toISOString().split('T')[0]);
let email = "noahbc08@gmail.com";


const generateRangedThoughts = ({width, type, height, start, end, title}) => {
  let query = `
  MATCH (noah:User {email:"${email}"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)
  WHERE mt.timestampOfPerception < ${end}
  AND mt.timestampOfPerception > ${start}
  RETURN distinct at.perception, count(distinct mt)
  ORDER BY count(distinct mt) DESC
  LIMIT 10
  `
  return {
      title,
      "query": query,
      "width": width,
      "type": type,
      "height": height,
      "selection": {
        "index": "at.perception",
        "value": "count(distinct mt)",
        "key": "(none)"
      },
      "settings": {}
    }
}
const generateWordCount = ({width, type, height, start, end, title}) => {
  let query = `
  MATCH (noah:User {email:"${email}"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
  WHERE mt.timestampOfPerception > ${start}
  AND mt.timestampOfPerception <  ${end}
  AND t.trackerType="passiveFlow"
  with mt, split(mt.perception, " ") as keywords
  unwind keywords as kList
  return kList, count(kList)
  ORDER BY count(kList) DESC
  LIMIT 100
  `
  return {
      title,
      "query": query,
      "width": width,
      "type": type,
      "height": height,
      "selection": {
        "index": "kList",
        "value": "count(kList)",
        "key": "(none)"
      },
      "settings": {}
    }
}
const generateRangedHedonicThoughts = ({width, type, height, start, end, title, hedonic, keywords=[]}) => {
  keywords = keywords.map((keyword, index)=>{
    let obj = {
      match: `(t)-[:PERCEIVED]->(keyword${index})`,
      where: `AND keyword${index}.perception =~ '.*${keyword}.*'`
  }
  return obj;
  })

  let query = `
  MATCH (noah:User {email:"${email}"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
  ${keywords.length > 0 ? `,${keywords.map(match=>match.match).join(",")} ` : ""}
  WHERE mt.timestampOfPerception < ${end}
  AND mt.timestampOfPerception > ${start}
  ${keywords.length > 0 ? `,${keywords.map(match=>match.where).join(" ")} ` : ""}
  ${ hedonic ?  `AND mt.hedonicAffect = "${hedonic}"` : "" }
  RETURN distinct at.perception, count(distinct mt)
  ORDER BY count(distinct mt) DESC
  LIMIT 10
  `
  return {
      title,
      "query": query,
      "width": width,
      "type": type,
      "height": height,
      "selection": {
        "index": "at.perception",
        "value": "count(distinct mt)",
        "key": "(none)"
      },
      "settings": {}
    }
}

const generateRangedKeywords = ({width, type, height, start, end, title, keywords=[]}) => {
  let previousKeywords = [];

  keywords = keywords.map((keyword, index)=>{

    let obj = {
      match: `MATCH (t)-[:PERCEIVED]->(keyword${index})`,
      where: `WHERE keyword${index}.perception =~ '(?i).*${keyword}.*'`,
      with: `WITH t, totalCount, toFloat(count(distinct keyword${index})) as keyword${index}Count ${previousKeywords.length > 0 ? ", " + previousKeywords.join(", ") : ""}`,
      return: `sum(keyword${index}Count) as \`${keyword} Total\`, round((sum(keyword${index}Count)/sum(totalCount)*100)) as \`%${keyword}\``
      
  }
  previousKeywords.unshift(`keyword${index}Count`);
  return obj;
  })

  

  let query = `
MATCH (noah:User {email:"${email}"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
WHERE mt.timestampOfPerception < ${end}
AND mt.timestampOfPerception > ${start}
with t, toFloat(count(distinct mt)) as totalCount
${keywords.map(keyword=>`${keyword.match}\n${keyword.where}\n${keyword.with}`).join("\n")}
RETURN 
sum(totalCount) as \`Total Thoughts\`,
${keywords.map(keyword=>keyword.return).join(",\n")}

  `
  return {
      title,
      "query": query,
      "width": width,
      "type": type,
      "height": height,
      "selection": {
        "index": "at.perception",
        "value": "count(distinct mt)",
        "key": "(none)"
      },
      "settings": {}
    }
}

const generateRangedHedonic = ({width, type, height, start, end, title}) => {
        let query = `
        MATCH (noah:User {email:"${email}"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)
        WHERE mt.timestampOfPerception < ${end}
        AND mt.timestampOfPerception > ${start}
        RETURN distinct mt.hedonicAffect, count(distinct mt)
        ORDER BY count(distinct mt) DESC
        LIMIT 10
        `
        return {
            title,
            "query": query,
            "width": width,
            "type": type,
            "height": height,
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {
                "styleRules": [
                  {
                    "field": "mt.hedonicAffect",
                    "condition": "=",
                    "value": "positive",
                    "customization": `${type} color`,
                    "customizationValue": "#00ff00"
                  },
                  {
                    "field": "mt.hedonicAffect",
                    "condition": "=",
                    "value": "negative",
                    "customization": `${type} color`,
                    "customizationValue": "#ff0000"
                  },
                  {
                    "field": "mt.hedonicAffect",
                    "condition": "=",
                    "value": "neutral",
                    "customization": `${type} color`,
                    "customizationValue": "#fff700"
                  },
                  {
                    "field": "mt.hedonicAffect",
                    "condition": "=",
                    "value": "unassigned",
                    "customization": `${type} color`,
                    "customizationValue": "#adadad"
                  }
                ]
              }
          }
}


const generateRangedHedonicAndThoughts = ({width, type, height, range}) => {
        let report = [];
        let hedonic = "negative";
        let keywords = [
          "pussy",
          "patien"
        ]
        range.map(({start, end, title})=>{
            report.push(generateRangedThoughts({width, type, height, start, end, title}));
            report.push(generateRangedHedonic({width, type:"bar", height, start, end, title}));
            report.push(generateRangedHedonicThoughts({width, type:"table", height, start, end, title, hedonic}));
           // report.push(generateRangedKeywords({width, type:"table", height, start, end, title, hedonic, keywords}));

        })
        return report;
    }


const generateRangedWordCount = ({width, type, height, range}) => {
  let report = [];
  range.map(({start, end, title})=>{
      report.push(generateWordCount({width, type, height, start, end, title}));

  })
  return report;
}





 let generateDashboard = (userEmail) => {
  email = userEmail;
  let monthlyHedonicAndThoughts = {
    "title": "Monthly Hedonic and Thoughts",
    "reports":generateRangedHedonicAndThoughts({width:"4",height:"3",type:"pie", range:months})
  };
  
  let monthlyKeywords = {
    "title": "Monthly Top 100 Keywords",
    "reports":generateRangedWordCount({width:"12",height:"6",type:"bar", range:months})
  };
  let weeklyHedonicAndThoughts = {
    "title": "Weekly Hedonic and Thoughts",
    "reports":generateRangedHedonicAndThoughts({width:"4",height:"3",type:"pie", range:weeks})
  };

  let iAmNeoDash = {
    "title": "Sense Reporting Dashboard",
    "version": "2.0",
    "settings": {
      "pagenumber": 1,
      "editable": true,
      "fullscreenEnabled": true,
      "parameters": {}
    },
    "pages": [

    ]
  }

  iAmNeoDash.pages.push(monthlyHedonicAndThoughts, weeklyHedonicAndThoughts, monthlyKeywords);

  return iAmNeoDash;
};

// Create a file in current directory named "dashboard.json"
// fs.writeFileSync("./dashboard.json", JSON.stringify(iAmNeoDash));

export default generateDashboard;