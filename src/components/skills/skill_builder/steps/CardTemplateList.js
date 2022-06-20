import React, { useState,Fragment } from "react";
import { Card, Col, Row, Avatar } from "antd";
import SelectCard from "../steps/cardInvocationDetails/SelectCard";
const { Meta } = Card;
const goToCreation = () => {};
const CardTemplateList = props => {
  // console.log(props);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const clickHandler = () => {
    setSelectedTemplate(props.cards);
    setShowModal(true);
  };

  
     
  
  return (
    <Fragment>
      <Col span={8}>
    <div onClick={props.showModal}>
        <Card
          hoverable
          cover={
            <div
              style={{
                height: "150px",
                // 'url("https://app-stage.troopr.io/logo/test1.png")'
                backgroundImage:`url(${props.cards.logo})`,
                backgroundPosition: "center",
                backgroundSize: "220px",
                backgroundRepeat: "no-repeat",
                backgroundColor:"#333"
              }}
            />
          }
        
        >
          <Meta
            title={props.cards.name}
           
          />
        </Card>
      
    </div>
    </Col>
   </Fragment>
  );
};

export default CardTemplateList;
