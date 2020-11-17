
import React, { Component } from 'react';
import "./InsightsHome.css";
import api from "../../services/api";
import * as d3 from "d3";
import { ResponsiveLine } from '@nivo/line'
import Chart from 'react-apexcharts'
import ThoughtTimeseries from "../../components/ThoughtTimeseries/ThoughtTimeseries";
// Class Based React Component



const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: "time",
        format: "%Y-%m"
      }}
      xFormat="time:%Y-%m"
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: "%Y-%m",
        //tickValues: "every 2 days",
        // tickRotation: -90,
        legend: "time scale",
        legendOffset: -12
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'count',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
      pointSize={10}
      curve="cardinal"
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
  />
)
class InsightsHome extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    // Default CSS class to apply to the Component
    this.state = {
      classList: "InsightsHome",
      data:[],
      options: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
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
          size: 0,
        },
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0);
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0)
            }
          }
        }
      }
    };

  }


  // Runs after Component is loaded in the broswer
  componentDidMount() { }


  // Runs after a component has been updated
  componentDidUpdate() { }


  convertToDate=(value)=>{
    return new Date(value).toISOString().split('T')[0];
  }

  sanitizeData=(data)=>{
    data.forEach(value=>{
      value.data.forEach(record=>{
        if(typeof record.x!=="string"){
          console.log(record);
        }
      })
    })
  }

  // Runs right before a component is removed from the DOM
  componentDidMount() { 
    // api.getThoughtTimeSeries()
    //   .then(res=>{
    //     console.log(d3);
    //     console.log(res);
    //     let data = d3.rollups(res.records,v=>v.length, d=>d._fields[1], d=>d._fields[0])
    //     console.log(data);
    //     let finalData = data.filter(value=>{
    //       return value[1].length > 10;
    //     })
    //     console.log(finalData);
    //     let mappedData = finalData.map(value=>{
    //       let obj = {};
    //       obj.id = value[0];
    //       obj.data = value[1].map(field=>{
    //         let info = {};
    //         if(!isNaN(field[0])){
    //           field[0] = this.convertToDate(field[0])
    //         }
    //         info.x = field[0];
    //         info.y = field[1];
    //         return info;
    //       })
    //       return obj;
    //     })
    //     console.log(mappedData);
    //     //this.sanitizeData(mappedData);
    //     this.setState({
    //       data:mappedData
    //     })
    //   })
  }

  render() {
    return (
      <div className={this.state.classList}>
        <p>Insights</p>
       {/* { this.state.data.length > 0 ? <MyResponsiveLine data={this.state.data}/>: null}
       { this.state.data.length > 0 ? 
       (<Chart options={this.state.options} series={this.state.data} type="area" height={350} />)
       : null} */}
       <ThoughtTimeseries/>
      </div>
    );
  }
}

export default InsightsHome;
