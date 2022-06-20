import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class UpdateConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
                <ModalHeader toggle={this.toggle}> {this.props.header}</ModalHeader>
                <ModalBody className="justify-content-center">
                    Are you sure you want to {this.props.actionType} 
                    <b>{' '}{this.props.name}{' '}</b>{this.props.info}{' '}?
               </ModalBody>
                <ModalFooter>
                    <Button className="common-pointer" color="danger" onClick={this.props.test}>Ok</Button>{' '}
                    <Button className="common-pointer" color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export default UpdateConfirmationModal 