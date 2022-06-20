import React from 'react';

import { connect } from "react-redux";



class OptionItem extends React.Component {
    
    render() {
    
        return (
            <div className="d-flex justify-content-between custom_attrib_option_item align-items-center">

                      <div  className="custom_attrib_option_name"> {this.props.item.text}</div>
                       <i className="fa fa-times" aria-hidden="true" onClick={this.props.removeOption}></i>
                    </div>
            
        );
    }
}

export default (OptionItem); 