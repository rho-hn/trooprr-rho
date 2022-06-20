import React,{useState} from 'react'
import { SearchOutlined,CloseOutlined } from "@ant-design/icons"
import { emojis } from "../../../utils/slackemojis"
import "./emojipicker.css"
const EmojiPicker = (props) => {

    const slackEmojis = Object.keys(props.customEmojisFromSlack).map(el => {
        return {
            emoji: props.customEmojisFromSlack[el],
            name: el,
            isCustom: true
        }
    })
 
    const trooproptions = Object.keys(emojis).map(el => {
        return {
            emoji: emojis[el],
            name: el
        }
    })

    const options=[...slackEmojis,...trooproptions]


    const [emojiOptions, setEmojiOptions] = useState(options);
    const [searchTerm, setSearchTerm] = useState('')

    const inputChanged = (e) => {
        let search = e.target.value;
        setSearchTerm(search)
  
        if (!search) {
            setEmojiOptions(options)
            return;
        }
        let filterOptions = emojiOptions.filter(item => item.name.indexOf(search) != -1)
        setEmojiOptions(filterOptions)
    }
 
    return (
        <div className="emojipicker-container">
            <h3 className="emojipicker__title">
                Pick emoji
                <span onClick={props.closePicker}><CloseOutlined /></span>
            </h3>
          
            <div className="emojipicker-inputcontainer">
                <input onChange={inputChanged} placeholder="Search" className="emojipicker-inputcontainer-input" type="text" />
                <span className="emojipicker-inputcontainer-searchicon"><SearchOutlined /></span>
            </div>
            <h3 className="custom__emojipicker__header">Emojis</h3>
            <div className="list_emoji_container">
                {
                    emojiOptions.map(el => {
                        return <button key={el.name} onClick={(e) => {
                            e.stopPropagation();
                            props.handleClick(el)
                        }}>{el.isCustom?<img style={{width:"32px",height:"32px"}} src={el.emoji} />:el.emoji}</button>
                })
                }
            </div>
            
        </div>
    )
}

export default EmojiPicker
