import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const getUsers = async () => {
    const response = await fetch("http://localhost:3000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      return;
    }
    
    const data = await response.json();
    console.log(data);
    setUser(data);
  };

  useEffect(() => {
    const data = localStorage.getItem("token");

    if (data) {
      setToken(data);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
