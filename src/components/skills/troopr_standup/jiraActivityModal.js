import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Typography } from "antd";
const { Text, Title, Link } = Typography;

class jiraActivityModal extends Component {
  render() {
    const { selectedActivityData, visible } = this.props;
    let activity,
      domain_url,
      comments,
      history,
      actions = [];
    if (selectedActivityData) {
      activity = selectedActivityData.selectedActivity;
      domain_url = selectedActivityData.domain_url;
    }
    if (activity) {
      comments = activity.filteredComments.slice(0, 3);
      history = activity.changelog.histories.slice(0, 5);
    }
    if (history) {
      history.forEach((eachHis) => {
        eachHis.items.forEach((action) => {
          if (action.toString) actions.push(action);
          else if (action.field == "assignee") {
            action.toString = "Unassigned";
            actions.push(action);
          }
        });
      });
    }
    // {
    //   console.log("selected activity", selectedActivityData, history, actions);
    // }
    return (
      <Fragment>
        <Modal
          visible={visible}
          title={
            visible && (
              <Text ellipsis style={{ width: "95%" }}>
                Updates in{" "}
                <Link
                  href={domain_url + "/browse/" + activity.key}
                  target='_blank'
                >
                  {activity.key}:{activity.fields.summary}
                </Link>
              </Text>
            )
          }
          footer={false}
          onCancel={this.props.onCancel}
          centered
        >
          {visible && selectedActivityData && (
            <div style={{ marginTop: "-16px" }}>
              {/* history */}
              {history.length > 0
                ? actions.map((action) => {
                    return (
                      <Text ellipsis style={{ width: "95%" }}>
                        <Text strong>{action.field}</Text> {"=>"}
                        {action.toString
                          ? action.toString
                          : action.field == "assignee"
                          ? "Unassigned"
                          : ""}
                        <br />
                      </Text>
                    );
                  })
                : ""}
              <br />
              {/* comments */}
              {comments.length > 0
                ? comments.map((comment) => {
                    return (
                      <span>
                        <Text strong>comment</Text> {" =>"}{" "}
                        <Text ellipsis style={{ width: "80%" }}>
                          {comment.body}
                        </Text>{" "}
                        <br />
                      </span>
                    );
                  })
                : ""}

                {history.length === 0 && comments.length === 0 ? "No recent activity" : ''}
            </div>
          )}
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({});
export default withRouter(connect(mapStateToProps, {})(jiraActivityModal));