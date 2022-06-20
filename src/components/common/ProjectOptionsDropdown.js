import React, { Component } from 'react';

import classnames from 'classnames';
import {
    DropdownMenu,
    DropdownItem
  } from "reactstrap";


export const ProjectOptionsDropdown = ({onClickSubmit, onChange, onSubmit, name, leaveProject, color, onColorChange }) => {
    return (
        <DropdownMenu
        className="project_setting_dropdown"
        onClick={(e) => e.stopPropagation}
      >
        <div className="custom_dropdown_item_input">
          <form onSubmit={onClickSubmit}>
            <input
              type="text"
              autoComplete="off"
              onBlur={onSubmit}
              onChange={onChange}
              value={name}
              id="project_name"
              name="name"
              className="form-control project_setting_name"
            />
          </form>
        </div>

         <div className="custom_dropdown_divider"></div>
        <div className="custom_dropdown_header  d-flex align-items-center" >
                    PROJECT OPTIONS
                       </div>

<DropdownItem
                  className="d-flex align-items-center custom_dropdown_item"
                  onClick={leaveProject}
                >
                 <i className="material-icons custom_dropdown_icon">
                 input
                              </i>
             
                  <span >Leave Project</span>
                </DropdownItem>
       
            <div className="custom_dropdown_divider"></div>
        <div className="custom_dropdown_header  d-flex align-items-center" >
                    PROJECT THEME
                       </div>
                       <div
                  className="d-flex justify-content-between custom_dropdown_item"
                 
                >
          <div
            className="colorBox bg_Color1 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange('#de350a')}
          >
            <div
              className={classnames({
                active_color_box: color === "#de350a"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color2 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#ff8b01")}
          >
            <div
              className={classnames({
                active_color_box: color === "#ff8b01"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color3 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#00875a")}
          >
            <div
              className={classnames({
                active_color_box: color === "#00875a"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color4 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#008da6")}
          >
            <div
              className={classnames({
                active_color_box: color === "#008da6"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color5 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#0052cc")}
          >
            <div
              className={classnames({
                active_color_box: color === "#0052cc"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color6 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#403294")}
          >
            <div
              className={classnames({
                active_color_box: color === "#403294"
              })}
            />
          </div>
          <div
            className="colorBox bg_Color7 d-flex align-items-center justify-content-center"
            onClick={() => onColorChange("#42526e")}
          >
            <div
              className={classnames({
                active_color_box: color === "#42526e"
              })}
            />
          </div>
        </div>
      </DropdownMenu>
    );
}