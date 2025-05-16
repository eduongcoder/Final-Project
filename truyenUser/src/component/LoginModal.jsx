import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null; // không mở thì không render

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: xử lý login thường
    console.log("Email:", email, "Password:", password);
  };

  const handleGoogleLogin = () => {
    // TODO: xử lý login bằng Google
    console.log("Google Login clicked");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-8 relative">
        
        {/* Button đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Separator */}
          <div className="flex justify-center mb-4">
            <span>***</span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 border border-gray-300 rounded hover:bg-gray-100 mb-4"
          >
            <FcGoogle className="mr-2 text-xl" />
            Đăng nhập bằng Google
          </button>

          {/* Đăng ký + Quên mật khẩu */}
          <div className="flex justify-between text-sm mb-4">
            <a href="#" className="text-blue-600 hover:underline">Đăng ký</a>
            <a href="#" className="text-blue-600 hover:underline">Quên mật khẩu?</a>
          </div>

          {/* Nút Login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
