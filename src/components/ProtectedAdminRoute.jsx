import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const userData = localStorage.getItem("user");

    if (userData === null) {
        return <Navigate to="/login" />;
    }
    const parsedUserData = JSON.parse(userData);
    const { role } = parsedUserData;

    if(role !== 'admin'){
        return <Navigate to="/login"/>
    }

    return children
};

export default ProtectedAdminRoute;