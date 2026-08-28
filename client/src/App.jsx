import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewCustomer from "./pages/NewCustomer";
import Customers from "./pages/Customers";
import Order from "./pages/Order";
import Measurement from "./pages/Measurement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/order" element={<Order />} />
        <Route path="/measurement" element={<Measurement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;