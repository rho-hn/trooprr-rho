import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Card } from "antd";
import { XAxis, YAxis, Tooltip as ReTooltip, Legend, AreaChart, BarChart, Bar, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

class DashboardChart extends Component {
  constructor(props) {
    super(props);
  }

  getLegendText = (name, { payload }) => {
    return `${name} (${payload.value})`;
  };

  render() {
    const { day_by_day_activities, activity_categories } = this.props;
    const COLORS = [
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#97F19E",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#97F19E",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#97F19E",
      "#5AA08D",
      "#4C92B1",
      "#C8707E",
      "#EEE117",
      "#E48E58",
      "#E28FAD",
      "#97F19E",
    ];
    
    return (
      <Col className='gutter-row' span={24}>
        <Card
          size='small'
          title='User activities (60 days)'
          style={{ height: "100%" }}
          // extra={
          //   <Tooltip title={`Last updated at ${moment(grid_metrics && grid_metrics.lastUpdated).format("lll")}. Click to reload.`}>
          //     <Button
          //       size='small'
          //       type='link'
          //       shape='circle'
          //       onClick={() => this.updateGridMetrics()}
          //       icon={<ReloadOutlined spin={loading} />}
          //     />
          //   </Tooltip>
          // }
        >
          <Row gutter={[16, 16]}>
            <Col span={14}>
              <AreaChart data={day_by_day_activities} width={600} height={300}>
                <ReTooltip contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }} />
                <XAxis dataKey={"date"} />
                <Area
                  type='monotone'
                  dataKey='activities'
                  fill={localStorage.getItem("theme") === "default" ? "#402E96" : "#664af0"}
                  // strokeWidth={2}
                  // fillOpacity={1}
                />
              </AreaChart>
            </Col>
            <Col col={8}>
              <ResponsiveContainer width={400} height={300}>
                <PieChart>
                  <Pie dataKey='total' data={activity_categories} cx='50%' cy='50%' outerRadius={80} fill='#8884d8' label={false}>
                    {activity_categories.map((data, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend layout={"horizontal"} formatter={this.getLegendText} />
                  <ReTooltip
                  //   contentStyle={localStorage.getItem("theme") === "dark" && { backgroundColor: "#000" }}
                  //   labelStyle={localStorage.getItem("theme") === "dark" && { color: "white" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  }
}

export default withRouter(
  // connect({}, {})(Dashboard)
  DashboardChart
);
