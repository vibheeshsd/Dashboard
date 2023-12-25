import { Component } from "react";
import React from "react";
import { Chart } from "react-google-charts";

class Customchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      line_data: [],
      bar_data: [],
      area_data: [],
      scatter_data: [],
      data_line: [],
      doughnut_data: [],
    };
  }

  componentDidMount() {
    console.log("chart compodidmount")
    this.generateChartData()
    
  }
  componentDidUpdate(prevProps,prevState){
    if( JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)){
      this.generateChartData()

    }
  }
  generateChartData(){
    var lineChart = this.createLineChart("end_year", "intensity");
    var barChart = this.createBarData("country", "likelihood");
    var areaChart = this.createAreaData("end_year");
    var scatterChart = this.createScatteredData("sector");
    var line2Chart = this.createLine2Chart("region");
    var doughnutChart = this.createDoughnutChart("pestle");
    this.setState({
      line_data: lineChart,
      bar_data: barChart,
      area_data: areaChart,
      scatter_data: scatterChart,
      data_line: line2Chart,
      doughnut_data: doughnutChart,
    });
  }
  createLineChart(param, param1) {
    var hashMap = {};
    var arr_data = [["name", "intensity"]];
    for (var i = 0; i < this.props.data.length; i++) {
      if (this.props.data[i][param] !== "") {
        var key = this.props.data[i][param];
        if (this.props.data[i][param] in hashMap) {
          if (this.props.data[i][param1] !== "") {
            hashMap[this.props.data[i][param]] = [
              hashMap[key][0] + parseInt(this.props.data[i][param1]),
              hashMap[key][1] + 1,
            ];
          }
        } else {
          hashMap[this.props.data[i][param]] = [
            parseInt(this.props.data[i][param1]),
            1,
          ];
        }
      }
    }
    var hash_data = Object.keys(hashMap);
    for (var skey of hash_data) {
      arr_data.push([skey, hashMap[skey][0] / hashMap[skey][1]]);
    }
    return arr_data;
  }

  createBarData(data1, data2) {
    var barMap = {};
    for (var i = 0; i < this.props.data.length; i++) {
      var key = this.props.data[i][data1];
      if (
        this.props.data[i][data1] !== "" &&
        this.props.data[i][data2] !== ""
      ) {
        if (this.props.data[i][data1] in barMap) {
          barMap[this.props.data[i][data1]] = [
            barMap[key][0] + this.props.data[i][data2],
            barMap[key][1] + 1,
          ];
        } else {
          barMap[this.props.data[i][data1]] = [this.props.data[i][data2], 1];
        }
      }
    }
    var barData = [["country", "likelihood"]];
    var hash_Data = Object.keys(barMap);
    for (var skey of hash_Data) {
      barData.push([skey, barMap[skey][0] / barMap[skey][1]]);
    }

    return barData;
  }
  createAreaData(data1) {
    var hashMap = {};
    for (var i = 0; i < this.props.data.length; i++) {
      if (
        this.props.data[i][data1] !== "" &&
        this.props.data[i].country !== ""
      ) {
        if (this.props.data[i][data1] in hashMap) {
          hashMap[this.props.data[i][data1]].add(this.props.data[i].country);
        } else {
          hashMap[this.props.data[i][data1]] = new Set([
            this.props.data[i].country,
          ]);
        }
      }
    }
    var areaData = [["end_year", "country"]];
    var hash_Data = Object.keys(hashMap);
    for (var akey of hash_Data) {
      areaData.push([akey, hashMap[akey].size]);
    }
    return areaData;
  }
  createScatteredData(param) {
    var hasMap = {};
    for (var i = 0; i < this.props.data.length; i++) {
      var key = this.props.data[i][param];
      if (
        key !== "" &&
        this.props.data[i].relevance !== "" &&
        this.props.data[i].likelihood !== ""
      ) {
        if (this.props.data[i][param] in hasMap) {
          hasMap[this.props.data[i][param]] = [
            [
              hasMap[key][0][0] + parseInt(this.props.data[i].relevance),
              hasMap[key][0][1] + 1,
            ],
            [
              hasMap[key][1][0] + parseInt(this.props.data[i].likelihood),
              hasMap[key][1][1] + 1,
            ],
          ];
        } else {
          hasMap[this.props.data[i][param]] = [
            [parseInt(this.props.data[i].relevance), 1],
            [parseInt(this.props.data[i].likelihood), 1],
          ];
        }
      }
    }
    var scatterdata = [["sector", "relevance", "likelihood"]];
    var hash_data = Object.keys(hasMap);
    for (var skey of hash_data) {
      if (hasMap[skey].length > 0) {
        var avg_rel = hasMap[skey][0][0] / hasMap[skey][0][1];
        var avg_like = hasMap[skey][1][0] / hasMap[skey][1][1];
        scatterdata.push([skey, avg_rel, avg_like]);
      }
    }
    return scatterdata;
  }
  createLine2Chart(param) {
    var lineMap = {};
    for (var i = 0; i < this.props.data.length; i++) {
      var key = this.props.data[i][param];
      if (key !== "" && this.props.data[i].source !== "") {
        if (key in lineMap) {
          lineMap[key].add(this.props.data[i].source);
        } else {
          lineMap[key] = new Set([this.props.data[i].source]);
        }
      }
    }
    var data_Line = [["region", "source"]];
    var lineData = Object.keys(lineMap);
    for (var lkey of lineData) {
      data_Line.push([lkey, lineMap[lkey].size]);
    }
    return data_Line;
  }

  createDoughnutChart(param) {
    var dMap = {};
    var total_occurence = 0;
    for (var i = 0; i < this.props.data.length; i++) {
      var key = this.props.data[i][param];
      if (key !== "") {
        if (key in dMap) {
          dMap[key] = dMap[key] + 1;
          total_occurence = total_occurence + 1;
        } else {
          total_occurence = total_occurence + 1;
          dMap[key] = 1;
        }
      }
    }
    var douData = [["pestle", "pestle in %"]];
    var data = Object.keys(dMap);
    for (var dkey of data) {
      var calc_data = (dMap[dkey] / total_occurence) * 100;
      douData.push([dkey, calc_data]);
    }
    return douData;
  }
  render() {
    
    console.log('rerender chart' , this.state)
    const areaOptions = {
      title: "No. of countries reported relevance and likelihood for each year",
      colors: ["#8a1a4c"],
      hAxis: { title: "Country", titleTextStyle: { color: "#333" } },
      legend: "none",
    };
    const barOptions = {
      legend: { position: "none" },
      colors: ["#228a48"],
      chart: {
        title: "Average likelihood of each countries",
      },
    };
    const lineOptions = {
      legend: { position: "none" },
      colors: ["#eb4934"],
      chart: {
        title: "Average intensity on each year",
      },
    };
    const scatterOptions = {
      title: "Relevance and likelihood scatter plots from each sector",
      legend: { position: "none" },
    };

    const line2Options = {
      chart: {
        title: "No. of source of sector from each region in the world",
      },
      legend: { position: "none" },
      colors: ["#FB7A21"],
    };
    const doughnutOptions = {
      title: "Percentage of various pestle",
      legend: "none",
      // pieSliceText: "label",
      slices: {
        4: { offset: 0.2 },
        12: { offset: 0.3 },
        14: { offset: 0.4 },
        15: { offset: 0.5 },
      },
    };
    
    return (
      <div className="main">
        <div>  
        </div>
        <div className="line-wrapper">
          { this.state.line_data.length > 2 ? 
          <Chart
            chartType="Line"
            width="100%"
            height="400px"
            data={this.state.line_data}
            options={lineOptions}
          /> : <></>
          }
        </div>
        <div className="bar-wrapper">
          { this.state.bar_data.length > 1 ?
          <Chart
            chartType="Bar"
            width="100%"
            height="400px"
            data={this.state.bar_data}
            options={barOptions}
          /> : <></>
          }
        </div>
        <div>
          <div className="area-wrapper">
          { this.state.area_data.length > 2 ?
            <Chart
              chartType="AreaChart"
              width="100%"
              height="400px"
              data={this.state.area_data}
              options={areaOptions}
            />:<></>
          }
          </div>
          <div className="wrapper">
            <div className="scatter-wrapper">
            { this.state.scatter_data.length > 1 ?
              <Chart
                chartType="ScatterChart"
                width="100%"
                height="400px"
                data={this.state.scatter_data}
                options={scatterOptions}
              /> : <></>
            }
              </div>
            <div className="pie-wrapper">
            { this.state.doughnut_data.length > 1 ?
              <Chart
                chartType="PieChart"
                data={this.state.doughnut_data}
                options={doughnutOptions}
                width={"100%"}
                height={"400px"}
              /> : <></>
              }  
            </div>
          </div>
          <div className="line2-wrapper">
          { this.state.data_line.length > 2 ?
            <Chart
              chartType="Line"
              width="100%"
              height="400px"
              data={this.state.data_line}
              options={line2Options}
            /> : <></>
            }  
          </div>
        </div>
      </div>
    );
  }
}

export default Customchart;
