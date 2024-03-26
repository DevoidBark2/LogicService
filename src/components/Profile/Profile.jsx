import React, {useEffect, useState} from "react";
import "./Profile.css"
import {formatPhone} from "../../utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import {Button, InputGroup, Modal, Form} from "react-bootstrap";
import Order from "../Order/Order";
import {Link, useNavigate} from "react-router-dom";

const Profile = () => {

    const [ordersList,setOrdersList] = useState([])
    const [firstName,setFirstName] = useState('')
    const [secondName,setSecondName] = useState('')
    const [email,setEmail] = useState('')
    const [phone,setPhone] = useState('')
    const [useRole,setUserRole] = useState('')
    const [resMessage,setResMessage] = useState({message: '',color: ''})
    const [loading,setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error,setError] = useState('')

    const [pointOne,setPointOne] = useState('')
    const [pointTwo,setPointTwo] = useState('')
    const [price,setPrice] = useState('')
    const [date,setDate] = useState('')
    const [comment,setComment] = useState('')

    const router = useNavigate();
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getUserData = async () => {
        setLoading(true)
        const userData = JSON.parse(localStorage.getItem("user"))
        const userId = userData.id;
        const role = userData.role

        const requestBody = {
            UserId: userId,
            roleUser: role
        }
        const response = await fetch('http://transport-service.somee.com/getUserData', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json()

        setFirstName(data.userData.firstName)
        setSecondName(data.userData.secondName)
        setEmail(data.userData.email)
        setPhone(data.userData.phone)
        setUserRole(data.userData.role)
        setOrdersList(data.ordersData)
        setLoading(false)
    }
    const saveUserData = async (e) => {
        e.preventDefault();

        const formattedPhone = formatPhone(phone);

        if (formattedPhone.length !== 18) {
            setResMessage({message: 'Некорректный формат телефона!', color: "alert-danger"});
            return;
        }

        const userData = localStorage.getItem("user");
        let userId = "";
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const {id} = parsedUserData;
            userId = id;
        }

        if(userId !== ""){
            const requestBody = {
                id: userId,
                firstName: firstName,
                secondName: secondName,
                phone: phone,
                email: email
            }

            const response = await fetch('http://transport-service.somee.com/saveUserData',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            const data = await response.json();

            setResMessage({message: "Данные успещно обновлены!", color: "alert-success"})
            localStorage.setItem("user",JSON.stringify(data.userData))

            setTimeout(() => {
                setResMessage({message:"",color: ""})
            },2000)
        }
    }

    const createOrder = async (e) => {
        e.preventDefault();

        let userId = '';
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { id } = parsedUserData;
            userId = id
        }
        if(pointOne === ""){
            setError('Укажите точку А')
            return;
        }else if(pointTwo === ""){
            setError('Укажите точку Б')
            return;
        } else if(price === ""){
            setError('Укажите цену перевозки')
            return;
        }else if(date === ""){
            setError('Укажите дату погрузки')
            return;
        }

        const requestBody = {
            pointOne: pointOne,
            pointTwo: pointTwo,
            price: price,
            date: date,
            comment: comment,
            userId: userId
        }

        const response = await fetch('http://transport-service.somee.com/createOrder',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(requestBody)
        });

        const data = await response.json();

        if(data.success){
            setResMessage(data.message)
        }

        setIsModalOpen(false)
        setResMessage({message: data.message, color: "alert-success"})

    }

    const checkUser = async () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { id } = parsedUserData;

            const response = await fetch('http://transport-service.somee.com/checkUser',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId:id})
            })

            const data = await response.json();

            if(!data.success){
                localStorage.removeItem("user")
                router('/login')
            }
        }
    }

    useEffect(() => {
        checkUser().then(
            getUserData()
        )
    },[])

    return(
        <div className="container">
            <h2 className="mt-3">Профиль</h2>
            {
                resMessage.message && <div className={`alert ${resMessage.color}`} role="alert">
                    {resMessage.message}
                </div>
            }

            <form onSubmit={saveUserData} className="d-flex align-items-end border p-3 justify-content-between profile-data-form">
                <div className="profile-block">
                    {
                        loading ? <div className="m-3 profile-item">
                            <label htmlFor="firstName" className="form-label">Имя</label>
                            <Skeleton width={207} height={38} style={{padding:"0.375px 0.75px"}}/>
                        </div> : <div className="m-3 profile-item">
                            <label htmlFor="firstName" className="form-label">Имя</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-control"
                                id="firstName"
                                required
                            />
                        </div>
                    }
                    {
                        loading ? <div className="m-3 profile-item">
                            <label htmlFor="secondName" className="form-label">Фамилия</label>
                            <Skeleton width={207} height={38}  style={{padding:"0.375px 0.75px"}}/>
                        </div> : <div className="m-3 profile-item">
                            <label htmlFor="secondName" className="form-label">Фамилия</label>
                            <input
                                type="text"
                                value={secondName}
                                onChange={(e) => setSecondName(e.target.value)}
                                className="form-control"
                                id="secondName"
                                required
                            />
                        </div>
                    }
                    {
                        loading ? <div className="m-3 profile-item">
                            <label htmlFor="email" className="form-label">Почта</label>
                            <Skeleton width={207} height={38}  style={{padding:"0.375px 0.75px"}}/>
                        </div> : <div className="m-3 profile-item">
                            <label htmlFor="email" className="form-label">Почта</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                id="email"
                                required
                            />
                        </div>
                    }
                    {
                        loading ? <div className="m-3 profile-item">
                            <label htmlFor="phone" className="form-label">Телефон</label>
                            <Skeleton width={207} height={38} style={{padding:"0.375px 0.75px"}}/>
                        </div> : <div className="m-3 profile-item">
                            <label htmlFor="phone" className="form-label">Телефон</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-control"
                                id="phone"
                                required
                            />
                        </div>
                    }

                </div>
                <div>
                    <button type="submit" className="btn btn-primary h-100">Сохранить</button>
                </div>
            </form>

            {
                useRole !== "admin" && <>
                    <div className="d-flex align-items-center justify-content-between mt-4 mb-2">
                        <div><h2>Заказы</h2></div>
                        <div>
                            {
                                useRole === "logist" && <button type="button" className="btn btn-success" onClick={() => setIsModalOpen(true)}>Добавить</button>
                            }
                        </div>
                    </div>
                    <div className="border orders-list">
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
                                                value={pointOne}
                                                onChange={(e) => setPointOne(e.target.value)}
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
                                                value={pointTwo}
                                                onChange={(e) => setPointTwo(e.target.value)}
                                            />
                                        </InputGroup>
                                    </div>
                                    <div className="d-flex modal-input-block">
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
                                        <Form.Group controlId="date" className="inputs-group mb-3" required>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                value={date}
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
                        {
                            ordersList.length > 0 ?
                                ordersList.map(order => (
                                    <Order key={order.id} order={order}/>
                                ))
                                : <div className="d-flex justify-content-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <img src="/static/empty-orders.svg" alt="Список пуст" className="mt-4" width={300} height={300}/>
                                        <h3>У вас еще нет заказов!</h3>
                                        {
                                            useRole === "logist" ? <button type="button" className="btn btn-success" onClick={openModal}>Добавить</button> :
                                                <Link to="/"><button type="button" className="btn btn-warning" onClick={openModal}>Взять заказ</button></Link>
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default Profile;