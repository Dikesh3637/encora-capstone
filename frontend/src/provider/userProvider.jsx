import { jwtDecode } from "jwt-decode";
import React, { use, useState, createContext } from "react";

/**
 * @typedef {Object} User
 * @property {string} userId
 * @property {Array<String>} roles
 * @property {string} userName
 * @property {string} email
 */

/**
 * @typedef {Object} UserContextType
 * @property {User | null} user
 * @property {(User) => void} setUser
 * @property {(token: string) => void} login
 * @property {() => void} logout
 */

const userContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const decodedUser = jwtDecode(accessToken);
        console.log(decodedUser);
        return decodedUser;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("accessToken");
    }
    return null;
  });

  const login = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      localStorage.setItem("accessToken", token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const value = {
    user,
    setUser,
    login,
    logout,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

/**
 * Custom hook to consume the UserContext
 * @returns {UserContextType}
 */

function useUser() {
  const context = use(userContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { UserProvider, useUser };
