import define1 from "./6aaa94b294dcd684@1396.js";
import define2 from "./50064204b82fdf22@656.js";
import define3 from "./f3d342db2d382751@886.js";

function _1(md){return(
md`# AutoComplete Usage`
)}

function _db(DatabaseClient){return(
DatabaseClient("securitypal_bigquery")
)}

async function _datanew(db){return(
await db.query(
  `SELECT * FROM EXTERNAL_QUERY("us.prod-postgres-iwyla-replica",
   """SELECT 
        prospect AS prospects,
        SUM(CARDINALITY(questions)) AS qn,  -- Sums of questions
        status AS status
      FROM copilot_aicompletionrequest
      GROUP BY prospects, status
      """
   );`
)
)}

function _aggregatedData(datanew){return(
Object.entries(
  datanew.reduce((acc, d) => {
    if (acc[d.status]) {
      acc[d.status] += d.qn;
    } else {
      acc[d.status] = d.qn;
    }
    return acc;
  }, {})
).map(([status, qn]) => ({ status, qn }))
)}

function _totalValue(aggregatedData){return(
aggregatedData.reduce((sum, d) => sum + d.qn, 0)
)}

function _value(aggregatedData,totalValue){return(
aggregatedData.map((d) => ({
  status: d.status,
  qn: d.qn,
  percentage: ((d.qn / totalValue) * 100).toFixed(2) + "%"
}))
)}

function _chart(PieChart,value,width){return(
PieChart(value, {
  name: (d) => `${d.status}  (${d.percentage})`, // adding percentage beside name
  value: (d) => d.qn,
  width: width,
  height: 550
})
)}

function _10(datanew){return(
console.log(datanew)
)}

function _11(Plot,datanew){return(
Plot.plot({
  width: 2000, // Ensure there is enough width for all labels
  height: 800, // Adjust height as needed
  marginBottom: 250, // Increase margin to accommodate rotated labels
  marginLeft: 100, // Adjust if needed for Y-axis labels
  style: {
    "font-size": "16px" // General font size for axis labels
  },
  y: {
    label: "Number of Questions",
    labelAnchor: "center",
    labelOffset: 60,
    tickSize: 5,
    fontSize: 16 // Increase Y-axis label font size
  },
  x: {
    label: null, // Remove or customize the X-axis label
    tickSize: 10, // Adjust tick size if needed
    fontSize: 14, // Increase font size for X-axis labels
    tickRotate: -45 // Rotate X-axis labels by 45 degrees for better readability
  },
  marks: [
    Plot.barY(datanew, {
      x: "prospects",
      y: "qn",
      sort: { x: "y", reverse: true },
      space: 0.5, // Add space between the bars
      fill: "steelblue"
    }),
    Plot.text(datanew, {
      x: "prospects",
      y: "qn",
      text: (d) => d.qn, // Display the 'qn' value as the label
      dy: -10, // Position above the bars
      textAnchor: "middle",
      fontSize: 14 // Increase font size for data labels
    }),
    Plot.ruleY([0])
  ]
})
)}

async function _datas(db){return(
await db.query(
  `SELECT * FROM EXTERNAL_QUERY("us.prod-postgres-iwyla-replica",
   """SELECT
        prospect AS prospects,
        SUM(CARDINALITY(questions)) AS qn,
created_at as Date,
        TO_CHAR(created_at, 'month') AS month,  -- generating months
        status AS status
      FROM copilot_aicompletionrequest
      GROUP BY prospects, status, month,date
      """
   );`
)
)}

function _parsedData(datas){return(
datas // generating months
  .map((d) => ({
    month: new Date(
      `2023-${new Date(Date.parse(d.month + "1")).getMonth() + 1}-01`
    ),
    qn: d.qn
  }))
  .sort((a, b) => a.month - b.month)
  .map((d) => ({
    month: d.month.toLocaleString("en-US", { month: "short" }), // 'short' gives short month name as 'long' gives full
    qn: d.qn
  }))
)}

function _aggr(d3,parsedData){return(
Array.from(
  d3.group(parsedData, (d) => d.month),
  ([month, values]) => ({
    month: new Date(`2024-${month}-01`), // Parsing to Date format 
    qn: d3.sum(values, (d) => d.qn)
  })
)
)}

function _16(aggr){return(
aggr.sort((a, b) => a.month - b.month)
)}

function _17(Plot,aggr,d3){return(
Plot.plot({
  marks: [
    Plot.lineY(aggr, {
      x: "month",
      y: "qn",
      stroke: "red",
      strokeWidth: 1.5
    }),
    Plot.dot(aggr, {
      x: "month",
      y: "qn",
      fill: "black",
      r: 3
    }),
    Plot.text(aggr, {
      x: "month",
      y: "qn",
      text: (d) => d.qn,
      dy: -10,
      fill: "black",
      fontSize: 10
    }),
    Plot.ruleY([0], {
      stroke: "black",
      strokeWidth: 1
    })
  ],
  x: {
    type: "time",
    domain: d3.extent(aggr, (d) => d.month), // Ensure proper time domain is used
    tickFormat: "%B", // Show full month names (e.g., "January")
    interval: d3.timeMonth.every(1) // Display each month only once
  },
  y: {
    domain: [0, d3.max(aggr, (d) => d.qn)],
    label: "Total Questions",
    grid: true,
    axis: true
  },
  width: 1500,
  height: 500
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("db")).define("db", ["DatabaseClient"], _db);
  const child1 = runtime.module(define1);
  main.import("sqlWhereClauses", child1);
  main.import("dateStr", child1);
  main.variable(observer("datanew")).define("datanew", ["db"], _datanew);
  const child2 = runtime.module(define2);
  main.import("PieChart", child2);
  main.variable(observer("aggregatedData")).define("aggregatedData", ["datanew"], _aggregatedData);
  main.variable(observer("totalValue")).define("totalValue", ["aggregatedData"], _totalValue);
  main.variable(observer("value")).define("value", ["aggregatedData","totalValue"], _value);
  main.variable(observer("chart")).define("chart", ["PieChart","value","width"], _chart);
  main.variable(observer()).define(["datanew"], _10);
  main.variable(observer()).define(["Plot","datanew"], _11);
  main.variable(observer("datas")).define("datas", ["db"], _datas);
  const child3 = runtime.module(define3);
  main.import("plot", child3);
  main.variable(observer("parsedData")).define("parsedData", ["datas"], _parsedData);
  main.variable(observer("aggr")).define("aggr", ["d3","parsedData"], _aggr);
  main.variable(observer()).define(["aggr"], _16);
  main.variable(observer()).define(["Plot","aggr","d3"], _17);
  return main;
}
