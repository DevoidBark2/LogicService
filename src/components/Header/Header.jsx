import {Link, useNavigate} from "react-router-dom";
import "./Header.css";
import React, {useEffect, useState} from "react";
import {Button, Offcanvas, OverlayTrigger, Tooltip} from "react-bootstrap";

const Header = () => {

    const [userName, setUserName] = useState('');
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const router = useNavigate();

    const handleLogout = () => {
        handleClose()
        localStorage.removeItem("user");
        setUserName('');
        router('/');
    };

    const toggleBurgerMenu = () => {
        setIsBurgerMenuOpen(!isBurgerMenuOpen);
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const { firstName, secondName,role } = parsedUserData;
            const userRole = role === "carrier" ? "Перевозчик" : role === "logist" ? "Логист" : "Админ"
            setUserName(`${firstName} ${secondName} (${userRole})`)
        } else {
            setUserName('')
        }
    },[userName])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const tooltip = (
        <Tooltip id="tooltip">
            <strong>Нажмите,</strong> чтобы выйти из профиля.
        </Tooltip>
    );

    return (
        <div className="d-flex align-items-center justify-content-between header-content">
            <div>
                <Link to="/" className="text-decoration-none header-logo d-flex align-items-center">
                    <img src="/static/Logo.svg" alt="Logo" width={100} height={75}/>
                    <h3 style={{marginBottom:"0px"}}>Транс<br/>Плюс</h3>
                </Link>
            </div>
            <div className="header-menu">
                <div className="menu-items-large">
                    {userName !== '' ?
                        <div className="d-flex align-items-center justify-content-between">
                            <Link to="/profile" style={{textDecoration:"none",color:"black",marginRight:"10px"}} className="header-user_name">{userName}</Link>
                            <OverlayTrigger placement="left" overlay={tooltip}>
                                <img src="/static/logout_icon.svg" alt="Выйти" width={30} height={30} onClick={handleLogout} className="logout-icon"/>
                            </OverlayTrigger>
                        </div>
                        :
                        <div>
                            <Link to="/login" className="btn btn-primary">Войти</Link>
                            <Link to="/register" className="btn btn-primary m-lg-1">Регистрация</Link>
                        </div>
                    }
                </div>
                <div className="menu-items-small">
                    <img src="/static/burger-menu.svg" alt="Бургер меню" width={40} height={40} onClick={handleShow}/>

                    <Offcanvas show={show} onHide={handleClose} placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title className="d-flex align-items-center">
                                <img src="/static/Logo.svg" alt="Logo" width={100} height={75}/>
                                <h3 style={{marginBottom:"0px"}}>Транс<br/>Плюс</h3>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>

                            {userName !== '' ?
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between" style={{borderBottom:"1px solid black"}}>
                                        <span>{userName}</span>
                                        <img src="/static/logout_icon.svg" alt="Выйти" width={30} height={30} onClick={handleLogout}/>
                                    </div>
                                    <button className="btn btn-primary mt-3">
                                        <Link to="/profile" style={{textDecoration:"none",color:"white"}}  onClick={handleClose}>Посмотреть профиль</Link>
                                    </button>
                                </div>
                                :
                                <div className="d-flex justify-content-between">
                                    <Link to="/login" className="btn btn-primary" onClick={handleClose}>Войти</Link>
                                    <Link to="/register" className="btn btn-primary m-lg-1" onClick={handleClose}>Регистрация</Link>
                                </div>
                            }
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>
            </div>
        </div>
    );
};

export default Header;