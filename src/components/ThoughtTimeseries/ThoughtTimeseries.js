import React, { Component } from 'react';
import "./ThoughtTimeseries.css";
import api from "../../services/api";
import * as d3 from "d3";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chart from 'react-apexcharts'
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
let twentyFourHours = 1000 * 60 * 60 * 24 *7;
let today = new Date(Date.now()).toISOString().split(".")[0];
let yesterday = new Date(Date.now() - twentyFourHours).toISOString().split(".")[0];
class ThoughtTimeseries extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "ThoughtTimeseries",
      showHedonic:"both",
      source: [],
      trackers:{},
      chartData: [],
      limitMin: 4,
      limitMax: 999999999999,
      startTimestamp: yesterday,
      endTimestamp: today,
      options: {
        chart: {
          type: 'line',
          stacked: false,
          height: 350,
          width:"100%",
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
            text: 'Number of times thought arose that day'
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

    api.getThoughtTimeSeries()
      .then(res => {
        res = res.records.map(field => {
          if (!isNaN(field._fields[0].date)) {
            field._fields[0].date = this.convertToDate(field._fields[0].date)
          }
          return field._fields[0];
        });
        console.log(res.length);
        api.getTrackerDatesAndDuration()
          .then(trackers=>{
            
            this.setState({
              source: res,
              trackers:trackers
            }, this.updateChart)

          })
        // let data = d3.rollups(res, v => v.length, d => d.perception, d => d.date)
        // console.log(data);
        // let mappedData = data.map(value => {
        //   let obj = {};
        //   obj.id = value[0];
        //   obj.name = value[0];
        //   obj.data = value[1].map(field => {
        //     let info = {};
        //     info.x = field[0];
        //     info.y = field[1];
        //     return info;
        //   })
        //   return obj;
        // })
        // console.log(mappedData);
        // mappedData = this.filterByCount(mappedData);
        // console.log(mappedData);
        // this.setState({
        //   source: res,
        //   chartData: mappedData
        // });
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
      return field.timestamp > new Date(this.state.startTimestamp).getTime();
    })
    
  }

  filterEndDate = (data) => {

    return data.filter(field => {
      return field.timestamp < new Date(this.state.endTimestamp).getTime();
    })

  }

  normalizeData=(data)=>{
    /*
      First, we need to set a baseline average, which everything will be mapped against. 
      Iterate thorugh ready data

    */
  //  console.log(data);
  //  let grouped = d3.groups(data,d=>d.date);
  //  grouped = grouped.map(field=>{
  //    return field.groups(field, )
  //  })
  //  console.log(grouped, this.state.trackers,grouped["2020-11-16"]);
    console.log(data);
    data = data.map(thought=>{
      thought[1] = thought[1].map(thoughtDate=>{

        let date = thoughtDate[0];
        let tracker = this.state.trackers[date];
        let normalizer = 600/tracker.totalDuration;
        if(thoughtDate[1]!==null){
          thoughtDate[1] = thoughtDate[1] / normalizer;
        }
        return thoughtDate;
      })
      return thought;
    })
   return data;
  }

  addEmptyDates=(data)=>{
    let dateRange = [];
    let startTimestamp = new Date(this.state.startTimestamp).getTime();
    let currentTimestamp = startTimestamp;
    let endTimestamp = new Date(this.state.endTimestamp).getTime();
    while(currentTimestamp<=endTimestamp){
      let date = new Date(currentTimestamp).toISOString().split("T")[0];
      dateRange.push(date);
      currentTimestamp += day;
    }
    data = data.map(field=>{
      dateRange.forEach(date=>{
        let missingDate = field[1].filter(thoughtDate=>{
          return thoughtDate[0] == date;
        }).length === 0;
        
        if(missingDate){
          let newDate = [date,null];
          field[1].push(newDate);
        }
      })
      field[1].sort((a,b)=>{return (a[0] < b[0]) ? -1 : (a[0]> b[0]) ? 1 : 0;})
      return field;
    })

    console.log(dateRange, data, this.state.startTimestamp, this.state.endTimestamp);
    return data;
  }

  getHedonicRatio = (data)=>{
    let hedonic = d3.rollups(data, v => v.length, d => d.hedonicAffect, d => d.date)
    return hedonic;
  }

  updateChart = () => {
    let data = this.state.source;
    console.log(data);
    data = this.filterStartDate(data);
    data = this.filterEndDate(data);
    let hedonic = this.getHedonicRatio(data);
    data = d3.rollups(data, v => v.length, d => d.perception, d => d.date)
    console.log(hedonic);
    data = this.filterByCountMin(data);
    data = this.filterByCountMax(data);
    data = this.normalizeData(data);
    if(this.state.showHedonic=="both"){
      data.push(...hedonic);

    }else if(this.state.showHedonic=="thought"){

    }else if(this.state.showHedonic=="hedonic"){
      data = hedonic;
    }
    data = this.addEmptyDates(data);
    console.log(data);
    let mappedData = data.map(value => {
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
      <div className={this.state.classList}>
        { this.state.chartData.length > 0 ?
          (<Chart options={this.state.options} series={this.state.chartData} type="line" height={"70%"} width={2000} />)
          : null}

        <div className="ThoughtTimeseries-filters">

          <ButtonGroup color="primary" variant="contained" aria-label="outlined primary button group">
            <Button>Day</Button>
            <Button>Week</Button>
            <Button>Month</Button>
          </ButtonGroup>
          <ButtonGroup color="primary" variant="contained" aria-label="outlined primary button group">
            <Button onClick={()=>{this.setState({showHedonic:"both"})}}>Hedonic and Thoughts</Button>
            <Button onClick={()=>{this.setState({showHedonic:"thoughts"})}}>Thoughts Only</Button>
            <Button onClick={()=>{this.setState({showHedonic:"hedonic"})}}>Hedonic Only</Button>
          </ButtonGroup>
          <div>

          <TextField id="outlined-basic"
            value={this.state.limitMin}
            
            onChange={(e) => {
              this.updateValue("limitMin",e.target.value)
              
            }} label="Min" variant="outlined" type="number" />
          <TextField id="outlined-basic"
            value={this.state.limitMax}
            
            onChange={(e) => {
              this.updateValue("limitMax",e.target.value)
              
            }} label="Max" variant="outlined" type="number" />
            </div>
          <div>

            <TextField
              id="datetime-local"
              label="Start Date"
              type="datetime-local"
              onChange={(e) => {
                let time = new Date(e.target.value).getTime();
                this.updateValue("startTimestamp",time)

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
                this.updateValue("endTimestamp",time)

              }}
              className="ThoughtTimeseries-field"
              defaultValue={today}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <Button onClick={this.updateChart}>Update</Button>
        </div>
      </div>
    );
  }
}

export default ThoughtTimeseries;
