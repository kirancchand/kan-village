import { useState, useEffect, useCallback } from "react";
import UserContext from "./UserContext";
import http from "./utils/http";
import { REQUEST_APPDATA } from "./utils/constants";
const UserProvider = ({ children }) => {
    const [appName, setAppName] = useState("Gramam");

  const fetchAppName = useCallback(async () => {
    try {
      const res = await http.get(REQUEST_APPDATA);
      console.log("Fetched app name:", res.data.villageapp_name);
      setAppName(res.data.villageapp_name);
    } catch (err) {
      console.error("Failed to fetch app name", err);
    }
  }, []);

  useEffect(() => {
     fetchAppName();
  }, []);

  return (
    <UserContext.Provider value={{ appName, setAppName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;