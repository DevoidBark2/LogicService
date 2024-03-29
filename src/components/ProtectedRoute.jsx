import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userData = localStorage.getItem("user");


    if (userData === null) {
        return <Navigate to="/" />;
    }

    return children


};

export default ProtectedRoute;