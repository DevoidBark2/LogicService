import "./Order.css";
import {Link} from "react-router-dom";
const Order = ({order}) => {
    const { id, price, route } = order;
    const [city1, city2] = route.split('-');

    const googleMapsUrl = `https://www.google.com/maps/dir/${city1}/${city2}`;
    return(
        <>
            <Link to={googleMapsUrl} target="_blank">Посмотреть маршрут</Link>
            <Link to={`/order/${order.id}`}>

                <div className="order-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>Заказ №{id}</h3>
                        <p>Выручка: {price}</p>
                    </div>
                    <h4>Маршрут: {route}</h4>
                </div>
            </Link>
        </>

    )
}

export default Order;