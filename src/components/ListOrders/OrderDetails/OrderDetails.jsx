import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
const OrderDetails = () => {
    const params = useParams();
    const prodId = params.orderId;

    useEffect(() => {
        //будем делать запрос на получение всей  инфы заказа
    },[prodId])
    return(
        <div className="container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Главная</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Заказ #{prodId}</li>
                </ol>
            </nav>

            <h2>Детали заказа #{prodId}</h2>
            <hr/>
            <h3>Заказчик: Петров Петр Петрович(<a href="tel:+79619728782">+79619728782</a>)</h3>
        </div>
    );
}

export default OrderDetails;