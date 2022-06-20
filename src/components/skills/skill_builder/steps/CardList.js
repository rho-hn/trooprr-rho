import React,{ Component } from 'react';
import { Button,  Table, Divider, Tag,Popconfirm ,Card} from 'antd';
import {updateCard,saveCard} from "./CardActions"
import { connect } from "react-redux";

 class CardList extends Component {
constructor(props) {
  super(props)

  this.state = {
     
  }
}
handleCheckBox=(e,card)=>{
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
let data={
  "pinToDashboard":value
}
this.props.updateCard(card._id,data).then(res=>{

})
}

    render() {
     const columns = [
            {
              title: 'Card Name',
              dataIndex: 'cardInformation.Card_name',
              key: 1,
           
              align:'center'
          
            },
              {
              title: 'Action',
              key: 4,
              align:'center',
        
              
              render: (text, record) =>{ 
  
               return <a className="table-link" onClick={()=>{this.props.showmodal(record,"edit")}}>
              Edit
                </a>
              }
            },
            {
              title: 'Pin to Dashboard',
              key: 2,
              align:'center',
          
              
              render: (text, record) =>{ 
  
               return   <input  defaultChecked={record.pinToDashboard} type="checkbox" onClick={(e)=>{this.handleCheckBox(e,record)}}/>
   
                
              }
            },
              {
                title: 'Delete',
                key:3 ,
                align:'center',
                className:"table-column",
                
                render: (text, record) =>{ 
    
    return <Popconfirm title="Sure to delete?" onConfirm={() => this.props.deleteList(record)}>
    <a style={{ color: "#fa541c"}}>Delete</a>
  </Popconfirm>
                }
              }
           
          ];
        return (
          <div style={{padding: "20px" ,background: "#ffffff"}}>
            <div style={{"fontSize": "20px", marginBottom: "20px"}}> List of Cards</div>
            <Table  rowKey="_id" columns={columns}  dataSource={this.props.data}  pagination={{ pageSize: 6 }}  />
       </div>
        )
    }
}


   
export default 
  connect(null, { updateCard,saveCard })(CardList);


