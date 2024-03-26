import React, {useEffect, useState} from "react";
import "./ListOrders.css"
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, InputGroup, Modal, Table} from "react-bootstrap";
const ListOrders = () => {

    const [order,setOrders] = useState([])
    const [users,setUsers] = useState([])

    const [from,setFrom] = useState('')
    const [to,setTo] = useState('')
    const [price,setPrice] = useState('')
    const [comment,setComment] = useState('')
    const [date,setDate] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error,setError] = useState('')
    const [customerUser, setCustomerUser] = useState(null);
    const [carrierUser, setCarrierUser] = useState(null);

    const handleCustomerSelect = (event) => {
        const selectedUserId = parseInt(event.target.value);
        const user = users.find(user => user.id === selectedUserId);
        setCustomerUser(user);
    };

    const handleCarrierSelect = (event) => {
        const selectedUserId = parseInt(event.target.value);
        const user = users.find(user => user.id === selectedUserId);
        setCarrierUser(user);
    }
    const getAllOrders = async () => {
        const response = await fetch('http://transport-service.somee.com/getOrders',{
            method: "GET"
        })

        const data = await response.json()

        if(data.success){
            setOrders(data.orders)
            setUsers(data.users)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const createOrder = async (e) => {
        e.preventDefault();

        const requestBody = {
            pointOne:from,
            pointTwo:to,
            customerId: customerUser?.id,
            carrierId: carrierUser?.id ? carrierUser?.id : 0,
            price:price,
            date:date.toISOString(),
            comment: comment
        }

        await fetch('http://transport-service.somee.com/addNewOrderAdmin',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        setIsModalOpen(false)

        getAllOrders();

    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    useEffect(() => {
        getAllOrders()
    },[])

    return(
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center title-block">
                <h1>Список заказов</h1>
               <div>
                   <button className="btn btn-success" type="button" onClick={() => setIsModalOpen(true)}>Добавить заказ</button>
               </div>
            </div>

            {order.length > 0 ?<Table striped bordered hover responsive="sm">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Откуда</th>
                    <th>Куда</th>
                    <th>Выручка</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {order.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.from}</td>
                        <td>{order.to}</td>
                        <td>{order.price}</td>
                        <td>{formatDate(order.date)}</td>
                        <td className="d-flex justify-content-end">
                            <Link to={`${order.id}`}>
                                <img src="/static/view_user.svg" alt="Посмотреть данные пользователя" width={30} height={30} style={{marginRight:"10px"}}/>
                            </Link>
                            <img src="/static/delete_user.svg" alt="удалить данные пользователя" width={30} height={30}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>:
                <div className="d-flex flex-column justify-content-center align-items-center m-auto">
                    <h1>Заказов пока нет</h1>
                    <img src="/static/empty-orders.svg" alt="" width={200} height={200}/>
                </div>
            }


            <Modal
                show={isModalOpen}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={closeModal}
            >
                <form onSubmit={createOrder}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center">
                                        <h3>Новый заказ</h3>
                                        {error && <span style={{fontSize:"14px",color:"red",marginLeft:"10px"}}>{error}</span>}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between select-top-order">
                                        <Form.Select required className="select-carrier" aria-label="Default select example" placeholder="Выберите заказчика" onChange={handleCustomerSelect}>
                                            <option value="">Выберите заказчика</option>
                                            {users.filter(user => user.role === "logist").map(logist => (
                                                <option key={logist.id} value={logist.id}>
                                                    {logist.secondName} {logist.firstName.slice(0, 1)}.
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Select className="select-customer" aria-label="Default select example" placeholder="Выберите исполнителя" onChange={handleCarrierSelect}>
                                            <option value="">Выберите исполнителя</option>
                                            {users.filter(user => user.role === "carrier").map(carrier => (
                                                <option key={carrier.id} value={carrier.id}>
                                                    {carrier.secondName} {carrier.firstName.slice(0, 1)}.
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between mt-3 align-items-center modal-input-block">
                            <InputGroup className="mb-3 inputs-group">
                                <InputGroup.Text id="basic-addon1"><img src="/static/geo.svg" width={20} height={20} alt="Geo"/></InputGroup.Text>
                                <Form.Control
                                    required
                                    placeholder="Точка А"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </InputGroup>
                            <div className="flex-column move-truck-block">
                                <img src="/static/truck.svg" alt="Иконка" className="truck-icon" width={40} height={40} />
                                <hr style={{width:'350px',borderStyle:'dashed'}}/>
                            </div>
                            <div className="w-25 space-input"></div>
                            <InputGroup className="mb-3 inputs-group">
                                <InputGroup.Text id="basic-addon1"><img src="/static/geo.svg" width={20} height={20} alt="Geo"/></InputGroup.Text>
                                <Form.Control
                                    required
                                    placeholder="Точка Б"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        <div className="d-flex modal-input-block">
                            <InputGroup className="mb-3 inputs-group">
                                <InputGroup.Text id="basic-addon1"  required><img src="/static/rubel-icon.svg" alt="Валюта" width={20} height={20}/></InputGroup.Text>
                                <Form.Control
                                    required
                                    placeholder="Стоимость перевозки"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </InputGroup>
                            <div className="w-25"></div>
                            <Form.Group controlId="date" className="inputs-group mb-3">
                                <Form.Control
                                    required
                                    type="date"
                                    name="date"
                                    value={date.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        setDate(newDate);
                                    }}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Описание груза</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-success">Создать</button>
                        <Button className="btn" onClick={closeModal}>Закрыть</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default ListOrders;