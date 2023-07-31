import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import Map from "./pages/Map";
import NoPage from "./pages/NoPage";
import AdminLayout from './pages/admin/AdminLayout';
import Profile from './pages/admin/Profile';
import AddSoybean from './pages/admin/AddSoybean';
import Soybean from './pages/admin/Soybean';
import SoybeanMap from './pages/admin/SoybeanMap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="map" element={<Map />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="soybean" element={<Soybean />} />
          <Route path="add-soybean" element={<AddSoybean />} />
          <Route path="soybean-map" element={<SoybeanMap />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
