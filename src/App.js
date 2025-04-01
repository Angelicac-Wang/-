import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, CircularProgress, Box, Container } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import RoleManagement from "./pages/RoleManagement";

function App() {
  // 檢查用戶是否已登入
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化驗證狀態 - 程式啟動時檢查登入狀態
  useEffect(() => {
    // 清除所有驗證資訊，確保系統預設為登出狀態
    if (!localStorage.getItem("isAuthenticated")) {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRoles");
    }
    
    // 檢查是否已登入
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 登入處理
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // 登出處理
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRoles");
    setIsAuthenticated(false);
  };

  // 加載中顯示
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <CssBaseline />
      
      {/* 有條件的渲染側邊欄 */}
      {isAuthenticated && <Sidebar onLogout={handleLogout} />}
      
      <Container
        sx={{
          marginLeft: isAuthenticated ? "240px" : "0",
          padding: "20px",
          transition: "margin 0.3s",
          width: isAuthenticated ? "calc(100% - 240px)" : "100%",
        }}
      >
        <Routes>
          {/* 公開路由 */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/customers" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* 受保護的路由 */}
          <Route
            path="/customers"
            element={
              isAuthenticated ? <Customers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/orders"
            element={
              isAuthenticated ? <Orders /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/inventory"
            element={
              isAuthenticated ? <Inventory /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/calendar"
            element={
              isAuthenticated ? <Calendar /> : <Navigate to="/login" />
            }
          />

          {/* 管理員路由 */}
          <Route
            path="/user-management"
            element={
              isAuthenticated ? <UserManagement /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/role-management"
            element={
              isAuthenticated ? <RoleManagement /> : <Navigate to="/login" />
            }
          />

          {/* 首頁重定向 */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/customers" : "/login"} />
            }
          />

          {/* 捕捉不存在的路由 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;