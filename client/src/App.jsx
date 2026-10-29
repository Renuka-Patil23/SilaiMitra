import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/NewCustomer";
import Order from "./pages/Order";
import Measurement from "./pages/Measurement";
import Payment from "./pages/Payment";
import DesignGallery from "./pages/DesignGallery";
import Notifications from "./pages/Notifications";
import OutfitColorMatcher from "./pages/OutfitColorMatcher";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/order" element={<Order />} />
        <Route path="/measurement" element={<Measurement />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/designs/:category" element={<DesignGallery />} />
        <Route path="/outfit-colors" element={<OutfitColorMatcher />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;