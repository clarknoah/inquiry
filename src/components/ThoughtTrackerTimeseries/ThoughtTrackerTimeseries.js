import React, { Component } from 'react';
import "./ThoughtTrackerTimeseries.css";
import api from "../../services/api";
import * as d3 from "d3";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chart from 'react-apexcharts'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
/*
  This chart should do the following:

  1. Import all thought data 
  2. Parse thought all datapoints to correct any irregularities
  

  Filters: 
    1. Filter by Date Rante 
    2. Group thoughts by day and month
    3. Frequency within Time Interval
*/

// Class Based React Component

let day = 1000 * 60 * 60 * 24;
let twentyFourHours = 1000 * 60 * 60 * 24 * 15;
let today = new Date(Date.now() + day).toISOString().split(".")[0];
let yesterday = new Date(Date.now() - twentyFourHours).toISOString().split(".")[0];
class ThoughtTrackerTimeseries extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.chart = React.createRef();
    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtTrackerTimeseries",
      showHedonic: "both",
      source: [],
      showAverageThoughtsPerMinute: true,
      showAverageThoughtGap: true,
      showShortestThoughtGap: true,
      showNewThoughtCount: true,
      showExistingThoughtCount: true,
      showThoughtCount: true,
      showLongestThoughtGap: true,
      trackers: {},
      chartData: [],
      limitMin: 4,
      limitMax: 999999999999,
      startTimestamp: yesterday,
      endTimestamp: today,
      options: {
        chart: {
          type: 'line',
          stacked: false,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 8,
        },
        title: {
          text: 'Thought Tracker Timeline',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 0,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val
            },
          },
          title: {
            text: 'Thought Tracker Numbers'
          },
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      }
    };
  }


  // Runs after Component is loaded in the broswer
  componentDidMount() {
    // window.addEventListener('resize', () => {
    //   if (this.state.width != getComputedStyle(this.chart.current).width) {
    //     this.setState({
    //       width: getComputedStyle(this.chart.current).width
    //     })
    //   }
    // })
    console.log(this.chart.current);
    api.getThoughtTrackerTimeSeries()
      .then(res => {
        res = res.records.map(field => {
          return field._fields[0];
        });
        console.log(res.length);

        this.setState({
          source: res,
          width: getComputedStyle(this.chart.current).width
        }, this.updateChart)

      })
  }



  convertToDate = (value) => {
    return new Date(value).toISOString().split('T')[0];
  }

  sanitizeData = (data) => {
    data.forEach(value => {
      value.data.forEach(record => {
        if (typeof record.x !== "string") {
          console.log(record);
        }
      })
    })
  }
  // Runs after a component has been updated
  componentDidUpdate() { }

  groupByMonth = () => {

  }

  groupByDay = () => {

  }

  groupByMonth = () => {

  }


  filterByCountMax = (data) => {
    return data.filter(value => {
      return value[1].length < this.state.limitMax;
    })
  }
  filterByCountMin = (data) => {
    return data.filter(value => {
      return value[1].length > this.state.limitMin;
    })
  }
  updateValue = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  filterStartDate = (data) => {

    return data.filter(field => {
      return field.properties.timestampOfStart > new Date(this.state.startTimestamp).getTime();
    })

  }

  filterEndDate = (data) => {

    return data.filter(field => {
      return field.properties.timestampOfStart < new Date(this.state.endTimestamp).getTime();
    })

  }


  addEmptyDates = (data) => {
    let dateRange = [];
    let startTimestamp = new Date(this.state.startTimestamp).getTime();
    let currentTimestamp = startTimestamp;
    let endTimestamp = new Date(this.state.endTimestamp).getTime();
    while (currentTimestamp <= endTimestamp) {
      let date = new Date(currentTimestamp).toISOString().split("T")[0];
      dateRange.push(date);
      currentTimestamp += day;
    }
    data = data.map(field => {
      dateRange.forEach(date => {
        let missingDate = field[1].filter(thoughtDate => {
          return thoughtDate[0] == date;
        }).length === 0;

        if (missingDate) {
          let newDate = [date, null];
          field[1].push(newDate);
        }
      })
      field[1].sort((a, b) => { return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0; })
      return field;
    })

    console.log(dateRange, data, this.state.startTimestamp, this.state.endTimestamp);
    return data;
  }


  // getDailyThoughtCount = (data) => {
  //   let trackers = this.state.trackers;
  //   let dailyTotal = d3.rollups(data, v=>v.length,d=>d.date);
  //   let dailyNormalized = JSON.parse(JSON.stringify(dailyTotal));
  //   dailyNormalized = dailyNormalized.map(field=>{
  //     if(field[0]==="2020-10-27"){
  //       let frank = field[1] * (300/trackers[field[0]].totalDuration)
  //       console.log(frank, field[1], trackers[field[0]].totalDuration)
  //     }
  //     field[1] = field[1] * (300/trackers[field[0]].totalDuration)
  //     return field;
  //   })
  //   console.log(dailyTotal, dailyNormalized);
  //   let daily = [["Daily Total",dailyTotal],["Daily Average (5 Minutes)",dailyNormalized]];
  //   console.log(trackers);
  //   return daily;
  // }

  getPropertyMap = (data, property, name) => {
    data = data.map(field => {
      let value = field.properties[property]
      if (isNaN(value)) {
        value = undefined;
      } else {

      }
      return [field.properties.timestampOfStart - (1000 * 60 * 60 * 5), value];

    })
    data = data.filter(field => {
      return field[1] !== undefined
    });
    data.sort((a, b) => {
      return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;
    })
    console.log([name, data])
    return [name, data];
  }

  updateChart = () => {
    let data = this.state.source;
    console.log(data);
    data = this.filterStartDate(data);
    data = this.filterEndDate(data);
    console.log(data);
    let categories = [];
    //data = d3.groups(data, d=>d.properties.date+": "+d.identity.low, d=>d.properties.distinctNewThoughtCount);
    console.log(data);
    categories.push(this.getPropertyMap(data, "averageThoughtGap", "Average Time Between Thoughts"))
    categories.push(this.getPropertyMap(data, "averageThoughtsPerMinute", "Average Thoughts Per Minute"))
    categories.push(this.getPropertyMap(data, "shortestThoughtGap", "Shortest Thought Gap (Seconds)"))
    categories.push(this.getPropertyMap(data, "newThoughtCount", "New Thought Count"))
    categories.push(this.getPropertyMap(data, "existingThoughtCount", "Existing Thought Count"))
    categories.push(this.getPropertyMap(data, "thoughtCount", "Thought Count (Total)"))
    categories.push(this.getPropertyMap(data, "longestThoughtGap", "Longest Thought Gap"))
    // categories.push(this.getPropertyMap(data,"thoughtCount", "Thought Count"))
    // categories.push(this.getPropertyMap(data,"thoughtCount", "Thought Count"))
    // let hedonic = this.getHedonicRatio(data);
    // let daily = this.getDailyThoughtCount(data);
    // data = d3.rollups(data, v => v.length, d => d.perception, d => d.date)
    // console.log(hedonic);
    // data = this.filterByCountMin(data);
    // data = this.filterByCountMax(data);
    // //data = this.normalizeData(data);
    // data.push(...daily);
    // if (this.state.showHedonic == "both") {
    //   data.push(...hedonic);

    // } else if (this.state.showHedonic == "thought") {

    // } else if (this.state.showHedonic == "hedonic") {
    //   data = hedonic;
    //   data.push(...daily);
    // }
    //data = this.addEmptyDates(data);
    //console.log(data);
    let mappedData = categories.map(value => {
      let obj = {};
      obj.id = value[0];
      obj.name = value[0];
      obj.data = value[1].map(field => {
        let info = {};
        info.x = field[0];
        info.y = field[1];
        return info;
      })
      return obj;
    })
    this.setState({
      chartData: mappedData
    });
  }


  // Runs right before a component is removed from the DOM
  componentWillUnmount() { }

  render() {
    return (
      <div  className={this.state.classList}>
        <div className="ThoughtTrackerTimeseries-filters">
      <Button onClick={this.updateChart}>Update</Button>
      <FormControlLabel control={<Switch checked={this.state.showAverageThoughtGap} value={this.state.showAverageThoughtGap} onChange={(e)=>{this.setState({showAverageThoughtGap:!e.target.value})}}/>} label="Time Between Thoughts" />
      <FormControlLabel control={<Switch />} label="Thought Count" />

            <TextField
              id="datetime-local"
              label="Start Date"
              type="datetime-local"
              onChange={(e) => {
                let time = new Date(e.target.value).getTime();
                this.updateValue("startTimestamp", time)

              }}
              defaultValue={yesterday}
              className="ThoughtTimeseries-field"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-local"
              label="End Date"
              type="datetime-local"
              onChange={(e) => {
                let time = new Date(e.target.value).getTime();
                this.updateValue("endTimestamp", time)

              }}
              className="ThoughtTimeseries-field"
              defaultValue={today}
              InputLabelProps={{
                shrink: true,
              }}
            />

        </div>

        <div ref={this.chart} className="ThoughtTrackerTimeseries-chart">

        { this.state.chartData.length > 0 ?
          (<Chart options={this.state.options} series={this.state.chartData} type="line" height={"90%"} width={this.state.width} />)
          : null}
          </div>
      </div>
    );
  }
}

export default ThoughtTrackerTimeseries;
