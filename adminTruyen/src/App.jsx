import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import RouterSetup from "./routes/RouterSetup";
import { verifyUserSession } from "./redux/userSlice"; // Import action mới

// Component này không render UI, chỉ dùng để chạy logic khởi tạo 1 lần
const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Ngay khi app được tải, dispatch action để xác thực phiên đăng nhập
    dispatch(verifyUserSession());
  }, [dispatch]); // Mảng rỗng đảm bảo chỉ chạy 1 lần duy nhất

  return null; // Không cần render ra cái gì cả
};

function App() {
  return (
    <Provider store={store}>
      {/* Đặt initializer ở đây để nó có thể truy cập Redux store */}
      <AppInitializer />
      
      {/* RouterSetup sẽ được render sau khi logic khởi tạo được chạy */}
      <RouterSetup /> 
    </Provider>
  );
}

export default App;