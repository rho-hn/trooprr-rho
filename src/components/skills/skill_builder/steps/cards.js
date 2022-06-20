import React, { Component, useEffect, useState, Fragment } from "react";

import { getCardTemplates, getCards, deleteCard } from "./CardActions";
import CardTemplateList from "./CardTemplateList";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Tag, Row } from "antd";
const { CheckableTag } = Tag;
const tagsFromServer = ["Jira", "Github"];
const Cards = props => {
 
  const [selectedTags, setSelectedTags] = useState(["Jira", "Github"]);

  useEffect(() => {
  props.getCardTemplates()
  }, []);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const filteredSkills =
    selectedTags.length > 0
      ? props.cardTemplates.filter(card => {
        if(!card.isHidden){
          let skillType = card.app === "Jira" ? "Jira" : "Github";
          return selectedTags.includes(skillType);
        }
         
        })
      : props.cardTemplates.filter(card=>!card.isHidden);
  return (
 
    <div
      style={{
        background: "#f5f5f5",
        padding: "40px",
        height: "calc(100vh - 80px)",
        overflow: "auto"
      }}
    >
        <h6 style={{ marginRight: 8, display: "inline" }}>Categories:</h6>
      {tagsFromServer.map(tag => (
        <CheckableTag
     
          key={tag.name}
          checked={selectedTags.indexOf(tag) > -1}
          onChange={checked => handleChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
      <br/>
      <br/>
      <Row gutter={[25, 25]} align="middle">
        {filteredSkills.map(card => (
          <CardTemplateList cards={card} />
        ))}
      </Row>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    cardTemplates: state.cards.templateCards,
    // currentSkill:state.skills.currentSkill

  };
};
export default withRouter(
  connect(mapStateToProps, { getCardTemplates, getCards, deleteCard })(Cards)
);
