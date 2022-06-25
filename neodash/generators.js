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

let months = getMonths('2020-07', '2022-06');
let weeks = getWeeks('2022-01', '2022-06-10');


const generateRangedThoughts = ({width, type, height, start, end, title}) => {
  let query = `
  MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)
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
const generateRangedHedonicThoughts = ({width, type, height, start, end, title, hedonic, keywords=[]}) => {
  keywords = keywords.map((keyword, index)=>{
    let obj = {
      match: `(t)-[:PERCEIVED]->(keyword${index})`,
      where: `AND keyword${index}.perception =~ '.*${keyword}.*'`
  }
  return obj;
  })

  let query = `
  MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
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

    console.log(previousKeywords)
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
MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)<-[:PERCEIVED]-(t:Thought_Tracker)
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
        MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)
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
            report.push(generateRangedKeywords({width, type:"table", height, start, end, title, hedonic, keywords}));

        })
        return report;
    }



let iAmNeoDash = {
    "title": "iAm Dashboard",
    "version": "2.0",
    "settings": {
      "pagenumber": 1,
      "editable": true,
      "fullscreenEnabled": true,
      "parameters": {}
    },
    "pages": [
      {
        "title": "Monthly View",
        "reports": [
          {
            "title": "Last Month Most Frequent Thoughts",
            "query": "\n\n\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception > (datetime().epochMillis - (4*604800000))\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "1-2 Months Frequency",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (4 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (8 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "2-3 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (8 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (12 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "3-4 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (12 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (16 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "4-5 Months",
            "query": "\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (16 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (20 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "5-6 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (20 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (24 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "6-7 Months",
            "query": "\n\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (24 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (28 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "7-8 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (28 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (32 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "8-9 Months",
            "query": "\n\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (32 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (36 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "9-10 Months",
            "query": "\n\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (36 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (40 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "10-11 Months",
            "query": "\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (40 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (44 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "11-12 Months",
            "query": "\nMATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (44 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (48 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "12-13 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (48 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (52 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "13-14 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (52 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (56 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "14-15 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (56 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (60 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "15-16 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (60 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (64 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n\n\n\n\n\n\n\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "16-17 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (64 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (68 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "17-18 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (68 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (72 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "18-19 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (72 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (76 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "19-20 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (76 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (80 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "20-21 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (80 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (84 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "21-22 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (84 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (88 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "22-23 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (88 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (92 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "23-24 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (92 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (96 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "24-25 Months",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (96 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (100 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          }
        ]
      },
      {
        "title": "Weekly View",
        "reports": [
          {
            "title": "Last 7 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception > (datetime().epochMillis - (1*604800000))\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "7 - 14 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (1 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (2 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "14 - 21 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (2 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (3 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "21 - 28 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (3 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (4 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "28 - 35 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (4 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (5 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "35 - 42 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (5 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (6 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "42 - 49 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (6 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (7 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "49 - 56 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (7 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (8 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          },
          {
            "title": "56 - 63 Days",
            "query": "MATCH (noah:User {firstName:\"Noah\"})-[:HAS_ABSTRACT]->(at:A_Thought)<-[:MANIFESTATION_OF]-(mt:M_Thought)\nWHERE mt.timestampOfPerception < datetime().epochMillis - (8 * 604800000)\nAND mt.timestampOfPerception > datetime().epochMillis - (9 * 604800000)\nRETURN distinct at.perception, count(distinct mt)\nORDER BY count(distinct mt) DESC\nLIMIT 25\n\n",
            "width": "4",
            "type": "pie",
            "height": "3",
            "selection": {
              "index": "at.perception",
              "value": "count(distinct mt)",
              "key": "(none)"
            },
            "settings": {}
          }
        ]
      }
    ]
  }



let monthlyHedonicAndThoughts = {
  "title": "Monthly Hedonic and Thoughts",
  "reports":generateRangedHedonicAndThoughts({width:"3",height:"3",type:"pie", range:months})
};
let weeklyHedonicAndThoughts = {
  "title": "Weekly Hedonic and Thoughts",
  "reports":generateRangedHedonicAndThoughts({width:"3",height:"3",type:"pie", range:weeks})
};

iAmNeoDash.pages.push(monthlyHedonicAndThoughts, weeklyHedonicAndThoughts);

// Create a file in current directory named "dashboard.json"
fs.writeFileSync("./dashboard.json", JSON.stringify(iAmNeoDash));
