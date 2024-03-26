import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Form} from "react-bootstrap"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('')

        const requestBody = {
            email: email,
            password: password
        };

        const response = await fetch("http://transport-service.somee.com/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            setError(errorText);
        } else {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            navigate('/');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div style={{width:"400px"}}>
                <h1>Авторизация</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="exampleInputPassword1">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <span className="alert alert-danger mt-5">{error}</span>}
                    <div className="d-flex flex-column">
                        <button type="submit" className="btn btn-primary mt-4">Войти</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;