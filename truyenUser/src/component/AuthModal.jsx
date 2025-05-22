// AuthModal.js
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { auth } from '../firebase-config';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { loginUserByEmail, createUserByEmail as createUserByEmailAPI, sendOTP as sendOTPAPI, clearUserError } from "../redux/userSlice"; // Đổi tên để tránh nhầm lẫn

const logoUrl = "/logo-tc.png";

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const dispatch = useDispatch();

  const [view, setView] = useState('login'); // 'login', 'register', 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInput, setOtpInput] = useState(''); // OTP người dùng nhập
  const [receivedOtpFromServer, setReceivedOtpFromServer] = useState(''); // OTP nhận từ API
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtpInput('');
        setReceivedOtpFromServer('');
        setLocalError('');
        dispatch(clearUserError());
        setIsLoading(false);
        setIsOtpSending(false);
      }, 300);
    } else {
      // Khi modal mở hoặc view thay đổi, reset các trường liên quan
      setOtpInput('');
      setLocalError('');
      dispatch(clearUserError());
      setIsLoading(false);
      setIsOtpSending(false);
      // Không reset email/password khi chuyển view để người dùng không phải nhập lại
      if (view === 'login' || view === 'register') {
        setConfirmPassword(''); // Chỉ reset confirmPassword khi quay lại form đăng ký
      }
    }
  }, [isOpen, view, dispatch]);


  const handleCloseModal = () => {
    onClose();
  };

  const switchToRegister = () => setView('register');
  const switchToLogin = () => setView('login');

  const processFirebaseAuthAndBackendSync = async (firebaseUser, isForRegistrationFlow = false) => {
    if (!firebaseUser || !firebaseUser.email) {
      setLocalError("Không thể lấy thông tin email từ Firebase.");
      return false; // Chỉ báo lỗi
    }
    setIsLoading(true);
    try {
      // Khi đăng ký, chúng ta đã xác thực OTP và Firebase, giờ chỉ cần tạo user trên backend
      // Khi đăng nhập, chúng ta gọi loginByEmail
      const actionToDispatch = isForRegistrationFlow
        ? createUserByEmailAPI(firebaseUser.email) // Gửi email lên backend để tạo user
        : loginUserByEmail(firebaseUser.email);

      const actionResult = await dispatch(actionToDispatch).unwrap();
      if (onAuthSuccess) onAuthSuccess(actionResult);
      handleCloseModal();
      return true; // Thành công
    } catch (rejectedValueOrSerializedError) {
      console.error("Backend Auth Error:", rejectedValueOrSerializedError);
      const errorMessage = typeof rejectedValueOrSerializedError === 'string'
        ? rejectedValueOrSerializedError
        : rejectedValueOrSerializedError?.message || "Lỗi đồng bộ với backend.";
      setLocalError(errorMessage);
      return false; // Thất bại
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearUserError());

    if (password !== confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setIsOtpSending(true);
    setLocalError('');
    try {
      // API của bạn nhận email trong body
      const actionResult = await dispatch(sendOTPAPI({ email })).unwrap(); // Gửi {email: "value"}
      if (actionResult.otpSent) {
        setReceivedOtpFromServer(actionResult.receivedOtp);
        setView('otp'); // Chuyển sang view nhập OTP
        setLocalError(''); // Xóa lỗi cũ nếu có
      } else {
        setLocalError(actionResult.message || "Gửi OTP thất bại.");
      }
    } catch (rejectedValueOrSerializedError) {
      console.error("Send OTP Error:", rejectedValueOrSerializedError);
      const errorMessage = typeof rejectedValueOrSerializedError === 'string'
        ? rejectedValueOrSerializedError
        : rejectedValueOrSerializedError?.message || "Gửi OTP thất bại. Vui lòng thử lại.";
      setLocalError(errorMessage);
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearUserError());

    if (otpInput !== receivedOtpFromServer) {
      setLocalError("Mã OTP không chính xác.");
      return;
    }

    setIsLoading(true); // Bắt đầu loading cho việc tạo user Firebase và backend
    try {
      // 1. Tạo user trên Firebase trước
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Nếu Firebase thành công, đồng bộ/tạo user trên backend của bạn
      //    Hàm processFirebaseAuthAndBackendSync sẽ xử lý việc dispatch createUserByEmailAPI
      await processFirebaseAuthAndBackendSync(userCredential.user, true);

    } catch (firebaseError) {
      console.error("Firebase Register Error after OTP:", firebaseError);
      if (firebaseError.code === 'auth/email-already-in-use') {
        setLocalError("Email này đã được đăng ký trên Firebase. Vui lòng đăng nhập.");
        // Có thể chuyển người dùng về view login
        // setView('login');
      } else if (firebaseError.code === 'auth/weak-password') {
        setLocalError("Mật khẩu quá yếu (Lỗi Firebase).");
      } else {
        setLocalError("Đăng ký Firebase thất bại. Vui lòng thử lại.");
      }
      setIsLoading(false); // Dừng loading nếu Firebase lỗi
    }
    // setIsLoading(false) đã được xử lý trong finally của processFirebaseAuthAndBackendSync
  };


  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    await processFirebaseAuthAndBackendSync({ email }, false); // Chỉ cần email cho loginByEmailAPI
    // Tuy nhiên, chúng ta cần Firebase auth trước
    setIsLoading(true);
    setLocalError('');
    dispatch(clearUserError());
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await processFirebaseAuthAndBackendSync(userCredential.user, false);
    } catch (err) {
        console.error("Firebase Login Error:", err);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setLocalError("Email hoặc mật khẩu không đúng.");
        } else {
            setLocalError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLocalError('');
    dispatch(clearUserError());
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await processFirebaseAuthAndBackendSync(result.user, false); // isRegistering = false, backend tự xử lý
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setLocalError("Đăng nhập bằng Google thất bại.");
      }
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;
  const displayError = localError;

  const renderContent = () => {
    if (view === 'login') {
      return (
        <form onSubmit={handleEmailPasswordLogin}>
          {/* Form đăng nhập như cũ, sử dụng isLoading */}
          {/* ... (Giữ nguyên form đăng nhập, thêm disabled={isLoading || isOtpSending}) ... */}
            <div className="mb-4">
              <label htmlFor="email-login" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
              <input id="email-login" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading || isOtpSending} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-5">
              <div className="flex justify-between items-baseline">
                <label htmlFor="password-login" className="block text-sm font-medium text-stone-600 mb-1">Mật khẩu</label>
                <a href="#" className="text-xs text-amber-600 hover:text-amber-700 hover:underline" onClick={(e) => { e.preventDefault(); if (!isLoading && !isOtpSending) alert("Chức năng Quên mật khẩu chưa được triển khai."); }}>Quên mật khẩu</a>
              </div>
              <input id="password-login" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading || isOtpSending} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <button type="submit" disabled={isLoading || isOtpSending} className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <p className="text-sm text-center text-stone-600 mt-5">Chưa có tài khoản?{' '}
              <button type="button" onClick={switchToRegister} disabled={isLoading || isOtpSending} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Đăng ký ngay</button>
            </p>
            <div className="my-5 flex items-center">
              <div className="flex-grow border-t border-stone-300"></div><span className="flex-shrink mx-2 text-xs text-stone-400">HOẶC</span><div className="flex-grow border-t border-stone-300"></div>
            </div>
            <button type="button" onClick={handleGoogleLogin} disabled={isLoading || isOtpSending} className="w-full flex items-center justify-center py-2.5 px-4 border border-stone-300 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-colors duration-150 text-stone-700 bg-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
              <FcGoogle className="mr-2.5" size={22} />{isLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
            </button>
        </form>
      );
    } else if (view === 'register') {
      return (
        <form onSubmit={handleRequestOtp}> {/* Form đăng ký giờ sẽ gọi handleRequestOtp */}
          {/* Form đăng ký như cũ, nhưng nút submit là "Tiếp tục" hoặc "Gửi OTP" */}
          {/* ... (Giữ nguyên form đăng ký, sử dụng isOtpSending cho nút submit) ... */}
            <div className="mb-4">
              <label htmlFor="email-register" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
              <input id="email-register" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isOtpSending || isLoading} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-4">
              <label htmlFor="password-register" className="block text-sm font-medium text-stone-600 mb-1">Mật khẩu</label>
              <input id="password-register" type="password" placeholder="password (ít nhất 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isOtpSending || isLoading} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <div className="mb-5">
              <label htmlFor="confirm-password-register" className="block text-sm font-medium text-stone-600 mb-1">Nhập lại mật khẩu</label>
              <input id="confirm-password-register" type="password" placeholder="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isOtpSending || isLoading} className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"/>
            </div>
            <button type="submit" disabled={isOtpSending || isLoading} className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed">
              {isOtpSending ? 'Đang gửi OTP...' : 'Tiếp tục'}
            </button>
            <p className="text-sm text-center text-stone-600 mt-5">Đã có tài khoản?{' '}
              <button type="button" onClick={switchToLogin} disabled={isOtpSending || isLoading} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">Đăng nhập</button>
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
            <label htmlFor="otp-input" className="block text-sm font-medium text-stone-600 mb-1">
              Mã OTP
            </label>
            <input
              id="otp-input"
              type="text"
              placeholder="Nhập mã OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-stone-400 disabled:bg-stone-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang đăng ký...' : 'Xác nhận và Đăng ký'}
          </button>
          <p className="text-sm text-center text-stone-600 mt-5">
            <button type="button" onClick={() => setView('register')} disabled={isLoading} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
              Quay lại
            </button>
             {' | '}
            <button type="button" onClick={switchToLogin} disabled={isLoading} className="font-semibold text-amber-600 hover:text-amber-700 hover:underline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                Về trang Đăng nhập
            </button>
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
          <button onClick={handleCloseModal} className="text-stone-500 hover:text-stone-700" aria-label="Đóng" disabled={isLoading || isOtpSending}>
            <X size={24} />
          </button>
        </div>

        {displayError && (
          <p className="text-red-600 text-sm text-center mb-3 bg-red-100 p-2 rounded-md">{displayError}</p>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;