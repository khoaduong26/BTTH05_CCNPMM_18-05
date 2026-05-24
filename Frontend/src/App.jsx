import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useLocation } from "react-router-dom";
import { getProfileApi } from "./util/api";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

function App() {
  const { setAuth, logout, appLoading, setAppLoading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAppLoading(false);
        return;
      }

      const payload = decodeJwtPayload(token);
      const preferredRoles = payload?.role === "ADMIN" ? ["ADMIN", "USER"] : ["USER", "ADMIN"];

      try {
        for (const role of preferredRoles) {
          const res = await getProfileApi(role);

          if (res?.user) {
            setAuth({
              isAuthenticated: true,
              token,
              user: {
                id: res.user.id ?? "",
                email: res.user.email ?? "",
                role: res.user.role ?? role,
                name: res.user.name ?? ""
              }
            });
            setAppLoading(false);
            return;
          }
        }

        logout();
      } catch {
        logout();
      }
      setAppLoading(false);
    };

    const initialize = async () => {
      setAppLoading(true);
      await fetchAccount();
    };

    initialize();
  }, [])

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
        :
        <>
          {location.pathname === "/" || location.pathname.startsWith("/products") ? null : <Header />}
          <Outlet />
        </>
      }
    </div>
  )
}

export default App