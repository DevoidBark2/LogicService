import React, {useEffect, useRef, useState} from "react";
import "./OrderDetails.css"
import {Link, redirect, useParams} from "react-router-dom";
import {Button, Form, InputGroup, Modal, OverlayTrigger, Toast, ToastContainer, Tooltip} from "react-bootstrap";
import {useLocation,useNavigate} from "react-router-dom";

const OrderDetails = () => {
    const params = useParams();
    const orderId = params.orderId;
    const pathName = useLocation();

    const [userId,setUserId] = useState(null);
    const [userRole,setUserRole] = useState('')
    const [from,setFrom] = useState('')
    const [to,setTo] = useState('')
    const [price,setPrice] = useState('')
    const [comment,setComment] = useState('')
    const [date,setDate] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error,setError] = useState('')
    const [deleteModal,setDeleteModal] = useState(false)
    const router = useNavigate();
    const [resMessage,setResMessage] = useState({message: '',color: ''})
    const [userOrderId,setUserOrderId] = useState('')
    const [customerData,setCustomerData] = useState('')
    const [customerPhone,setCustomerPhone] = useState('')
    const [customerId,setCustomerId] = useState(0)
    const [carrierUser,setCarrierUser] = useState(null)
    const [carrierId,setCarrierId] = useState(null)
    const [loading,setLoading] = useState(false)

    const getOrderData = async () => {
        setLoading(true)
        const response = await fetch(`https://transport-service.somee.com/getOrderData?orderId=${orderId}`,{
            method: "GET",
            headers: {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        })

        const data = await response.json();

        if(data.success){
            setFrom(data.order.from);
            setTo(data.order.to);
            setPrice(data.order.price);
            setComment(data.order.comment);
            setUserOrderId(data.order.userId);
            const customerData = data.user;
            setCustomerData(`${customerData.firstName} ${customerData.secondName}`)
            setCustomerPhone(customerData.phone)
            if(data.carrierUser){
                setCarrierUser({firstName: data.carrierUser.firstName, secondName: data.carrierUser.secondName,phone:  data.carrierUser.phone})
                setCarrierId(data.carrierUser.id)
            }
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                const { id } = parsedUserData;
                if(data.order.customerId === id){
                    setCustomerId(data.order.customerId)
                }
            }

            const orderDate = new Date(data.order.date);
            setDate(orderDate);
            setLoading(false)
        }
        else{
            navigator.push("/profile")
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const closeDeleteModal = () => {
        setDeleteModal(false)
    }
    const changeOrder = async (e) => {
        e.preventDefault();

        let userId = '';
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { id } = parsedUserData;
            userId = id
        }
        if(from === ""){
            setError('Укажите точку А')
            return;
        }else if(to === ""){
            setError('Укажите точку Б')
            return;
        } else if(price === ""){
            setError('Укажите цену перевозки')
            return;
        }else if(date.toISOString().slice(0, 10) === ""){
            setError('Укажите дату погрузки')
            return;
        }

        const requestBody = {
            pointOne: from,
            pointTwo: to,
            price: price,
            date: date,
            comment: comment,
            userId: userId
        }

        const response = await fetch('https://transport-service.somee.com/changeOrderData',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json();

        if(data.success){
            setResMessage({message: data.message, color: "alert-success"})
        }
        setIsModalOpen(false)

        setTimeout(() => {
            setResMessage({message: "", color: ""})
        },2000)
    }

    const deleteOrder = async() => {

        const requestBody = {
            userId: userId,
            orderId: orderId
        }

        const response = await fetch(`https://transport-service.somee.com/deleteOrder`,{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json();
        if(data.success){
            router('/profile')
        }
    }

    const addNewOrder = async () => {

        const requestBody = {
            orderId: Number(orderId),
            customerId : userId
        }

        const response = await fetch("https://transport-service.somee.com/addNewOrder",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json();

        if(data.success){
            router('/profile')
        }

    }

    const deleteCarrierOrder = async () => {
        const requestBody = {
            orderId: Number(orderId),
            carrierId: userId
        }

        const response = await fetch("https://transport-service.somee.com/deleteCustomerOrder",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json();

        if(data.success){
            router('/')
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { id,role } = parsedUserData;
            setUserId(id);
            setUserRole(role)
        }

        getOrderData();
    },[orderId])

    const tooltip = (
        <Tooltip id="tooltip">
            <strong>Нажмите,</strong> чтобы посмотреть маршрут.
        </Tooltip>
    );

    return(
        <div className="container mt-3">
            {
                resMessage.message && <div className={`alert ${resMessage.color}`} role="alert">
                    {resMessage.message}
                </div>
            }

            {pathName.pathname.includes('/profile') && <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/profile" style={{textDecoration:"none",color:"black",fontWeight:"700"}}>Профиль</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Заказ #{orderId}</li>
                </ol>
            </nav>}

            <Modal
                show={isModalOpen}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={closeModal}
            >
                <form onSubmit={changeOrder}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="d-flex align-items-center">
                                <h3>Новый заказ</h3>
                                {error && <span style={{fontSize:"14px",color:"red",marginLeft:"10px"}}>{error}</span>}
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between mt-3 align-items-center modal-input-block">
                            <InputGroup className="mb-3 inputs-group">
                                <InputGroup.Text id="basic-addon1" required><img src="/static/geo.svg" width={20} height={20} alt="Geo"/></InputGroup.Text>
                                <Form.Control
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
                        <div className="d-flex justify-content-between  modal-input-block">
                            <InputGroup className="mb-3 inputs-group">
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
                            <Form.Group controlId="date" className="inputs-group" required>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={date.toISOString().slice(0, 10)}
                                    onChange={(e) => setDate(new Date(e.target.value))}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3 modal-input-block" controlId="exampleForm.ControlTextarea1">
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
                        <button type="submit" className="btn btn-success" onClick={changeOrder}>Изменить</button>
                        <Button className="btn" onClick={closeModal}>Закрыть</Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                show={deleteModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={closeDeleteModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className="d-flex align-items-center">
                            <h3>Удаление заказа #{orderId}</h3>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Вы уверены что хотите удалить заказ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-danger" onClick={deleteOrder}>Удалить</button>
                    <Button className="btn" onClick={closeDeleteModal}>Закрыть</Button>
                </Modal.Footer>
            </Modal>

            {!pathName.pathname.includes("/profile") && <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" style={{ textDecoration: "none", color: "black", fontWeight: "700" }}>
                            Все заказы
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Заказ #{orderId}
                    </li>
                </ol>
            </nav>}
            <div className="d-flex justify-content-between order-details-block">

               <div className="d-flex align-items-center header-block-customer">

                   <h2>Детали заказа #{orderId}</h2>
                   {
                       !pathName.pathname.includes("/profile") && <div className="d-flex" style={{marginLeft:"10px"}}>
                           <div className="customer-data">
                               <span>Заказчик: </span>
                               <img src="/static/user_icon.svg" alt="Иконка пользователя" width="20" height="20" style={{marginLeft:"10px"}}/>
                               <div>
                                   <span style={{fontWeight:"600",marginLeft:"5px"}}>{customerData}</span>
                                   <Link to={`tel:${customerPhone}`} className="customer_phone">{customerPhone}</Link>
                               </div>
                           </div>
                       </div>
                   }
               </div>
                {
                    !pathName.pathname.includes('/profile') && carrierUser?.firstName ? <div className="d-flex" style={{marginLeft:"10px"}}>
                        <div className="customer-data">
                            <span>Исполнитель: </span>
                            <img src="/static/user_icon.svg" alt="Иконка пользователя" width="20" height="20" style={{marginLeft:"10px"}}/>
                            <div>
                                <span style={{fontWeight:"600",marginLeft:"5px"}}>{carrierUser?.firstName} {carrierUser?.secondName}</span>
                            </div>
                        </div>
                    </div> : ''
                }
                {
                    (userRole === "carrier" && customerId !== 0 && pathName.pathname.includes("/profile")) && <button  type="button" className="btn btn-danger" onClick={deleteCarrierOrder}>Удалить заказ</button>
                }
                {
                    loading === false && (!carrierUser?.firstName && (userRole !== "admin" && (!pathName.pathname.includes('/profile') && userRole !== "logist"))) ?
                    <button type="button" className="btn btn-warning get-order-btn" onClick={addNewOrder}>Взять заказ</button> : ''
                }
                {pathName.pathname.includes('/profile') && userRole === "logist" && <div className="d-flex align-items-center justify-content-end">
                    <button type="button" className="btn btn-warning" onClick={() => setIsModalOpen(true)}>Изменить</button>
                    <button type="button" className="btn btn-danger m-lg-2 delete-order" onClick={() => setDeleteModal(true)}>Удалить</button>
                </div>
                }
            </div>
            <hr/>
            <div className="d-flex flex-column" style={{gap:"10px"}}>
                <div className="d-flex border p-4 align-items-center justify-content-between">
                    <h4>Маршрут: {from} - {to}</h4>
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <Link target="_blank" to={`https://www.google.com/maps/dir/${from}/${to}`}><img src="/static/route_icon.svg"  alt="Маршрут" width={50} height={50}/></Link>
                    </OverlayTrigger>
                </div>
                <div className="d-flex border p-4 align-items-center justify-content-between">
                    <h4>Выручка: {price}</h4>
                    <img src="/static/rubel-icon.svg" alt="Валюта" width={40} height={40}/>
                </div>
                <div className="d-flex border p-4 align-items-center justify-content-between">
                    <h4>Дата прибытия: {date.toLocaleDateString()}</h4>
                    <img src="/static/time.svg" alt="Время прибытия" width={40} height={40}/>
                </div>
                <div className="d-flex border p-4 flex-column">
                    <div className="d-flex justify-content-between">
                        <h4>Комментарий</h4>
                        <img src="/static/comment.svg" alt="Время прибытия" width={40} height={40}/>
                    </div>
                    <div>
                        <p>{comment}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;