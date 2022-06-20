import React from 'react';
import { Modal } from 'antd';


class DeleteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false }
    }

    componentDidUpdate(props) {
        // console.log("this is update",props)
        if (this.props.modal != props.modal && this.props.modal == true) {
            this.setState({ modal: true })
        }

        // console.log("hello this is props",props)
    }
    toggle = () => {
        // console.log("hello this is propstoogle")
        this.props.toggle()
        this.setState({ modal: !this.state.modal })

    }
    render() {
        // console.log("hello",this.state)
        return (
            // <Modal visible={this.state.modal}  className={this.props.class?this.props.class:""} toggle={this.toggle} footer={null} onCancel={this.toggle}>

            //     <div className="d-flex justify-content-center commmon-confirmation-modal-body-content align-items-center">
            //         <div>
            //             Are you sure you want to
            //         </div>
            //         <div
            //             className="Confirm_margin">
            //             {this.props.Task ? this.props.Task : " "}
            //         </div>
            //         <div 
            //             className="Confirm_margin">
            //             {["the",this.props.data ? this.props.data : " "].join(" ")}
            //         </div>
            //         <div className="Confirm_margin" >{this.props.member?this.props.member :  null}</div>
            //             {this.props.Delete === "Admin" && <span>as admin</span>}{' '}
            //             {!this.props.name && "?"}
            //         </div>
            //         {this.props.name && <div 
            //             className="commmon-confirmation-modal-body-content-name">
            //                  '{this.props.name}' ?
            //         </div>}
            //         <div style={{marginTop:'24px'}}
            //         className="d-flex justify-content-center align-items-center">
            //             <div className="confirmation-button secondary_btn justify-content-center btn_114"   
            //             onClick={this.toggle}>
            //                Cancel
            //         </div>

            //          <div 
            //          className="confirmation-button primary_btn btn_114"
            //          style={{marginLeft:'24px'}}   
            //          onClick={this.props.test}>
            //                  {this.props.Button ? this.props.Button : "Delete"}     
            //          </div>
            //         </div>


            // </Modal>

            <Modal
                visible={this.state.modal}
                onCancel={this.toggle}
                okText='Delete'
                onOk={this.props.test}
            >
                <span>
                    Are you sure you want to {' '}
                    {this.props.Task ? this.props.Task : " "} {' '}

                    {["the", this.props.data ? this.props.data : " "].join(" ")}
                    {this.props.member ? this.props.member : null}
                    {this.props.Delete === "Admin" && <span>as admin</span>}{' '}
                    {!this.props.name && "?"}
                    {this.props.name && <> '{this.props.name}' ? </>}
                </span>
            </Modal>
        );
    }
}


export default DeleteModal; 