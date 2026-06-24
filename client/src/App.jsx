import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/AdminRoute";
import { useLanguage } from "./context/LanguageContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";

function App() {
  const { language } = useLanguage();

  return (
    <div className={language === "ar" ? "app rtl" : "app"}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/restaurants/:id"
          element={
            <UserRoute>
              <RestaurantMenu />
            </UserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <UserRoute>
              <MyOrders />
            </UserRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;