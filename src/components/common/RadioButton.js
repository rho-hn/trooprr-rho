import React from "react";
import classnames from "classnames";

const RadioButton = ({
  handleRadioSelect,
  itemCheckedName,
  boxStyles,
  iconStyles,
  textStyles,
  selectedItem,
  itemName
}) => (
  <div
    onClick={() => handleRadioSelect(itemCheckedName)}
    className={classnames(
      "myspace_team_sync_filter_response_boxes d-flex justify-content-start align-items-center",
      {
        boxStyles
      }
    )}
    // className="myspace_team_sync_filter_response_boxes d-flex justify-content-start align-items-center"
  >
    {selectedItem === itemCheckedName ? (
      <i
        className={classnames(
          "material-icons myspace_team_sync_filter_response_icon_checked",
          {
            iconStyles
          }
        )}
        // className="material-icons myspace_team_sync_filter_response_icon_checked"
      >
        radio_button_checked
      </i>
    ) : (
      <i
        className={classnames(
          "material-icons myspace_team_sync_filter_response_icon_unchecked",
          {
            iconStyles
          }
        )}
        // className="material-icons myspace_team_sync_filter_response_icon_unchecked"
      >
        radio_button_unchecked
      </i>
    )}{" "}
    <div
      className={classnames(
        "myspace_team_sync_filter_response_text",
        textStyles
      )}
      // className="myspace_team_sync_filter_response_text"
    >
      {itemName}
    </div>
  </div>
);

export default RadioButton;
