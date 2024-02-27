import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";

const NetworkConnectionContext = createContext<{
  isOnline: boolean;
  NetInfo: typeof NetInfo;
}>({
  isOnline: false,
  NetInfo,
});

export const NetworkConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [success, setSuccess] = useState(false);
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    if (typeof isInternetReachable === "boolean") {
      setSuccess(isInternetReachable);
    }
  }, [isInternetReachable]);

  return (
    <NetworkConnectionContext.Provider
      value={{
        isOnline: success,
        NetInfo,
      }}
    >
      {children}
    </NetworkConnectionContext.Provider>
  );
};

export function useNetworkConnection() {
  const context = useContext(NetworkConnectionContext);
  return context;
}
