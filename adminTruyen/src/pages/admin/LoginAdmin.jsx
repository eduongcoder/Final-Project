import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUserWithPassword, clearUserError, loadUserFromStorage } from '../../redux/userSlice'; 

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: reduxError, currentUser } = useSelector((state) => state.users) || {};

  // SCENARIO 1: Xử lý khi người dùng đã đăng nhập từ trước và vào lại trang login
  useEffect(() => {
    // Tải thông tin người dùng từ localStorage ngay khi component được tải
    // để đảm bảo currentUser được cập nhật nếu F5 trang
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // useEffect này sẽ phản ứng với currentUser (dù là vừa tải từ storage hay vừa đăng nhập xong)
    if (currentUser) {
        navigate('/admin', { replace: true });
    }
  }, [currentUser, navigate]);

  // Xóa lỗi cũ khi người dùng bắt đầu nhập lại
  useEffect(() => {
    if (reduxError || localError) {
        dispatch(clearUserError());
        setLocalError('');
    }
  }, [email, password, dispatch]);
  
  // SCENARIO 2: Xử lý ngay sau khi nhấn nút đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    const credentials = {
      email: email, 
      password: password,
    };

    try {
      // Đợi cho đến khi đăng nhập hoàn tất
      await dispatch(loginUserWithPassword(credentials)).unwrap();

      // *** CHUYỂN HƯỚNG TRỰC TIẾP TẠI ĐÂY ***
      // Nếu dòng await ở trên không ném lỗi, nghĩa là đã thành công.
      // Chúng ta sẽ chuyển hướng ngay lập tức, không cần chờ useEffect.
      console.log('Đăng nhập thành công từ handleSubmit! Đang chuyển hướng...');
      navigate('/admin', { replace: true });

    } catch (rejectedValue) {
      console.error('Login failed:', rejectedValue);
    }
  };

  // Phần JSX không thay đổi
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng Nhập Trang Quản Trị
        </h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" required className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Mật khẩu</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {(reduxError || localError) && (<div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-300 rounded-md">{localError || reduxError}</div>)}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;