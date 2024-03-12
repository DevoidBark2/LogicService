import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, BarElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import "./Admin.css"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};
const labels = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const Admin = () => {
    const [usersData, setUsersData] = useState([]);
    const [orders, setOrders] = useState([])
    const getAllData = async () => {
        const response = await fetch('http://localhost:5177/getAllData', {
            method: "GET"
        });

        const data = await response.json();

        if (data.success) {
            setUsersData(data.users);
            setOrders(data.orders)
        }
    };

    useEffect(() => {
        getAllData();
    }, []);

    const countUserRoles = (role) => {
        return usersData.reduce((count, user) => user.role === role ? count + 1 : count, 0);
    };

    const countOrdersByMonth = () => {
        const ordersByMonth = Array(12).fill(0);

        orders.forEach(order => {
            const month = new Date(order.date).getMonth();
            ordersByMonth[month]++;
        });

        return ordersByMonth;
    };

    const dataPie = {
        labels: ['Перевозчик', 'Логист'],
        datasets: [
            {
                label: 'Количество',
                data: [countUserRoles("carrier"), countUserRoles("logist")],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels,
        datasets: [
            {
                label: 'Заказы',
                data: countOrdersByMonth(),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <div className="container mt-3">
            <h1>Статистика</h1>
            <div className="d-flex align-items-center justify-content-around diagrams-block">
                <Pie data={dataPie} style={{maxWidth:"300px",maxHeight:"300px"}}/>
                <Bar options={options} data={barData} style={{maxWidth:"350px",maxHeight:"300px"}} className="line-bar"/>
            </div>
        </div>
    );
};

export default Admin;