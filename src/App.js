import './App.css';
import Header from "./components/Header/Header";
import ListOrders from "./components/Admin/ListOrders/ListOrders";
import ListOrderClient from "./components/ListOrders/ListOrders"
import {Link, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import OrderDetails from "./components/ListOrders/OrderDetails/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile/Profile";
import Admin from "./components/Admin/Admin";
import React, {useEffect, useState} from "react";
import {Container, Nav, Navbar, NavLink, Offcanvas} from "react-bootstrap";
import ListUsers from "./components/Admin/ListUsers/ListUsers";
import User from "./components/Admin/ListUsers/User/User";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Order from "../src/components/Admin/ListOrders/Order/Order"

function App() {
    const {pathname} = useLocation();
    const [role,setUserRole] = useState('carrier')
    const [show, setShow] = useState(false);
    const router = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        localStorage.removeItem("user")
        router('/')
    }

    const renderHeader = () => {
        if (window.location.pathname.includes('admin')) {
            return <div>
                <div className="menu-items-large">
                    <Navbar bg="dark" data-bs-theme="dark" className="admin_nuvbar">
                        <Container>
                            <Link to="/" className="admin_link">WEB SITE</Link>
                            <Nav className="me-auto">
                                <Link to="/admin" className={`admin_link`}>Home</Link>
                                <Link to="/admin/list-users" className={`admin_link`}>Пользователи</Link>
                                <Link to="/admin/list-orders"  className={`admin_link`}>Заказы</Link>
                            </Nav>

                            <button className="btn btn-danger" onClick={handleLogout}>Выйти</button>
                        </Container>
                    </Navbar>
                </div>

                <div className="menu-items-small">

                    <Navbar  bg="dark" data-bs-theme="dark" className="admin_nuvbar">
                        <img src="/static/burger-menu-light.svg" alt="Бургер меню" width={40} height={40} onClick={handleShow}/>
                        <Offcanvas show={show} onHide={handleClose} placement="start" className="burger-menu">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title className="d-flex align-items-center">
                                    <img src="/static/Logo.svg" alt="Logo" width={100} height={75}/>
                                    <h3 style={{marginBottom:"0px"}}>Транс<br/>Плюс</h3>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <hr/>
                            <Offcanvas.Body>
                                <Nav className="me-auto">
                                    <Link to="/" className="admin_link">WEB SITE</Link>
                                    <Link to="/admin" className={`admin_link`}  onClick={handleClose}>Home</Link>
                                    <Link to="/admin/list-users" className={`admin_link`}  onClick={handleClose}>Пользователи</Link>
                                    <Link to="/admin/list-orders"  className={`admin_link`}  onClick={handleClose}>Заказы</Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Navbar>
                </div>

            </div>;
        }
        return <div className="bg-info-subtle">
            <div className="container">
               <Header/>
            </div>
        </div>;
    };

    const checkUser = async () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { id } = parsedUserData;

            const response = await fetch('http://transport-service.somee.com/checkUser',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId:id})
            })

            const data = await response.json();

            if(!data.success){
                localStorage.removeItem("user")
                router('/login')
            }
        }
    }

    useEffect(() => {
        checkUser()
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { role } = parsedUserData;
            setUserRole(role)
        }
    },[pathname])
    return (
        <>
            {renderHeader()}
            <Routes>
                <Route path="/" element={<ListOrderClient />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/profile/order/:orderId" element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                } />
                <Route path="/order/:orderId" element={<OrderDetails />} />

                <Route path="/admin" element={
                    <ProtectedAdminRoute>
                        <Admin />
                    </ProtectedAdminRoute>
                }/>
                <Route path="/admin/list-users" element={
                    <ProtectedAdminRoute>
                        <ListUsers/>
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/list-users/:id" element={
                    <ProtectedAdminRoute>
                        <User/>
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/list-orders/:orderId" element={
                    <ProtectedAdminRoute>
                        <Order/>
                    </ProtectedAdminRoute>
                } />
                <Route path="/admin/list-orders" element={
                    <ProtectedAdminRoute>
                        <ListOrders/>
                    </ProtectedAdminRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }/>
            </Routes>
        </>
    );
}

export default App;
