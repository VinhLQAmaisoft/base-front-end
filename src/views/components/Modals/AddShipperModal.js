// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'
import { formatMoney } from '@utils'
import { ShipperServices } from '@services'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormGroup, Form, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, ModalFooter } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddShipperModal = ({ open, handleModal }) => {
    // ** State

    const [selectedId, setSelectedId] = useState("");
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

    const addShipper = () => {
        if (selectedId != "") {
            ShipperServices.addShipper({ id: selectedId }).then((data) => {
                alert(data.data.message)
            })
        }
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            // className='sidebar-sm'
            modalClassName='modal-fade-in'
            contentClassName='pt-0'
        >
            <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>Thêm Shipper</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <Input
                    className='mb-1'
                    type='text'
                    placeholder='ID của shipper'
                    onChange={(evt) => { setSelectedId(evt.target.value); }}
                />
                <Label
                    className='text-warning'
                >
                    Liên hệ shipper để lấy ID của họ!
                </Label>
            </ModalBody>
            <ModalFooter>
                <Button
                    className='me-1'
                    color='primary'
                    onClick={addShipper}
                    disabled={selectedId == ""}
                >
                    Thêm Shipper
                </Button>
                <Button color='secondary' onClick={handleModal} outline>
                    Hủy
                </Button>
            </ModalFooter>
        </Modal >
    )
}

export default AddShipperModal
