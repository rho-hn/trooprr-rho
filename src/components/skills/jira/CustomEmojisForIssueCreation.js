import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Collapse,
  Typography,
  Switch,
  Select,
  Button,
  message,
  Alert,
  Card,
} from "antd";
import { setSkill, setCurrentSkill } from "../skills_action";
import { emojis } from "../../../utils/slackemojis";
import EmojiPicker from "./emojiPicker";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const { Panel } = Collapse;

const CustomEmojisForIssueCreation = (props) => {
  const currentSkill = useSelector((state) => state.skills.currentSkill);
  let isAdmin = useSelector((state) => state.common_reducer.isAdmin);

  const dispatch = useDispatch();
  const defaultValue =
    (currentSkill &&
      currentSkill.creationEmoji &&
      currentSkill.creationEmoji.name) ||
    ":ticket:";
  const [customEmoji, setCustomEmoji] = useState(defaultValue);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [initial, setInitial] = useState(true);
  const [customEmojisFromSlack, setCustomEmojisFromSlack] = useState([]);
  useEffect(() => {
    if (initial) {
      setInitial(false);
      return;
    } else {
      (async function () {
        let data = {
          creationEmoji: {
            name: customEmoji,
            emoji: emojis[customEmoji],
          },
        };
        let response = await axios.patch(
          `/bot/api/workspace/${props.match.params.wId}/skill/${
            props.match.params.sId || currentSkill._id
          }`,
          data
        );
        if (response) {
          if (response.data && response.data.success && response.data.skill) {
            let skill = response.data.skill;
            dispatch(setSkill(skill));
            dispatch(setCurrentSkill(skill));
          }
        }
      })();
    }
  }, [customEmoji]);

  useEffect(() => {
    (async function () {
      try {
        // if (isAdmin) {
        const response = await axios.get(
          `/bot/api/${props.match.params.wId}/getCustomEmojis`
        );

        if (response && response.data && response.data.success) {
          let emojis = response.data.emojis;

          setCustomEmojisFromSlack(emojis);
          // let slackEmojis=
        }
        // }
      } catch (e) {}
    })();
  }, []);
  return (
    // <Collapse style={{ borderTop: 'transparent',borderBottom:"transparent" }}>
    <Card title="Emoji Creation" key="7" id="emoji">
      {/* <div style={{ marginBottom: "1rem", textAlign: "center", fontSize: "1rem" }}>Selected Emoji :{emojis[customEmoji]}({customEmoji})</div>
                <div style={{textAlign:"center"}}>
                <Select style={{ width: "30%", textAlign: "center"}}  value={customEmoji} showSearch onChange={(value) => setCustomEmoji(value) }>
                    {options.map(el => {
                        return <Option style={{textAlign:"center"}} value={el.name}>{el.emoji}</Option>
                    })}
                </Select>
                </div> */}
      {!showEmojiPicker && (
        <>
          {" "}
          <div className="emojipickerText">
            <p>
              Create a Jira{" "}
              {props.match.params.sub_skill === "jira_service_desk"
                ? "ticket"
                : "issue"}{" "}
              when the emoji is added to slack message. <br />
              Invite Troopr to the channel before trying emoji creation.
            </p>
          </div>
          {/* {console.log(customEmoji, customEmojisFromSlack, customEmojisFromSlack[customEmoji])} */}
          <button
            className="emojiPickerTextButtonEmoji"
            onClick={() => {
              // setShowEmojiPicker(true)
              if (isAdmin) {
                setShowEmojiPicker(true);
              } else {
                message.error(
                  `Only workspace admin's can customize creation emoji.`
                );
              }
            }}
          >
            {emojis[customEmoji] ||
              (customEmojisFromSlack[customEmoji] ? (
                <img
                  style={{ width: "22px", height: "22px" }}
                  src={customEmojisFromSlack[customEmoji]}
                  alt=""
                />
              ) : (
                ""
              ))}{" "}
            &nbsp;Change Emoji
          </button>
        </>
      )}
      {showEmojiPicker && (
        <EmojiPicker
          customEmojisFromSlack={customEmojisFromSlack}
          closePicker={() => setShowEmojiPicker(false)}
          customEmoji={customEmoji}
          handleClick={(el) => {
            setCustomEmoji(el.name);
            setShowEmojiPicker(false);
          }}
        />
      )}
      <br />
      <br />
      <Alert
        message="This configuration will be used in Projects and Helpdesk"
        type="warning"
        style={{ textAlign: "center" }}
        // showIcon
      />
    </Card>
    // </Collapse>
  );
};

export default withRouter(CustomEmojisForIssueCreation);
