import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import "./User.css"

const User = () => {
    const params = useParams();
    const userId = params.id;

    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [ordersUser, setOrdersUser] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserDetails = async () => {
        const response = await fetch(`http://localhost:5177/getUserDetails?userId=${Number(userId)}`, {
            method: "GET"
        });

        const data = await response.json();
        if (data.success) {
            const userData = data.user;
            setFirstName(userData.firstName);
            setSecondName(userData.secondName);
            setPhone(userData.phone);
            setRole(userData.role);
            setOrdersUser(Array.isArray(data.orders) ? data.orders : data.orders === null ? [] : [data.orders]);
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    useEffect(() => {
        getUserDetails();
    }, [userId]);

    return (
        <div className="container mt-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/admin/list-users" style={{ textDecoration: "none", color: "black", fontWeight: "700" }}>
                            Пользователи
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Пользователь #{userId}
                    </li>
                </ol>
            </nav>
            <hr />
            <div className="d-flex align-items-center justify-content-between customer-block">
                <h3 className="customer-info">
                    {firstName} {secondName} (<Link to={`tel:${phone}`} className="tel_phone">{phone}</Link>)
                </h3>
                {role === "logist" ?
                    <div className="d-flex align-items-end">
                        <img src="/static/user_icon.svg" alt="Перевозчик" width={50} height={50} className="role-img" />
                        <h4 className="role">Логист</h4>
                    </div> :
                    <div className="d-flex align-items-end">
                        <img src="/static/truck.svg" alt="Перевозчик" width={50} height={50} className="role-img"/>
                        <h4 className="role">Перевозчик</h4>
                    </div>
                }
            </div>

            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    {ordersUser.length > 0 ? (
                        <div>
                            <h3>Заказы</h3>
                            <Table striped bordered hover className="mt-3"  responsive="sm">
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
                                {ordersUser.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.from}</td>
                                        <td>{order.to}</td>
                                        <td>{order.price}</td>
                                        <td>{formatDate(order.date)}</td>
                                        <td className="d-flex justify-content-end">
                                            <Link to={`/admin/list-orders/${order.id}`}>
                                                <img src="/static/view_user.svg" alt="Посмотреть данные заказа" width={30} height={30} style={{ marginRight: "10px" }} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center m-auto">
                            <h1>Заказов пока нет</h1>
                            <img src="/static/empty-orders.svg" alt="" width={200} height={200} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default User;