import { useState, useEffect, useCallback } from "react";
import UserContext from "./UserContext";
import http from "./utils/http";
const UserProvider = ({ children }) => {
    const [appName, setAppName] = useState("Gramam");

  const fetchAppName = useCallback(async () => {
    try {
      const res = await http.get("/villageapps/getapp");
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