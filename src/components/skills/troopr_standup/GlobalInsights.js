import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {Layout, Result,PageHeader } from "antd";
class GlobalInsights extends Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    render(){
        return(
            <Layout style={{//marginLeft: 250,
             height: "100vh" }}>
                <PageHeader
                title="Cross Check-in Insights"
                subTitle={
                  <span>
                    See insights across Check-ins in your workspace
                  </span>
                }
              />
                <Result style={{ width: "100%", marginTop: "10%" }} title='Coming Soon' />
            </Layout>
        )
    }
}
const mapStateToProps = (state) => ({
})
export default withRouter(
    connect(mapStateToProps, {
      })(GlobalInsights)
)