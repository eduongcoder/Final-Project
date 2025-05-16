import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/page/home';
import Navbar from './component/Navbar';
import DetailPage from './component/page/DetailBook';
function App() {

  return (
    <div>
      <Navbar />
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<DetailPage />} />
        {/* Thêm các route khác ở đây */}
      </Routes>
    </Router>
    </div>

  )
}

export default App
