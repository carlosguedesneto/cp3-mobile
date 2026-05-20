import { createContext, useEffect, useState } from "react";
// AsyncStorage is used to persist the user between app launches.
// Install locally with: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(null);

const STORAGE_KEY = "@user_profile_v1";

export const UserProvider = ({ children }) => {
  // user: single object as required by the spec
  const [user, setUserState] = useState({
    nome: "",
    rm: "",
    cep: "",
    endereco: { rua: "", bairro: "", cidade: "", estado: "" },
    foto: null,
  });

  // Load persisted user on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setUserState(JSON.parse(raw));
        }
      } catch (err) {
        // Non-fatal — app can proceed with empty user
        console.warn("Falha ao carregar usuário persistido", err);
      }
    })();
  }, []);

  // setUser updates state and persists the whole object
  const setUser = async (newUser) => {
    setUserState(newUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (err) {
      console.warn("Falha ao salvar usuário", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
