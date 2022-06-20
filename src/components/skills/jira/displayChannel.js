import React,{ Component } from 'react';
import {Table, Row, Col, Card} from 'antd';


 class DisplayChannel extends Component {
constructor(props) {
  super(props)

  this.state = {
     
  }
}


    render() {
      
      let filteredData;
      filteredData=this.props.data.filter(a=>a.project_name[0]).slice(0).reverse()
      const columns = [
          {
            title: 'Channel Name',
            dataIndex: 'channelName',
            key: 'channelName',
            className:"table-column",
            align:'center',
            render: (text, record) =>{
              return <a className="table-link" onClick={()=>{this.props.showSettings(record.channelName,record.channel_id)}}>{record.channelName}</a>
              }
          }
        ];
      return (
            <Row >
              <Col span={12}>
              <Card title="Configured Channels">
              
            <Table columns={columns}  showHeader={false} dataSource={filteredData}  pagination={{ pageSize: 20 }} />
            
            </Card>
            </Col>
        </Row>
        )
    }
}


   
    

export default DisplayChannel
