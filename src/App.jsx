import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import NoPage from './pages/NoPage';
import AdminLayout from './pages/admin/AdminLayout';
import Profile from './pages/admin/Profile';
import AddSoybean from './pages/admin/soybean/AddSoybean';
import Dashboard from './pages/admin/Dashboard';
import AddCorn from './pages/admin/corn/AddCorn';
import SoybeanDetail from './pages/admin/soybean/SoybeanDetail';
import CornDetail from './pages/admin/corn/CornDetail';
import New from './pages/admin/New';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new">
            <Route index element={<New />} />
            <Route path="soybean" element={<AddSoybean />} />
            <Route path="corn" element={<AddCorn />} />
          </Route>
          <Route path="edit">
            <Route path="soybean/:id" element={<AddSoybean edit />} />
            <Route path="corn/:id" element={<AddCorn edit />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="result">
            <Route index element={<Dashboard />} />
            <Route path="soybean/:id" element={<SoybeanDetail />} />
            <Route path="corn/:id" element={<CornDetail />} />
          </Route>

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
