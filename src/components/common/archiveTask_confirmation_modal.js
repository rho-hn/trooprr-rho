import React from 'react';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Modal} from "antd"


class ArchiveTaskConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
            //     <ModalBody className="justify-content-center common-confirmation-modal-del">
            //     <div className="d-flex justify-content-center commmon-confirmation-modal-body-content">
            //         Are you sure want to archive 
            //         <div className="Confirm_margin">{' '}{["the",this.props.data ? this.props.data : 
            //         " "].join(" ")}{' '}</div>
            //     </div>
            //     <div className="d-flex justify-content-center commmon-confirmation-modal-body-content-name">'{this.props.name}' ?</div>
            //         <div className="d-flex justify-content-center align-items-center"  style={{marginTop:'24px'}} >
            //         <div className="common_pointer confirmation-button confirmation-cancle-button hover_archive " onClick={this.props.toggle}>Cancel</div>
            //         <div className="common_pointer confirmation-button confirmation-delete-remove-button hover-archive-okay-button "  onClick={this.props.test}>Okay</div>
            //         </div>
            //    </ModalBody>
            // </Modal>

            <Modal
            visible={this.props.modal}
            onCancel = {this.props.toggle}
            okText = 'Archive'
            onOk = {this.props.test}
            >
            Are you sure want to archive {' '} {["the",this.props.data ? this.props.data : " "].join(" ")}{' '} '{this.props.name}' ?
            </Modal>
        );
    }
}


export default ArchiveTaskConfirmModal; 