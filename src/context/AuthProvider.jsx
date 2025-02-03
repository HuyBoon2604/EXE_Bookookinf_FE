import { createContext, useState, useEffect } from "react";

// Tạo AuthContext
const AuthContext = createContext({
    auth: null, // Giá trị mặc định
    setAuth: () => {} // Hàm mặc định
});

// Tạo Provider
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem("auth");
        const expiry = localStorage.getItem("authExpiry");
        const now = new Date().getTime();

        // Kiểm tra xem dữ liệu có tồn tại và còn hạn hay không
        if (savedAuth && expiry && now < parseInt(expiry)) {
            return JSON.parse(savedAuth);
        } else {
            // Xóa nếu hết hạn hoặc không tồn tại
            localStorage.removeItem("auth");
            localStorage.removeItem("authExpiry");
            return { user: null };
        }
    });

    // Lưu thông tin người dùng và thời gian hết hạn vào localStorage khi auth thay đổi
    useEffect(() => {
        if (auth?.user) {
            const expiry = new Date().getTime() + 60 * 60 * 1000; // 1 tiếng
            localStorage.setItem("auth", JSON.stringify(auth));
            localStorage.setItem("authExpiry", expiry.toString());
        } else {
            localStorage.removeItem("auth");
            localStorage.removeItem("authExpiry");
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
