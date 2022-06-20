import React,{ Component } from 'react';
import {Table} from 'antd';


 class GithubdisplayChannel extends Component {
constructor(props) {
  super(props)

  this.state = {
     
  }
}


    render() { 
   let filteredData1
       filteredData1 = Array.from(new Set(this.props.data.map(data=>data.channel_id)))
                      .map(channelData=>{return this.props.data.find(id=>id.channel_id === channelData)});
    // console.log("=====>",filteredData1)                             
    // const filteredArr = arr.reduce((acc, current) => {
    //   const x = acc.find(item => item.id === current.id);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);

        const columns = [
            {
              title: 'Channel Name',
              dataIndex: 'channelName',
              key: 'channelName',
              className:"table-column",
              align:'center',
        
              
              
            
            },
            
            
        //     {
        //         title: 'Action',
        //         key: 'action',
        //         align:'center',
        //         className:"table-column",
                
        //         render: (text, record) =>{ 
    
        //          return <a className="table-link" onClick={()=>{this.props.showSettings(record.channelName,record.channel_id)}}>
        // Edit
                   
        //           </a>
        //         }
        //       },
           
          ];
         
        return (
         
            <div className="displayPreferences">
            <Table  className="ant-table-content card" bordered columns={columns}  dataSource={filteredData1}  pagination={{ pageSize: 5 }} />
        </div>
        )
    }
}


   
    

export default GithubdisplayChannel
