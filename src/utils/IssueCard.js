import React from "react";
import {Input, Select} from 'antd'
import "./IssueCard.css";

function IssueCard(props) {
    const {Option} = Select

    const all_issuetype_fields = props.all_issuetype_fields
    const buttonActions = props.buttonActions
    const disable = props.disable

    // let attributes = [
    //     {
    //         name: "Project",
    //         id: "10001"
    //     },
    //     {
    //         name: "Type",
    //         id: "10002"
    //     },
    //     {
    //         name: "Priority",
    //         id: "10003"
    //     },
    //     {
    //         name: "Assignee",
    //         id: "10004"
    //     }
    // ];

    let headerAttribute = {
        name: "Status",
        id: "10007"
    };

    // let isCompact = true;
    const action_select_style = {margin : '8px 5px 0 0', width:'100px'}
    const action_input_style = {margin : '8px 5px 0 0', width:'125px'}
    const select_dropdown_style = {minWidth:'300px'}

    return (
        <div className="issue-card">
            <div className="issue-card-left app-avatar">
                <span>
                    <img
                        src="https://app.troopr.io/logo/square.png"
                        alt="logo"
                        id="app-logo-card"
                    />
                </span>
            </div>
            <div className="issue-card-right card-containts">
                <div className="message-header">
                    <div className="message-author">Troopr Assistant</div>
                    <div className="time-stamp">11:30 AM</div>
                </div>
  
                <div className="message-blocks">
                    <div className="issue-key-header">
                        <b className="issue-key">{props.projectKey||"ST" }-1</b>
                        <code className="attr-1 status">{props.selectedField ? props.selectedField.name : headerAttribute.name} value</code>
                        <b className="summary">Summary Text Goes Here</b>
                    </div>
                    {props.showDescription && <div className="message-description">
                        <div className="description-text">The description text will be shown here below the issue summary. This text can be at most 300 characters after which it will be truncated. The description text will be shown here below the issue...</div>
                    </div>}
                    {props.isCompact && (
                        <div className="issue-key-header" style={{ marginTop: "10px" }}>
                            <b className="issue-key">{props.projectKey || "ST"}-2</b>
                            <code className="attr-1 status">{props.selectedField ? props.selectedField.name : headerAttribute.name} value</code>
                            <b className="summary">Summary Text Goes Here</b>
                        </div>
                    )}

                    {!props.isCompact && (
                        <>
                            <div className="attribute-list">
                                {props.selectedAttributesDetailed.map((attribute,index) => {
                                    if (!(attribute && attribute.name)) {
                                       return <></>
                                  }
                                  return  (

                                    <div key={attribute.name} className="attribute">
                                        <div className="attribute-name">{attribute.name}</div>
                                        <div className="attribute-name">:&nbsp;</div>
                                        <div className="attribute-value">
                                            {attribute.name + " value"}
                                        </div>
                                    </div>
                                )
                                } )}
                            </div>

                            <div className="actions">
                                <Select disabled={disable} value={buttonActions && buttonActions.button_1 ? buttonActions.button_1.fieldId : 'change_status'} style={action_select_style} dropdownStyle={select_dropdown_style} onChange={value => props.handle_select_change({selectKey:'button_1',option:value})}>
                                    <Option key='change_status' value='change_status'>Change Status</Option>
                                    {all_issuetype_fields.map(field => {
                                        return <Option key={field.fieldId} value={field.fieldId} disabled={buttonActions && buttonActions.button_2 && buttonActions.button_2.fieldId === field.fieldId}>{field.name}</Option>
                                    })}
                                </Select>
                                <Select disabled={disable} value={buttonActions && buttonActions.button_2 ? buttonActions.button_2.fieldId : 'comment'} style={action_select_style} dropdownStyle={select_dropdown_style} onChange={value => props.handle_select_change({selectKey:'button_2',option:value})}>
                                <Option key='comment' value='comment' >Comment</Option>
                                    {all_issuetype_fields.map(field => {
                                        return <Option key={field.fieldId} value={field.fieldId} disabled={buttonActions && buttonActions.button_1 && buttonActions.button_1.fieldId === field.fieldId}>{field.name}</Option>
                                    })}
                                </Select>

                                {/* <div className="actions-dropdown"> */}
                                    <Input
                                    disabled
                                    style={action_input_style}
                                        placeholder="Select an action"
                                        // className="actions-dropdown-placeholder"
                                        // aria-autocomplete="list"
                                    />
                                    {/* <div className="actions-dropdown-arrow">&#9660;</div> */}
                                {/* </div> */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IssueCard;
