import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class AddModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
                <ModalHeader toggle={this.toggle}>{this.props.Add}</ModalHeader>
                <ModalBody className="justify-content-center">
                    Are you sure you want to <b>{' '}{this.props.name}{' '}</b> as Admin ?
               </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.test}>Add</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}


export default AddModal; 