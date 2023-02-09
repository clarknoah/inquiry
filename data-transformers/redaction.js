let fs = require("fs");

let keywords = "".split(" ");

keywords = keywords.map((val, index)=>{
return  `
MATCH (n)
WHERE n.perception =~ '(?i).* ${val} .*'
SET n.perception = 'REDACTED${index}1';

MATCH (n)
WHERE n.perception =~ '(?i).* ${val}'
SET n.perception = 'REDACTED${index}2';

MATCH (n)
WHERE n.perception =~ '(?i)${val} .*'
SET n.perception = 'REDACTED${index}3';

MATCH (n)
WHERE n.perception =~ '(?i)${val}'
SET n.perception = 'REDACTED${index}4';
  `
})

fs.writeFileSync(`./redaction.txt`,keywords.join("\n"));