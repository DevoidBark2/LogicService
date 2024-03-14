import React, {useEffect, useState} from "react";
import "./Order.css"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Table} from "react-bootstrap";

const Order = () => {
    const param = useParams();
    const orderId = param.orderId
    const [customerOrder,setCustomerOrder] = useState(null)
    const [carrierOrders,setCarrierOrder] = useState([])
    const router = useNavigate()


    const getOrderDetails = async () => {
        const response  = await fetch(`http://localhost:5177/getOrderDetails?orderId=${Number(orderId)}`,{
            method:"GET",
        })

        const data = await response.json();

        debugger
        if(data.success){
            setCarrierOrder(data.carrierOrderDetails)
            setCustomerOrder(data.customerOrderDetails)
        }
        else{
            router('/admin/list-orders')
        }
    }

    useEffect(() => {
        getOrderDetails()
    },[orderId])

    return(
        <div className="container mt-3">
            <h1>Подробная информация заказа #{orderId}</h1>

            <div className="d-flex" style={{marginLeft:"10px"}}>
                <Link to={`/admin/list-users/${customerOrder?.customerId}`}>
                    <div className="customer-data">
                        <span>Заказчик: </span>
                        <img src="/static/user_icon.svg" alt="Иконка пользователя" width="20" height="20" style={{marginLeft:"10px"}}/>
                        <div>
                            <span style={{fontWeight:"600",marginLeft:"5px"}}>{customerOrder?.firstName}</span>
                            <Link to={`tel:${customerOrder?.phone}`} className="customer_phone">{customerOrder?.phone}</Link>
                        </div>
                    </div>
                </Link>
            </div>


            <h3>Исполнитель</h3>

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
                {carrierOrders.length > 0 ? carrierOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.firstName}</td>
                        <td>{order.secondName}</td>
                        <td>
                            {order.role === "logist" ? "Логист" : order.role === "admin" ? "ADMIN" : "Перевозчик"}
                        </td>
                        <td className="d-flex justify-content-end">
                            <Link to={`/admin/list-users/${order?.customerId}`}>
                                <img src="/static/view_user.svg" alt="Посмотреть данные пользователя" width={30} height={30} style={{marginRight:"10px"}}/>
                            </Link>
                        </td>
                    </tr>
                )) : <div>Исполнителя еще нет</div>}
                </tbody>
            </Table>

        </div>
    )
}

export default Order