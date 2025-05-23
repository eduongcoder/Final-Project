// src/AuthModal.jsx
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { auth } from '../firebase-config';
import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "firebase/auth";
import {
  registerUser, // API đăng ký chính
  loginUserWithPassword, // API login email/password
  // loginUserByEmailOnly, // API login chỉ bằng email (nếu bạn có luồng này)
  createUserByEmailOnly, // API tạo/đồng bộ user chỉ với email (cho Google)
  sendOTP as sendOTPAPI,
  clearUserError
} from "../redux/userSlice";

const logoUrl = "/logo-tc.png";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [receivedOtpFromServer, setReceivedOtpFromServer] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('login'); setEmail(''); setPassword(''); setConfirmPassword('');
        setOtpInput(''); setReceivedOtpFromServer(''); setLocalError('');
        dispatch(clearUserError());
        setIsLoading(false); setIsOtpSending(false);
      }, 300);
    } else {
      setOtpInput(''); setLocalError(''); dispatch(clearUserError());
      if (view === 'login' || view === 'register') setConfirmPassword('');
    }
  }, [isOpen, view, dispatch]);

  const handleCloseModal = () => { if (!isLoading && !isOtpSending) onClose(); };
  const switchToRegister = () => { if (!isLoading && !isOtpSending) setView('register'); };
  const switchToLogin = () => { if (!isLoading && !isOtpSending) setView('login'); };

  // Hàm chung để xử lý gọi API backend và cập nhật UI
  const handleBackendOperation = async (thunkAction, payload, operationName = "Operation") => {
    setIsLoading(true);
    setLocalError('');
    try {
      console.log(`Dispatching ${operationName} with payload:`, payload);
      const actionResult = await dispatch(thunkAction(payload)).unwrap();
      if (onAuthSuccess) onAuthSuccess(actionResult); // Giả sử actionResult là user object
      handleCloseModal();
      return true;
    } catch (err) {
      console.error(`${operationName} Error:`, err);
      setLocalError(typeof err === 'string' ? err : err?.message || `Lỗi ${operationName.toLowerCase()}.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setLocalError("Mật khẩu xác nhận không khớp."); return; }
    if (password.length < 6) { setLocalError("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    setIsOtpSending(true); setLocalError(''); dispatch(clearUserError());
    try {
      const actionResult = await dispatch(sendOTPAPI({ email })).unwrap();
      if (actionResult.otpSent && actionResult.receivedOtp) {
        setReceivedOtpFromServer(actionResult.receivedOtp);
        setView('otp');
      } else {
        setLocalError(actionResult.message || "Gửi OTP thất bại từ server.");
      }
    } catch (err) {
      setLocalError(err?.message || err || "Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    if (String(otpInput) !== String(receivedOtpFromServer)) { setLocalError("Mã OTP không chính xác."); return; }
    setLocalError(''); dispatch(clearUserError());
    try {
      // 1. Tạo user trên Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Gọi API backend để đăng ký user (sử dụng /user/create hoặc tên tương tự)
      const registrationPayload = {
        emailUser: userCredential.user.email,
        passwordUser: password, // Password từ state của form
        dobUser: new Date().toISOString(), // Giá trị mặc định
        coin: 0, // Giá trị mặc định
        // userNameUser: userCredential.user.email.split('@')[0], // Gửi nếu API /create cần
        // firebaseUid: userCredential.user.uid // Nên gửi
      };
      await handleBackendOperation(registerUser, registrationPayload, "User Registration");
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') setLocalError("Email này đã được đăng ký trên Firebase.");
      else if (firebaseError.code === 'auth/weak-password') setLocalError("Mật khẩu quá yếu.");
      else setLocalError(`Đăng ký Firebase thất bại: ${firebaseError.message}`);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setLocalError(''); dispatch(clearUserError());
    try {
      // 1. Đăng nhập Firebase trước (không bắt buộc nếu backend tự xác thực password)
      // Nếu backend có API /user/login nhận email/password và tự hash, bạn không cần bước này.
      // Tuy nhiên, thông thường vẫn đăng nhập Firebase để lấy ID token hoặc user object.
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // eslint-disable-line @typescript-eslint/no-unused-vars

      // 2. Gọi API backend /user/login
      const loginPayload = { email, password };
      await handleBackendOperation(loginUserWithPassword, loginPayload, "Email/Password Login");

    } catch (err) { // Lỗi từ Firebase signIn hoặc từ handleBackendOperation
        if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(err.code)) {
            setLocalError("Email hoặc mật khẩu không đúng.");
        } else if (!err.message && typeof err === 'string') { // Lỗi từ rejectWithValue của thunk
            setLocalError(err);
        }
         else {
            setLocalError(err.message || `Đăng nhập thất bại.`);
        }
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(''); dispatch(clearUserError());
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Backend API /user/createUserByEmail sẽ xử lý "login or create" cho Google user
      const googleSyncPayload = {
        email: result.user.email, // API /createUserByEmail chỉ cần email
        // Nếu API /createUserByEmail có thể nhận thêm thông tin để tạo user đầy đủ hơn:
        // displayName: result.user.displayName,
        // photoURL: result.user.photoURL,
        // firebaseUid: result.user.uid,
        // dobUser: new Date().toISOString(), // Default
        // coin: 0 // Default
      };
      await handleBackendOperation(createUserByEmailOnly, googleSyncPayload, "Google Login/Sync");
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
         if (!err.message && typeof err === 'string') { // Lỗi từ rejectWithValue của thunk
            setLocalError(err);
        } else {
            setLocalError(err.message || `Đăng nhập Google thất bại.`);
        }
      }
    }
  };

  if (!isOpen) return null;
  const currentLoadingState = isLoading || isOtpSending;

  const renderContent = () => {
    // GIỮ NGUYÊN JSX CỦA BẠN CHO CÁC FORM
    // (Copy lại phần này từ các ví dụ trước, đảm bảo các nút dùng `disabled={currentLoadingState}`)
     if (view === 'login') {
      return (
        <form onSubmit={handleEmailPasswordLogin}>
            <div className="mb-4">
              <label htmlFor="email-login" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
              <input id="email-login" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={currentLoadingState} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="password-login" className="block text-sm font-medium text-stone-600 mb-1">Mật khẩu</label>
                <a href="#" className="text-xs text-amber-600 hover:text-amber-700 hover:underline" onClick={(e) => { e.preventDefault(); if (!currentLoadingState) alert("Chức năng Quên mật khẩu chưa được triển khai."); }}>Quên mật khẩu</a>
              </div>
              <input id="password-login" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={currentLoadingState} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <button type="submit" disabled={currentLoadingState} className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <p className="text-sm text-center text-stone-600 mt-5">Chưa có tài khoản?{' '}
              <button type="button" onClick={switchToRegister} disabled={currentLoadingState} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Đăng ký ngay</button>
            </p>
            <div className="my-5 flex items-center">
              <div className="flex-grow border-t border-stone-300"></div><span className="flex-shrink mx-2 text-xs text-stone-400">HOẶC</span><div className="flex-grow border-t border-stone-300"></div>
            </div>
            <button type="button" onClick={handleGoogleLogin} disabled={currentLoadingState} className="w-full flex items-center justify-center py-2.5 px-4 border border-stone-300 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-colors duration-150 text-stone-700 bg-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
              <FcGoogle className="mr-2.5" size={22} />
              {isLoading ? 'Đang xử lý Google...' : 'Đăng nhập bằng Google'}
            </button>
        </form>
      );
    } else if (view === 'register') {
      return (
        <form onSubmit={handleRequestOtp}>
            <div className="mb-4">
              <label htmlFor="email-register" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
              <input id="email-register" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={currentLoadingState} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-4">
              <label htmlFor="password-register" className="block text-sm font-medium text-stone-600 mb-1">Mật khẩu</label>
              <input id="password-register" type="password" placeholder="password (ít nhất 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={currentLoadingState} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-5">
              <label htmlFor="confirm-password-register" className="block text-sm font-medium text-stone-600 mb-1">Nhập lại mật khẩu</label>
              <input id="confirm-password-register" type="password" placeholder="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={currentLoadingState} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <button type="submit" disabled={currentLoadingState} className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed">
              {isOtpSending ? 'Đang gửi OTP...' : 'Tiếp tục'}
            </button>
            <p className="text-sm text-center text-stone-600 mt-5">Đã có tài khoản?{' '}
              <button type="button" onClick={switchToLogin} disabled={currentLoadingState} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Đăng nhập</button>
            </p>
        </form>
      );
    } else if (view === 'otp') {
      return (
        <form onSubmit={handleVerifyOtpAndRegister}>
          <p className="text-sm text-stone-600 mb-3 text-center">
            Một mã OTP đã được gửi đến email <span className="font-semibold">{email}</span>. Vui lòng nhập mã OTP để hoàn tất đăng ký.
          </p>
          <div className="mb-4">
            <label htmlFor="otp-input" className="block text-sm font-medium text-stone-600 mb-1">Mã OTP</label>
            <input
              id="otp-input" type="text" placeholder="Nhập mã OTP" value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)} required disabled={currentLoadingState}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"
            />
          </div>
          <button type="submit" disabled={currentLoadingState}
            className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang đăng ký...' : 'Xác nhận và Đăng ký'}
          </button>
          <p className="text-sm text-center text-stone-600 mt-5">
            <button type="button" onClick={() => {if (!currentLoadingState) setView('register')}} disabled={currentLoadingState} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Quay lại</button>
             {' | '}
            <button type="button" onClick={switchToLogin} disabled={currentLoadingState} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Về trang Đăng nhập</button>
          </p>
        </form>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-stone-100 rounded-lg w-full max-w-sm shadow-xl p-6 sm:p-8 relative text-stone-700">
        <div className="flex justify-between items-center mb-6">
          <img src={logoUrl} alt="Logo" className="h-8 w-auto opacity-80" />
          <h2 className="text-xl font-semibold text-stone-800 absolute left-1/2 -translate-x-1/2">
            {view === 'login' && 'Đăng nhập'}
            {view === 'register' && 'Đăng ký'}
            {view === 'otp' && 'Xác thực OTP'}
          </h2>
          <button onClick={handleCloseModal} className="text-stone-500 hover:text-stone-700" aria-label="Đóng" disabled={currentLoadingState}>
            <X size={24} />
          </button>
        </div>
        {localError && (
          <p className="text-red-600 text-sm text-center mb-3 bg-red-100 p-2 rounded-md">{localError}</p>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;