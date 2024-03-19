import "./Order.css"
import {Link} from "react-router-dom";
import React from "react";
const Order = ({order}) => {

    const formattedDate = new Date(order.date).toLocaleDateString('ru-RU'); // Преобразование даты в формат дд.мм.гггг

    return(
        <div key={order.id} className="order_item">
           <Link to={`order/${order.id}`} className="order_link">
               <div className="d-flex justify-content-between">
                   <span className="order_number">Заказ #{order.id} ({formattedDate})</span>
                   <div className="d-flex align-items-center order_price">
                       <span>{order.price}Р</span>
                       <img src="/static/rubel-icon.svg" alt="Валюта" width={20} height={20}/>
                   </div>
               </div>
               <div className="d-flex align-items-center">
                   <img src="/static/geo.svg" width={20} height={20} alt="Geo"/>
                   <h2 className="order_route">{order.from} - {order.to}</h2>
               </div>
           </Link>
        </div>
    )
}

export default Order;