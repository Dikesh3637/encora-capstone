import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { use, useState, createContext, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  // Initialize Query Client to invalidate queries later
  const queryClient = useQueryClient();

  const [user, setUser] = useState(() => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        return jwtDecode(accessToken);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove("accessToken");
    }
    return null;
  });

  // --- WEBSOCKET CONNECTION LOGIC ---
  useEffect(() => {
    let socket = null;

    if (user?.userId) {
      // 1. Connect to WebSocket
      const wsUrl = `ws://localhost:8081?userId=${user.userId}`;
      console.log("Connecting to WebSocket:", wsUrl);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected for user:", user.userId);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Notification received:", data);

          // 2. Show Toast Notification
          // You can customize the message based on status (SUCCESS/FAILED)
          if (data.status === "CONFIRMED" || data.status === "SUCCESS") {
            toast.success(`Order Confirmed: ${data.productName}`);
          } else if (data.status?.includes("FAILED")) {
            toast.error(`Order Failed: ${data.productName} - ${data.status}`);
          } else {
            toast.info(`Order Update: ${data.status}`);
          }

          // 3. Invalidate Queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["admin-search"] });
          queryClient.invalidateQueries({ queryKey: ["product"] });
          queryClient.invalidateQueries({ queryKey: ["my-orders"] });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch (e) {
          console.error("Error parsing WS message:", e);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    }

    // Cleanup: Close socket on unmount or user logout
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, queryClient]); // Re-run if user changes

  const login = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      // Note: You usually set the cookie here or your backend does it
      // Cookies.set("accessToken", token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("accessToken");
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

export { UserProvider, useUser };
