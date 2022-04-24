// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X, ChevronDown } from 'react-feather'
import { formatMoney,alert } from '@utils'
import { ShipperServices } from '@services'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormGroup, Form, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, ModalFooter, Badge, Card, CardTitle } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddShipperModal = ({ open, handleModal }) => {
    // ** State
    const [outerShipper, setOuterShipper] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
    useEffect(() => {
        ShipperServices.findShipper({}).then(data => {
            let result = []
            if (data.data.data) {
                data.data.data.map(shipper => {
                    result.push({
                        _id: shipper._id,
                        fullname: shipper.fullname,
                        phone: shipper.phone,
                        ownerCount: shipper.jobs.length,
                        isActive: shipper.isActive
                    })
                })
            }
            setOuterShipper(result)
        })
    }, [])

    const addShipper = (id) => {
        console.log("ID: ", id)
        if (id != "") {
            ShipperServices.addShipper({ id }).then((data) => {
                alert.info(data.data.message)
            })
        }
    }

    const tableColumns = [{
        name: 'Họ Tên',
        sortable: true,
        minWidth: '100px',
        selector: row => row.fullname

    }, {
        name: 'SĐT',
        sortable: true,
        minWidth: '50px',
        selector: row => row.phone,
        // format: row => formatMoney(row.price)

    }, {
        name: 'Số Chủ',
        sortable: true,
        minWidth: '50px',
        selector: row => row.ownerCount,

    }, {
        name: 'Trạng thái',
        sortable: true,
        minWidth: '50px',
        selector: row => row.isActive,
        format: row => {
            if (row.isActive)
                return <Badge color="success">Sẵn Sàng</Badge>
            else
                return <Badge color="danger">Chưa Sẵn Sàng</Badge>

        }
    }, {
        name: 'Hành động',
        sortable: true,
        minWidth: '50px',
        selector: row => <Button color="success" size='sm' onClick={() => addShipper(row._id)}>Mời</Button>,


    }
    ]

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            // className='sidebar-sm'
            size='xl'
            modalClassName='modal-fade-in'
            contentClassName='pt-0'
        >
            <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
                <h5 className='modal-title'>Thêm Shipper</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>
                <Row>
                    <Col sm={12}>
                        <Input
                            className='mb-1'
                            type='text'
                            placeholder='ID của shipper'
                            onChange={(evt) => { setSelectedId(evt.target.value); }}
                        />
                    </Col>
                    <Col sm={12}>
                        <Label
                            className='text-warning'
                        >
                            Liên hệ shipper để lấy ID của họ!
                        </Label>
                    </Col>
                </Row>
                <Row>
                    <Col className='react-dataTable'>
                        <Card className="p-1">
                            <CardTitle style={{ display: "flex", justifyContent: 'space-between' }}>
                                Danh Sách Shipper Tìm Thấy
                            </CardTitle>
                            <DataTable
                                noHeader
                                pagination
                                columns={tableColumns}
                                // paginationPerPage={pageSize}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10} />}
                                // paginationDefaultPage={currentPage + 1 + 0}
                                // paginationComponent={CustomPagination}
                                data={outerShipper}
                                noDataComponent="Bạn không có shipper nào"
                            />
                        </Card>
                    </Col>
                </Row>
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
