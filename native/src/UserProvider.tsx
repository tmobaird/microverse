import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React from "react";
const { v4: uuidv4 } = require("uuid");

export const UserContext = React.createContext({
  token: "",
  uuid: "",
  setUuid: (uuid: string) => {},
  setToken: (token: string) => {},
});

const UserProvider = ({ children }) => {
  const [uuid, setUuidState] = React.useState("");
  const [token, setTokenState] = React.useState("");

  React.useEffect(() => {
    const fetchUuidAndToken = async () => {
      let resultingUuid = await SecureStore.getItemAsync("user-id");
      if (resultingUuid) {
        setUuidState(resultingUuid);
      } else {
        try {
          const resultingUuid = uuidv4();
          setUuidState(resultingUuid);
          await SecureStore.setItemAsync("user-id", resultingUuid);
        } catch (e) {
          console.log(e);
        }
      }
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setTokenState(storedToken);
      } else {
        try {
          const httpClient = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
          });
          const token = await httpClient
            .post("/token", {
              username: process.env.EXPO_PUBLIC_TOKEN_USERNAME,
              password: process.env.EXPO_PUBLIC_TOKEN_PASSWORD,
              userId: resultingUuid,
            })
            .then((res) => res.data.token);
          setTokenState(token);
          await SecureStore.setItemAsync("token", token);
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchUuidAndToken();
  }, []);

  return (
    <UserContext.Provider
      value={{ uuid, setUuid: setUuidState, token, setToken: setTokenState }}
    >
      {uuid && token && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
