import "./ListOrders.css";
import Order from "./Order/Order";
const ListOrders = () => {

    const orders = [
        {id: 1,route: 'Москва-Ярославль', price: 2000},
        {id: 2,route: 'Москва-Ярославль', price: 100},
        {id: 3,route: 'Москва-Ярославль', price: 20000},
        {id: 4,route: 'Москва-Ярославль', price: 200000},
        {id: 5,route: 'Москва-Владивосток', price: 19000}

    ];
    return(
        <div className="container">
            {
                orders.length > 0 ? orders.map(order => (
                    <Order order={order}/>
                )) : <div className="d-flex flex-column justify-content-center align-items-center m-auto">
                    <h1>Заказов пока нет</h1>
                    <img src="/static/empty-orders.svg" alt="" />
                </div>
            }
        </div>
    )
}
export default ListOrders;