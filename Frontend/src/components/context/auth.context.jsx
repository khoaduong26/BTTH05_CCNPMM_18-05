import { createContext, useEffect, useState } from 'react';

const emptyUser = {
  id: "",
  email: "",
  role: "",
  name: ""
};

const createEmptyAuth = () => ({
  isAuthenticated: false,
  token: "",
  user: { ...emptyUser }
});

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return createEmptyAuth();
  }

  const token = localStorage.getItem('access_token');
  const storedUser = localStorage.getItem('auth_user');

  if (!token) {
    return createEmptyAuth();
  }

  let user = {};

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = {};
    }
  }

  return {
    isAuthenticated: true,
    token,
    user: {
      ...emptyUser,
      ...user
    }
  };
};

export const AuthContext = createContext({
  auth: createEmptyAuth(),
  setAuth: () => {},
  logout: () => {},
  appLoading: true,
  setAppLoading: () => {}
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_user');
      return;
    }

    localStorage.setItem('access_token', auth.token);
    localStorage.setItem('auth_user', JSON.stringify(auth.user ?? emptyUser));
  }, [auth]);

  const logout = () => {
    setAuth(createEmptyAuth());
  };

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      logout,
      appLoading,
      setAppLoading
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};