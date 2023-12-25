import React, { Component } from "react";
import axios from "axios";
import { Select, Button } from "antd";
import "./App.css";
import Customchart from "./chart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      end_year_options: [],
      topic_options: [],
      sector_options: [],
      region_options: [],
      pest_options: [],
      source_options: [],
      selected_end_year: [],
      selected_pestle: [],
      selected_topics: [],
      selected_source: [],
      selected_region: [],
      selected_sector: [],
      totalData : 0 ,
      filteredTotal : 0
    };
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(prec) {
    if (this.state.data.length === 0) {
      this.fetchAllData()
    }
  }

  fetchAllData(){
    axios.get("http://localhost:5000/fetch").then((res) => {
      //console.log("Api is working", res.data);
      var pestle_option = this.createData("pestle");
      var source_option = this.createData("source");
      var sector_option = this.createData("sector");
      var region_option = this.createData("region");
      var end_year_option = this.createData("end_year");
      var topic_option = this.createData("topic");
      this.setState({
        data: res.data,
        filteredTotal : res.data.length,
        totalData : res.data.length,
        pest_options: pestle_option,
        source_options: source_option,
        sector_options: sector_option,
        region_options: region_option,
        end_year_options: end_year_option,
        topic_options: topic_option,
      });
    });
  }
  createData = (param) => {
    var hashMap = {};
    var select_options = [];
    for (var i = 0; i < this.state.data.length; i++) {
      if (i.toString() in hashMap) {
        continue;
      } else {
        hashMap[this.state.data[i][param]] = 1;
      }
    }
    var hash_data = Object.keys(hashMap);
    for (var key of hash_data) {
      var obj1 = {
        value: key,
        label: key,
      };
      if (key === "") {
        continue;
      } else {
        select_options.push(obj1);
      }
    }
    return select_options;
  };
  handleChange(values, param) {

    if (param === "end_year") {
      this.setState({ selected_end_year: values });
    } else if (param === "sector") {
      this.setState({ selected_sector: values });
    } else if (param === "topics") {
      this.setState({ selected_topics: values });
    } else if (param === "region") {
      this.setState({ selected_region: values });
    } else if (param === "pestle") {
      this.setState({ selected_pestle: values });
    } else if (param === "source") {
      this.setState({ selected_source: values });
    }
  }

  handleClick(){
    console.log("dad",this.state)
    if(this.state.selected_end_year.length > 0 || this.state.selected_pestle.length > 0 || this.state.selected_region.length > 0 || this.state.selected_sector.length > 0 || this.state.selected_topics.length > 0 || this.state.selected_source.length > 0){
      axios.post("http://localhost:5000/filterdata", {
        "end_year" : this.state.selected_end_year,
        "sector" : this.state.selected_sector,
        "pestle" : this.state.selected_pestle,
        "source" : this.state.selected_source,
        "region" : this.state.selected_region,
        "topics" : this.state.selected_topics
      }).then((res) => {
        console.log('datares ')
        console.log(res.data)
        
        this.setState({data:res.data,filteredTotal:res.data.length})
      })
    }
    else{
      window.location.reload()
    }

  }

  render() {
    console.log('rerender ', this.state)
    return (
      <div className="main">
        <h1 className="db-header">DASHBOARD</h1>
        <div className="dashboard">
          <Select
            mode="multiple"
            className="ant-select2"
            style={{
              minWidth: 150,
              maxWidth: 400,
            }}
            onChange={(values) => {
              this.handleChange(values, "end_year");
            }}
            placeholder="End_Year"
            allowClear
            options={this.state.end_year_options}
          />
          <Select
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: 400,
              marginTop: "12px",
            }}
            onChange={(values) => {
              this.handleChange(values, "topics");
            }}
            placeholder="Topics"
            allowClear
            options={this.state.topic_options}
          />
          <Select
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: 400,
              marginTop: "12px",
            }}
            onChange={(values) => {
              this.handleChange(values, "sector");
            }}
            placeholder="Sector"
            allowClear
            options={this.state.sector_options}
          />
          <Select
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: 400,
              marginTop: "12px",
            }}
            placeholder="Region"
            allowClear
            onChange={(values) => {
              this.handleChange(values, "region");
            }}
            options={this.state.region_options}
          />
          <Select
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: 400,
              marginTop: "12px",
            }}
            placeholder="Pestle"
            allowClear
            onChange={(values) => {
              this.handleChange(values, "pestle");
            }}
            options={this.state.pest_options}
          />
          <Select
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: 400,
              marginTop: "12px",
            }}
            onChange={(values) => {
              this.handleChange(values, "source");
            }}
            placeholder="Source"
            allowClear
            options={this.state.source_options}
          />
          <Button type="primary" style={{ marginLeft: 10 }} 
          onClick={
            this.handleClick
          
          }>
            Filter
          </Button>
        </div>
        <div className="filter">Filtered {this.state.filteredTotal} out of {this.state.totalData} </div>
        <div className="main-container">
          {this.state.data.length > 0 ? (

            <Customchart data={this.state.data} />
          ) : (
            <div className="error-wrapper"><h2>No data found try changing your filter or reload the page</h2></div>
          )}
        </div>
      </div>
    );
  }
}
export default App;
