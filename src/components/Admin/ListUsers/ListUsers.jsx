import React, {useEffect, useState} from "react";
import "./ListUsers.css"
import {Button, Modal, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
const ListUsers = () => {

    const [users,setUsers] = useState([])
    const [deleteUserModal,setDeleteUserModal] = useState(false)
    const [userId,setUserId] = useState(0)
    const router = useNavigate();
    const getAllUsers = async () => {
        const response = await fetch('https://transport-service.somee.com/getAllData',{
            method: "GET"
        })

        const data = await response.json();

        if(data.success){
            setUsers(data.users)
        }
    }

    const deleteUser = async () => {

        const requestBody = {
            userId : userId
        }
        const response = await fetch("https://transport-service.somee.com/deleteUser",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json();

        if(data.success){
            router('/admin/list-users')
        }
        setDeleteUserModal(false)
        getAllUsers();
    }

    const handleDeleteUser = (id) => {
        setUserId(id)
        setDeleteUserModal(true)
    }

    useEffect(() => {
        getAllUsers();
    },[])

    return(
        <div className="container mt-4">
            <h1 className="title-block">Список пользователей</h1>
            <Table striped bordered hover responsive="sm">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    user.role !== "admin" && (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.secondName}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.role === "logist" ? "Логист" : user.role === "admin" ? "ADMIN" : "Перевозчик"}
                            </td>
                            <td className="d-flex justify-content-end">
                                <Link to={`${user.id}`}>
                                    <img src="/static/view_user.svg" alt="Посмотреть данные пользователя" width={30} height={30} style={{marginRight:"10px"}}/>
                                </Link>
                                <img src="/static/delete_user.svg" alt="удалить данные пользователя" width={30} height={30} onClick={() => handleDeleteUser(user.id)} />
                            </td>
                        </tr>
                    )
                ))}
                </tbody>
            </Table>

            <Modal
                show={deleteUserModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setDeleteUserModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className="d-flex align-items-center">
                            <h3>Удаление пользователя</h3>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены что хотите удалить пользователя #{userId}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="submit" className="btn btn-danger" onClick={deleteUser}>Удалить</button>
                    <Button className="btn" onClick={() => setDeleteUserModal(false)}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ListUsers