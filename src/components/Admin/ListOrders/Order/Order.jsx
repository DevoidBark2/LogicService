import React, {useEffect, useState} from "react";
import "./Order.css"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Form, Table} from "react-bootstrap";

const Order = () => {
    const param = useParams();
    const orderId = param.orderId
    const [customerOrder,setCustomerOrder] = useState(null)
    const [carrierOrders,setCarrierOrder] = useState([])
    const [carriesUsers,setCarrierUsers] = useState([])
    const [carrierUser, setCarrierUser] = useState(null);
    const router = useNavigate()


    const getOrderDetails = async () => {
        const response  = await fetch(`http://localhost:5177/getOrderDetails?orderId=${Number(orderId)}`,{
            method:"GET",
        })

        const data = await response.json();

        if(data.success){
            if(data.carrierOrderDetails){
                setCarrierOrder(data.carrierOrderDetails)
            }
            if(data.carrierUsers){
                setCarrierUsers(data.carrierUsers)
            }
            setCustomerOrder(data.customerOrderDetails)
        }
        else{
            router('/admin/list-orders')
        }
    }

    const deleteCarrierUser = async () => {
        const response = await fetch(`http://localhost:5177/changeOrderAdmin`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({carrierId: 0,orderId:Number(orderId)})
        })

        const data = await response.json();

        if(data.success){
           setCarrierOrder([])
            getOrderDetails()
        }
    }
    const changeOrder = async (e) => {
        e.preventDefault()

        const response = await fetch(`http://localhost:5177/changeOrderAdmin`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({carrierId: carrierUser?.id,orderId:Number(orderId)})
        })

        const data = await response.json();

        if(data.success){
            getOrderDetails();
        }
    }

    const handleCarrierSelect = (event) => {
        const selectedUserId = parseInt(event.target.value);
        const user = carriesUsers.find(user => user.id === selectedUserId);
        setCarrierUser(user);
    }

    useEffect(() => {
        getOrderDetails()
    },[orderId])

    return(
        <div className="container mt-3">


            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/admin/list-orders" style={{ textDecoration: "none", color: "black", fontWeight: "700" }}>
                            Заказы
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Заказ #{orderId}
                    </li>
                </ol>
            </nav>
            <h1 className="order-title">Подробная информация заказа #{orderId}</h1>

            <div className="d-flex" style={{marginLeft:"10px"}}>
                <Link to={`/admin/list-users/${customerOrder?.customerId}`} style={{textDecoration:"none",color:"black"}} className="customer-data-block">
                    <div className="customer-data">
                        <span>Заказчик: </span>
                        <img src="/static/user_icon.svg" alt="Иконка пользователя" width="20" height="20" style={{marginLeft:"10px"}}/>
                        <div>
                            <span className="customer-name" style={{fontWeight:"600",marginLeft:"5px"}}>{customerOrder?.firstName}</span>
                            <span className="customer_phone">{customerOrder?.phone}</span>
                        </div>
                    </div>
                </Link>
            </div>


            <h3>Исполнитель</h3>

            {
                carrierOrders.length > 0 ? <>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-danger mb-3" onClick={deleteCarrierUser}>Снять исполнителя</button>
                    </div>
                        <Table striped bordered hover responsive="sm">
                            <thead>
                            <tr>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Роль</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {carrierOrders.map((order) => (
                                <tr key={order.id + order.firstName}>
                                    <td>{order.firstName}</td>
                                    <td>{order.secondName}</td>
                                    <td>
                                        {order.role === "logist" ? "Логист" : order.role === "admin" ? "ADMIN" : "Перевозчик"}
                                    </td>
                                    <td className="d-flex justify-content-end">
                                        <Link to={`/admin/list-users/${order?.customerId}`} key={order.id}>
                                            <img src="/static/view_user.svg" alt="Посмотреть данные пользователя" width={30} height={30} style={{marginRight:"10px"}}/>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </> :
                    <div className="d-flex flex-column">
                        <h3 className="text-center">Исполнителя еще нет</h3>
                        <form onSubmit={changeOrder}>
                            <Form.Select required className="select-carrier" aria-label="Default select example" placeholder="Выберите исполнителя"onChange={handleCarrierSelect} >
                                <option value="">Выберите исполнителя</option>
                                {carriesUsers.map(logist => (
                                    <option key={logist.id} value={logist.id}>
                                        {logist.secondName} {logist.firstName.slice(0, 1)}.
                                    </option>
                                ))}
                            </Form.Select>
                            <div className="btn-add-carrier">
                                <button type="submit" className="btn btn-success mt-3">Назначить</button>
                            </div>
                        </form>
                    </div>

            }

        </div>
    )
}

export default Order