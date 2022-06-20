import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const CustomModal = ({ ref,children, isOpen, toggle, keyboard, backdrop}) => {
    return(
        <Modal ref={ref} isOpen={isOpen} toggle={toggle} fade={false} className="proj_modal" keyboard={keyboard} backdrop={backdrop}>
          <ModalBody>
            {children}
          </ModalBody>
        </Modal>
    )
}

export default CustomModal;