import React from "react";
import "./Order.css"
import {useParams} from "react-router-dom";

const Order = () => {
    const param = useParams();
    const orderId = param.orderId



    return(
        <div>{orderId}</div>
    )
}

export default Order