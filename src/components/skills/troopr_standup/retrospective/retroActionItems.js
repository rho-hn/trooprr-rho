import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

import {
    PageHeader,
    Button,
    Table,
    Checkbox,
    Modal,
    Input,
    Typography,
    message,
    Menu,
    Dropdown,
    Popconfirm,
    Result
} from "antd";

import { DownOutlined } from "@ant-design/icons";

const { Text } = Typography;
// const Search = Input.Search;

class RetroActionItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            actionItemsData: [],
            showAllActionItems: true,
            showActionItemsForThisInstance: false,
            editModalVisible: false,
            currentTitle: "",
            currentTags: [],
            currentKey: 0,
            selectedRowKeys: [],
            searchText: "",
            isFilter: false,
            filteredActionItems: []
        }
    }

    componentDidMount() {

        axios.get(`/api/${this.props.match.params.tId}/getAllActionItems`).then(res => {
            if (res.data.success) {
                if (res.data.actionItems) {
                    if (res.data.actionItems.length > 0) {
                        this.setState({ actionItemsData: res.data.actionItems });
                    } else {
                        this.setState({ actionItemsData: [] });
                    }
                } else {
                    this.setState({ actionItemsData: [] });
                }
            } else {
                console.error("some error occurred while getting action items");
            }
        }).catch(err => {
            console.error("some error occurred while getting action items: ", err);
        })
    }

    //componentDidUpdate(){
    //   
    // }

    sortByProperty = (property) => {
        return function (a, b) {
            if (a[property] < b[property])
                return 1;
            else if (a[property] > b[property])
                return -1;

            return 0;
        }
    }

    showAllActionItems = () => {
        this.setState({
            showAllActionItems: true,
            showActionItemsForThisInstance: false
        });
        axios.get(`/api/${this.props.match.params.tId}/getAllActionItems`).then(res => {
            if (res.data.success) {
                if (res.data.actionItems && res.data.actionItems.length > 0) {
                    let items = res.data.actionItems;
                    items.sort(this.sortByProperty("status"));
                    this.setState({ actionItemsData: items });
                }
            } else {
                console.error("some error occurred while getting all action items for the team sync");
            }
        }).catch(err => {
            console.error("some error occurred while getting all action items for the team sync -> ", err);
        })
    }

    // ActionItemsForInstance = () => {
    //     this.setState({
    //         showActionItemsForThisInstance: true,
    //         showAllActionItems: false
    //     });
    //     axios.get(`/api/${this.props.match.params.tId}/${this.props.teamSyncInstance._id}/getActionItemsForInstance`).then(res => {
    //         // console.log("res.data -> ", res.data);
    //         if (res.data.success) {
    //             if (res.data.actionItems) {
    //                 if (res.data.actionItems.length > 0) {
    //                     let items = res.data.actionItems;
    //                     items.sort(this.sortByProperty("status"));
    //                     this.setState({ actionItemsData: items });
    //                 } else {
    //                     this.setState({ actionItemsData: [] });
    //                 }
    //             } else {
    //                 this.setState({ actionItemsData: [] });
    //             }
    //         } else {
    //             console.error("some error occurred while getting action items");
    //         }
    //     }).catch(err => {
    //         console.error("some error occurred while getting action items: ", err);
    //     })
    // }

    handleActionItemEdit = (text, record, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant) => {

        if (!(isTeamSyncAdmin)) {
            message.error("You don't have the permission to edit this action item");
            return;
        }

        this.setState({
            editModalVisible: true,
            currentTitle: record.title,
            currentTags: record.tags,
            currentKey: record.key
        });
    }

    handleTagsChange = (values) => {
        this.setState({ currentTags: values });
    }

    handleEditTitleChange = (title) => {
        this.setState({ currentTitle: title });
    }

    handleActionItemEditSubmit = () => {
        try {

            let newTitle = this.state.currentTitle;
            let newTags = this.state.currentTags;
            let currentSelectedKey = this.state.currentKey;

            let document = this.state.actionItemsData[currentSelectedKey - 1];
            document.title = newTitle;
            document.tags = newTags;
            document.returnAll = true;

            //revert the state to initial values
            this.setState({
                editModalVisible: false,
                currentKey: 0,
                currentTitle: "",
                currentTags: []
            });


            axios.post('/api/teamSync/editActionItem', document).then(res => {
                if (res.data.success) {
                    message.success("Action item edited successfully");

                    //making api call to update state:
                    if (this.state.showAllActionItems) {
                        this.setState({actionItemsData : res.data.allActionItems})
                    } else {
                        axios.get(`/api/${this.props.match.params.tId}/${this.props.teamSyncInstance._id}/getActionItemsForInstance`).then(res => {
                            if (res.data.success) {
                                if (res.data.actionItems) {
                                    if (res.data.actionItems.length > 0) {
                                        let items = res.data.actionItems;
                                        items.sort(this.sortByProperty("status"));
                                        this.setState({ actionItemsData: items });
                                    }
                                }
                            } else {
                                // console.log("some error occurred while getting action items");
                            }
                        }).catch(err => {
                            // console.log("some error occurred while getting action items: ", err);
                        })
                    }
                } else {
                    message.error("Some error occurred while editing action item");
                    console.error("some error occurred while editing action item");
                }
            }).catch(err => {
                // console.log("some error occurred while editing action item -> ", err);
            })




        } catch (err) {
            // console.log("failed to edit action items with error: ", err);
        }
    }

    handleEditModalCancel = () => {
        this.setState({
            editModalVisible: false,
            currentTitle: "",
            currentTags: [],
            currentKey: 0
        });
    }

    onSelectRowChange = (val) => {
        try {
            let key = val;

            let document = this.state.actionItemsData[key - 1];
            if (document.status === "todo") {
                document.status = "done"
            } else {
                document.status = "todo"
            }

            document.returnAll=true
            axios.post('/api/teamSync/editActionItem', document).then(res => {
                if (res.data.success) {

                    //making api call to update state:
                    if (this.state.showAllActionItems) {
                        this.setState({actionItemsData : res.data.allActionItems});
                    } else {
                        axios.get(`/api/${this.props.match.params.tId}/${this.props.teamSyncInstance._id}/getActionItemsForInstance`).then(res => {
                            if (res.data.success) {
                                if (res.data.actionItems) {
                                    if (res.data.actionItems.length > 0) {
                                        let items = res.data.actionItems;
                                        items.sort(this.sortByProperty("status"));
                                        this.setState({ actionItemsData: items });
                                    }
                                }
                            } else {
                                // console.log("some error occurred while getting action items");
                            }
                        }).catch(err => {
                            // console.log("some error occurred while getting action items: ", err);
                        })
                    }
                } else {
                    // console.log("some error occurred");
                }
            }).catch(err => {
                // console.log("some error occurred while editing action item -> ", err);
            })
        } catch (err) {
            // console.log("some error occurred while changing status: ", err);
        }
    }

    // onSearchTitle = (searchText) => {
    //   if(searchText === ""){
    //       axios.get(`/api/${this.props.match.params.tId}/${this.props.teamSyncInstance._id}/getActionItemsForInstance`).then(res => {
    //           // console.log("res.data -> ", res.data);
    //           if (res.data.success) {
    //               if (res.data.actionItems) {
    //                   if (res.data.actionItems.length > 0) {
    //                       let items = res.data.actionItems;
    //                       items.sort(this.sortByProperty("status"));
    //                       this.setState({ actionItemsData: items });
    //                   } else {
    //                       this.setState({ actionItemsData: [] });
    //                   }
    //               } else {
    //                   this.setState({ actionItemsData: [] });
    //               }
    //           } else {
    //               console.log("some error occurred while getting action items");
    //           }
    //       }).catch(err => {
    //           console.log("some error occurred while getting action items: ", err);
    //       })

    //       return;
    //   }

    //     let actionItems = this.state.actionItemsData
    //     let filteredItems = actionItems.filter((actionItem) => {
    //         let title = actionItem.title.toLowerCase();
    //         let tags = actionItem.tags;
    //         return (title.includes(searchText) || tags.includes(searchText));
    //     });

    //     this.setState({
    //         actionItemsData: filteredItems
    //     });
    // }

    handleUserLinkClicked = () => {
        this.props.switchViewFromRetroActionItems();
    }

    handleSearchInputChange = (text) => {
        if (text == "") {
            this.setState({
                isFilter: false,
                filteredActionItems: [],
                searchText: text
            });

        } else {
            let actionItems = this.state.actionItemsData;

            let filteredItems = actionItems.filter((actionItem) => {
                let title = actionItem.title.toLowerCase();
                let tags = actionItem.tags;
                return (title.includes(text) || tags.includes(text));
            });

            this.setState({
                isFilter: true,
                filteredActionItems: filteredItems,
                searchText: text
            });
        }
    }

    compareItem = (a, b) => {
        let statusA = a.status;
        let statusB = b.status; 

        if (statusA > statusB) {
            return -1;
        } else {
            return 1;
        }
    }

    deleteActionItem = (item, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant) => {
        if (!(isTeamSyncAdmin)) {
            message.error("You don't have the permission to delete this action item");
            return;
        }

        let actionItemId = item._id;
        

        axios.delete(`/api/${actionItemId}/deleteActionItem/returnAll`).then(res => {
            
            if (res.data.success) {
              this.setState({ actionItemsData: res.data.actionItems})
            } else {
                message.error("Could not delete action item");
                console.error("could not delete action item");
            }
        }).catch(err => {
            console.error("could not delete action item -> ", err);
            message.error("Could not delete action item");
        })
    }

    getActionItemMenu = (text, record, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant) => {
        return (
            <Menu>
                <Menu.Item style={{ padding: 0 }}><Button block style={{ textAlign: "left" }} type="text" onClick={() => this.handleActionItemEdit(text, record, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant)} disabled={(record.status === "done") || (!isTeamSyncAdmin)}>Edit</Button></Menu.Item>
                <Menu.Item style={{ padding: 0 }} >
                    <Popconfirm
                        title="Are you sure you want to delete this action item?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => this.deleteActionItem(record, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant)}
                        disabled={!isTeamSyncAdmin}
                    >
                        {/*isTeamSyncAdmin?
                        <Button danger type="text" style={{ textAlign: "left" }} block>Delete</Button>
                        :<Button danger type="text" style={{ textAlign: "left" }} disabled block>Delete</Button>*/}
                        <Button danger type="text" disabled={isTeamSyncAdmin?false:true} style={{ textAlign: "left" }} block>Delete</Button>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )
    }

    render() {
        
        let isTeamSyncAdmin = this.props.isTeamSyncAdmin;
        let isWorkspaceAdmin = this.props.isAdmin;
        let currentUserId = this.props.user_now && this.props.user_now._id;
        let { userTeamSync } = this.props;
        
        let isParticipant = false;

        // let selectedMembersIdArr = [];
        // if (userTeamSync.selectedMembers && userTeamSync.selectedMembers.length > 0) {
        //     userTeamSync.selectedMembers.forEach(member => {
        //         selectedMembersIdArr.push(member._id);
        //     })
        // }

        // if (selectedMembersIdArr.length > 0) {
        //     if (selectedMembersIdArr.includes(currentUserId)) {
        //         isParticipant = true;
        //     }
        // }

        const action_items_columns = [
            {
                title: "",
                dataIndex: "key",
                key: "key",
                render: (key, record) => isTeamSyncAdmin?<Checkbox onChange={() => this.onSelectRowChange(key)} defaultChecked={record.status == "todo" ? false : true} checked={record.status == "todo" ? false : true}></Checkbox>
                :<Checkbox disabled onChange={() => this.onSelectRowChange(key)} defaultChecked={record.status == "todo" ? false : true} checked={record.status == "todo" ? false : true}></Checkbox>
            },
            {
                title: "Title",
                dataIndex: "tags",
                key: "tags",
                render: (tags, record) => (
                    record.status === "todo" ? (
                        <Fragment>
                            <div>
                                <Text type="secondary" style={{ paddingRight: 4 }}>
                                    <a onClick={this.handleUserLinkClicked}><Text type="secondary">From {(this.props.userTeamSync&&this.props.userTeamSync.send_anonymous)?"team member":record.created_by && (record.created_by.displayName ||record.created_by.name)}'s feedback</Text></a>
                                </Text>
                                <br></br>
                                {/* {tags && tags.map((tag) => {
                                    let color = tag.length > 5 ? "geekblue" : "green";
                                    return (
                                        <Tag color={color} key={tag}>
                                            {tag.toUpperCase()}
                                        </Tag>
                                    );
                                })}
                                <br></br> */}
                                <Text>{record.title}</Text>
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div>
                                <Text delete type="secondary" style={{ paddingRight: 4 }}>
                            <a onClick={this.handleUserLinkClicked}><Text type="secondary">From {(this.props.userTeamSync&&this.props.userTeamSync.send_anonymous)?"team member":record.created_by && (record.created_by.displayName ||record.created_by.name)}'s feedback</Text></a>
                                </Text>
                                <br></br>
                                {/* {tags && tags.map((tag) => {
                                        let color = tag.length > 5 ? "geekblue" : "green";
                                        return (
                                            <Tag color={color} key={tag}>
                                                {tag.toUpperCase()}
                                            </Tag>
                                        );
                                    })}
                                    <br></br> */}
                                <Text delete>{record.title}</Text>
                            </div>
                        </Fragment>
                    )

                )
            },
            // {
            //     title: "Title",
            //     dataIndex: "title",
            //     key: "title"
            // },
            // {
            //     title: "Tags",
            //     key: "tags",
            //     dataIndex: "tags",
            //     onFilter: (value, record) => record.tags.includes(value),
            //     render: (tags) => (
            //         <Fragment>
            //             {tags && tags.map((tag) => {
            //                 let color = tag.length > 5 ? "geekblue" : "green";
            //                 return (
            //                     <Tag color={color} key={tag}>
            //                         {tag.toUpperCase()}
            //                     </Tag>
            //                 );
            //             })}
            //         </Fragment>
            //     )
            // },
            // {
            //     title: "Action",
            //     key: "action",
            //     render: (text, record) => (
            //         <div>
            //             <Button type="link" size="large" onClick={() => this.handleActionItemEdit(text,record)} disabled={record.status === "done" ? true : false}>
            //                 Edit
            //             </Button>
            //         </div>
            //     )
            // }
            {
                title: "Action",
                key: "action",
                align: "center",
                render: (text, record) => (
                    <Dropdown overlay={this.getActionItemMenu(text, record, isTeamSyncAdmin, isWorkspaceAdmin, isParticipant)}>
                        <Button size="small" type="link">
                            Take Action <DownOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        ];

        let actionItemsDataRender = [];

        // // console.log("this.state.actionItemsData -> ", this.state.actionItemsData);
        if (this.state.isFilter) {
            actionItemsDataRender = this.state.filteredActionItems;

        } else {
            actionItemsDataRender = this.state.actionItemsData;
        }

        actionItemsDataRender.sort(this.compareItem);

        if (actionItemsDataRender.length > 0) {
            actionItemsDataRender.forEach((item, index) => {
                item.key = index + 1;
            })
        }

        // let actionItemsDisplayTitle = `Action Items for ${this.props.userTeamSync.name}`
        // let { selectedRowKeys} = this.state;

        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectRowChange,
        // };
      return (userTeamSync && userTeamSync.standuptype === "team_mood_standup") ? (
        <Fragment>
          {/* <Empty style={{ margin: "auto" }}
            description={
              <span>
                Coming Soon
              </span>
            }
          /> */}
          <Result 
          title = "Coming Soon" />
        </Fragment>

      ) : (
            <Fragment>
                <PageHeader
                    // title={actionItemsDisplayTitle}
                    title={'Action Items'}
                    extra={[
                        <Input placeholder="Search by title"
                            onChange={e => this.handleSearchInputChange(e.target.value)}
                            value={this.state.searchText}
                        />

                        // <Search
                        //     placeholder="Search Title/Tags"
                        //     onSearch={this.onSearchTitle}
                        //     style={{ width: 200 }}
                        // />

                        // [(this.state.showAllActionItems ? 
                        //         <Tooltip title="Include action items only from this Check-In instance">
                        //             <Button onClick={this.ActionItemsForInstance}>Show Less</Button>
                        //         </Tooltip> :
                        //         <Tooltip title="Include action items from all previous Check-ins instances">
                        //             <Button onClick={this.showAllActionItems}>Show All</Button>
                        //         </Tooltip>
                        // )
                        //     ,
                        //     <Button.Group style={{ paddingLeft: 8 }}>
                        //         <Tooltip title="9 Feb">
                        //             <Button>
                        //                 <LeftOutlined />
                        //     Previous
                        //   </Button>
                        //         </Tooltip>
                        //         <Tooltip title="11 Feb">
                        //             <Button>
                        //                 Next
                        //     <RightOutlined />
                        //             </Button>
                        //         </Tooltip>
                        //     </Button.Group>
                    ]}
                />
                    <Table
                        // style={{ magin: 16, padding: 16 }}
                        style={{ padding: "16px 16px 32px 24px", height: '75vh', overflow: 'auto' }}
                        // rowSelection={rowSelection}
                        columns={action_items_columns}
                        dataSource={actionItemsDataRender}
                    />
                    <Modal
                        title="Edit Action Item"
                        centered
                        visible={this.state.editModalVisible}
                        onOk={() => this.handleActionItemEditSubmit()}
                        onCancel={this.handleEditModalCancel}
                    >
                        <p>Title</p>
                        <Input value={this.state.currentTitle} onChange={(e) => this.handleEditTitleChange(e.target.value)} />
                        <br></br>
                        <br></br>
                        {/* <p>Tags</p>
                                <Select value={this.state.currentTags} mode="tags" style={{ width: '100%' }} placeholder="Tags" onChange={this.handleTagsChange}>
                                </Select> */}
                    </Modal>
            </Fragment>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        user_now: store.common_reducer.user,
        teamSyncInstance: store.skills.projectTeamSyncInstance,
        userTeamSync: store.skills.userTeamSync,
    };
};

export default withRouter(
    connect(mapStateToProps, {
    })(RetroActionItems)
);
