import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./report.css";



import { connect } from "react-redux";
import { getReports } from "./reportAction";

import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';


const getPointCategoryName=(point, dimension) =>{

let series = point.series,
      isY = dimension === 'y',
      axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
}

const getToolTipValue =(point,reports) =>{

// console.log("hello",point.x,point.y)
  let data=false
  let value=point.value +'%'
  try{
    // console.log("tesq",reports.infoArray[point.x][point.y])
    let info_item=reports.infoArray[point.x]
 data=info_item.find(item=>item.y==point.y)

  }catch(err){
    // console.log("tes")
    // console.log(err)
    data=false
  }
  if(data){
    // console.log(data,point.x,point.y)
    value= data.end +"("+ point.value+'%) out of '+data.start +' commited '
  }
  
  return value
    
  
}
class ProjectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
   
    };


  }



 
 

  componentDidMount() {
   
    this.props.getReports(this.props.match.params.wId, this.props.match.params.pId)
    this.hello()
      
  }


  componentWillUnmount() {
 
  }
  hello=()=>{
    // console.log("hello i am here")
  }


 

getOptions=()=>{
let data=this.props.reports
//  console.log("oiptions",data.y_axis)
let height=data.y_axis?(30*data.y_axis.length)+50:0
 height=height>400?height:400
let  options = {
  chart: {
    type: 'heatmap',
height:height,
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1,
        style:{"fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"}
  },
  credits: {
    enabled: false
},
  title: {
    text: 'User performance per sprint',
    style: {
     
      fontWeight: 'bold',
      fontSize:"18px"
  }

  },
 
  xAxis: {
    categories: data.x_axis,
    // opposite: true,
    title: null,
    labels:{style:{fontSize:"12px",  fontWeight: 'bold'}}
},

yAxis: {
    categories:data.y_axis,
    title: null,
    reversed: true,
    labels:{style:{fontSize:"12px",fontWeight: 'bold'}}
},
accessibility: {
  point: {
      descriptionFormatter: function (point) {
          var ix = point.index + 1,
              xName = getPointCategoryName(point, 'x'),
              yName = getPointCategoryName(point, 'y'),
              val = point.value;
          return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
      }
  }
},

colorAxis: {
  min: 0,
  minColor: '#FFFFFF',
  maxColor: Highcharts.getOptions().colors[0]
},   
 legend: {
  align: 'right',
  layout: 'vertical',
  margin: 0,
  verticalAlign: 'top',
  y: 25,
  symbolHeight: 280
},
tooltip: {
  formatter: function () {
      return '<b>' + getPointCategoryName(this.point, 'x') + '</b> completed  <br><b>' +
          getToolTipValue(this.point,data) + '</b> issues in  <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
  }
},
  series: [
    {
      borderWidth: 1,
        data:data.series_data
    
    ,  dataLabels: {
      enabled: true,
      color: '#000000'
  }}
  ]
};

return options
}


  render() {
 let options=this.props.reports?this.getOptions():{}

    return (
      <div style={{width:"100%"}}>
{this.props.reports?<HighchartsReact highcharts={Highcharts} options={options} />:null
}

      </div>
     
    );
  }
}


  const mapStateToProps=(state)=>{

    return{
    reports:state.projectReports.reports
    
};
  }
export default withRouter(
  connect(
    mapStateToProps,
    { getReports }
  )(ProjectReport)
);
