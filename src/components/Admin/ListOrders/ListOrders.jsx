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
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserSelect = (event) => {
        const selectedUserId = parseInt(event.target.value);
        const user = users.find(user => user.id === selectedUserId);
        setSelectedUser(user);
    };
    const getAllOrders = async () => {
        const response = await fetch('http://localhost:5177/getOrders',{
            method: "GET"
        })

        debugger
        const data = await response.json()

        if(data.success){
            setOrders(data.orders)
            setUsers(data.users)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const createOrder = async () => {

    }

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
                                    <Form.Select aria-label="Default select example" placeholder="Выберите заказчика"  onChange={handleUserSelect}>
                                        <option value="">Выберите заказчика</option>
                                        {users.map(user => (
                                            <option value={user.id}>{user.secondName} {user.firstName.slice(0,1)}.  ({user.role === "logist" ? "Логист" : "Перевозчик"})</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                {selectedUser && (
                                   <Link to={`/admin/list-users/${selectedUser.id}`} style={{textDecoration:"none",color:"black"}} className="user-link">
                                        <span style={{fontSize:"16px",marginLeft:"10px",backgroundColor:"#c9c9c9",borderRadius:"20px",padding:"10px"}}>
                                        <img src="/static/user_icon.svg" alt="Иконка пользователя" width={20} height={20} style={{marginRight:"10px"}}/>
                                            {selectedUser.firstName} {selectedUser.secondName}
                                    </span>
                                   </Link>
                                )}
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between mt-3 align-items-center">
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text id="basic-addon1" required><img src="/static/geo.svg" width={20} height={20} alt="Geo"/></InputGroup.Text>
                                <Form.Control
                                    placeholder="Точка А"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </InputGroup>
                            <div className="d-flex flex-column move-truck-block">
                                <img src="/static/truck.svg" alt="Иконка" className="truck-icon" width={40} height={40} />
                                <hr style={{width:'350px',borderStyle:'dashed'}}/>
                            </div>
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text id="basic-addon1" required={true}><img src="/static/geo.svg" width={20} height={20} alt="Geo"/></InputGroup.Text>
                                <Form.Control
                                    placeholder="Точка Б"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        <div className="d-flex">
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text id="basic-addon1"  required><img src="/static/rubel-icon.svg" alt="Валюта" width={20} height={20}/></InputGroup.Text>
                                <Form.Control
                                    placeholder="Стоимость перевозки"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </InputGroup>
                            <div className="w-25"></div>
                            <Form.Group controlId="date" className="w-50" required>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={date.toISOString()}
                                    onChange={(e) => setDate(e.target.value)}
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