import "./ListOrders.css";
import Order from "../Order/Order";
import {useEffect, useState} from "react";
import {DropdownButton,Dropdown} from "react-bootstrap";
const ListOrders = () => {
    const [orders, setOrders] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const getOrderData = async () => {
        const response = await fetch("http://transport-service.somee.com/getAllOrders", {
            method: "GET"
        });

        const data = await response.json();

        if (data.success) {
            setOrders(data.orders);
        }
    }

    const handleClickSortBy = async (sortByValue) => {
        setSortBy(sortByValue);
        await sortOrders(sortByValue);
    }

    const sortOrders = async (sortByValue) => {
        const response = await fetch(`http://transport-service.somee.com/sortOrders?sortBy=${sortByValue}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            setOrders(data.orders);
        }
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        getOrderData();
    }, []);
    return(
        <div className="container">

            <div className="d-flex justify-content-between mt-3 align-items-center">
                <h1>Все заказы</h1>
                <DropdownButton
                    align="end"
                    title="Сортировка"
                    id="dropdown-menu-align-end"
                    show={showDropdown}
                    onClick={toggleDropdown}
                    className="dropdown-block"
                >
                    <Dropdown.Item eventKey="4" onClick={() => handleClickSortBy("price_high")}>Сортировка: По выручке (по возрастанию)</Dropdown.Item>
                    <Dropdown.Item eventKey="5" onClick={() => handleClickSortBy("price_low")}>Сортировка: По выручке (по убыванию)</Dropdown.Item>
                    <Dropdown.Item eventKey="6" onClick={() => handleClickSortBy("date_high")}>Сортировка: По дате (по возрастанию)</Dropdown.Item>
                    <Dropdown.Item eventKey="7" onClick={() => handleClickSortBy("date_low")}>Сортировка: По дате (по убыванию)</Dropdown.Item>
                </DropdownButton>
            </div>

            {
                orders.length > 0 ? orders.map(order => (
                    <Order key={order.id} order={order}/>
                )) : <div className="d-flex flex-column justify-content-center align-items-center m-auto">
                    <h1>Заказов пока нет</h1>
                    <img src="/static/empty-orders.svg" alt="" width={200} height={200}/>
                </div>
            }
        </div>
    )
}
export default ListOrders;