import {Link} from "react-router-dom";
import "./Header.css";

const Header = () => {
    return(
        <div className="d-flex align-items-center justify-content-between">
            <div>
                <Link to="/" className="text-decoration-none header-logo d-flex align-items-center">
                    <img src="/static/Logo.svg" alt="Logo" width={100} height={75}/>
                    {/*<span className="first-char">Г</span>руз <span className="second-char">Л</span>айт*/}
                    <h1>Транспорт Плюс</h1>
                </Link>

            </div>
            <div>
                <Link to="/login" className="header-btn">Войти</Link>
                <Link to="/register" className="header-btn">Регистрация</Link>
            </div>
        </div>
    )
}

export default Header;