import './App.css';
import Header from "./components/Header/Header";
import ListOrders from "./components/ListOrders/ListOrders";
import {Route, Routes} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import OrderDetails from "./components/ListOrders/OrderDetails/OrderDetails";

function App() {
  return (
    <>
        <div className="bg-info-subtle p-3">
            <div className="container">
                <Header/>
            </div>
        </div>
        <Routes>
            <Route path="/" element={<ListOrders/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/order/:orderId" element={<OrderDetails />} />
        </Routes>
    </>
  );
}

export default App;
