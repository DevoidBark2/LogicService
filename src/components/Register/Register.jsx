import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {formatPhone} from "../../utils";

const Register = () => {

    const [userType, setUserType] = useState('carrier')
    const [firstName,setFirstName] = useState('')
    const [phone,setPhone] = useState('')
    const [secondName,setSecondName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [repeatPassword,setRepeatPassword] = useState('')
    const [error,setError] = useState('')
    const navigate = useNavigate();

    const handlePhone = (e) => {
        const formattedPhone = formatPhone(e.target.value)
        setPhone(formattedPhone);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedPhone = formatPhone(phone);

        if (formattedPhone.length !== 18) {
            setError('Некорректный формат телефона!');
            return;
        }

        if(password !== repeatPassword){
            setError('Пароли должны совпадать!')
            return;
        }

        const requestBody = {
            firstName: firstName,
            secondName: secondName,
            phone: phone,
            email: email,
            password: password,
            userRole: userType
        }

        const response = await fetch('http://transport-service.somee.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            setError(errorText)
        } else {
            const data = await response.json();
            localStorage.setItem("user",JSON.stringify(data))
            navigate('/')
        }

    }

    return(
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div style={{width:"400px"}}>
                <h1>Регистрация</h1>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="userType"
                                id="carrier"
                                value="carrier"
                                checked={userType === 'carrier'}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                            />
                            <label className="form-check-label" htmlFor="carrier">
                                Перевозчик
                            </label>
                        </div>
                        <div className="form-check m-lg-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="userType"
                                id="logist"
                                value="logist"
                                checked={userType === 'logist'}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                            />
                            <label className="form-check-label" htmlFor="logist">
                                Логист
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputEmail1">Имя</label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                               placeholder="Введите имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputEmail1">Фамилия</label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                               placeholder="Введите фамилию" value={secondName} onChange={(e) => setSecondName(e.target.value)} required/>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputEmail1">Телефон</label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                               placeholder="Введите телефон" value={phone} onChange={(e) => handlePhone(e)} required/>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                               placeholder="Введите email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor="exampleInputPassword1">Пароль</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                               placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Повторный пароль</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                               placeholder="Повторите пароль" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required/>
                    </div>
                    <div className="d-flex flex-column">
                        {error && <span className="alert alert-danger mt-2">{error}</span>}
                        <button type="submit" className="btn btn-primary mt-4">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;