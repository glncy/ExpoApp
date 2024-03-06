import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import Config from "@/src/config";
import codePush, { LocalPackage } from "@/src/modules/react-native-code-push";

const codePushConfig = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  deploymentKey: Config.CODEPUSH_DEPLOYMENT_KEY,
};

export const CodePushCtx = createContext<{
  isCodePushReady: boolean;
  SyncStatus: typeof codePush.SyncStatus;
  currentStatus: codePush.SyncStatus;
  currentMetadata: LocalPackage | null;
  downloadReceivedBytes: number;
  downloadTotalBytes: number;
  downloadPercent: number;
  runCodePush: () => void;
}>({
  isCodePushReady: false,
  SyncStatus: codePush.SyncStatus,
  currentStatus: codePush.SyncStatus.CHECKING_FOR_UPDATE,
  currentMetadata: null,
  downloadReceivedBytes: 0,
  downloadTotalBytes: 0,
  downloadPercent: 0,
  runCodePush: () => {},
});

const useCodePushHook = () => {
  const [isCodePushReady, setIsCodePushReady] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<codePush.SyncStatus>(
    codePush.SyncStatus.CHECKING_FOR_UPDATE
  );
  const [downloadReceivedBytes, setDownloadReceivedBytes] = useState(0);
  const [downloadTotalBytes, setDownloadTotalBytes] = useState(0);
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [currentMetadata, setCurrentMetadata] = useState<LocalPackage | null>(
    null
  );

  useEffect(() => {
    if (!__DEV__) codePushProcess();
    else setIsCodePushReady(true);
  }, []);

  useEffect(() => {
    if (!__DEV__) getMetadata();
  }, []);

  const getMetadata = async () => {
    try {
      const metadata = await codePush.getUpdateMetadata();
      if (metadata)
        console.log(
          "[CodePush] Version:",
          `${metadata.label} (${metadata.appVersion})`
        );
      else console.log("[CodePush] Version: No update installed.");
      setCurrentMetadata(metadata);
      return metadata;
    } catch (e) {
      console.log("[CodePush] Error: ", e);
      return null;
    }
  };

  const codePushProcess = () => {
    codePush
      .sync(
        {
          deploymentKey: Config.CODEPUSH_DEPLOYMENT_KEY,
        },
        async (result) => {
          switch (result) {
            case codePush.SyncStatus.UP_TO_DATE:
              setCurrentStatus(codePush.SyncStatus.UP_TO_DATE);
              setIsCodePushReady(true);
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              setCurrentStatus(codePush.SyncStatus.UPDATE_IGNORED);
              setIsCodePushReady(true);
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              try {
                const metadata = await getMetadata();
                if (!metadata?.isMandatory) {
                  setCurrentStatus(codePush.SyncStatus.UPDATE_INSTALLED);
                  setIsCodePushReady(true);
                } else {
                  codePush.restartApp();
                }
              } catch (e) {
                console.log("[CodePush] Error: ", e);
                setCurrentStatus(codePush.SyncStatus.UPDATE_INSTALLED);
                setIsCodePushReady(true);
              }
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
              console.log("[CodePush] Error: ", result);
              setCurrentStatus(codePush.SyncStatus.UNKNOWN_ERROR);
              setIsCodePushReady(true);
              break;
            default:
              setCurrentStatus(result);
              break;
          }
        },
        (details) => {
          console.log(
            `[CodePush] Info: Downloading Update... ${details.receivedBytes} / ${details.totalBytes}`
          );
          setDownloadReceivedBytes(details.receivedBytes);
          setDownloadTotalBytes(details.totalBytes);
          setDownloadPercent(
            Math.round((details.receivedBytes / details.totalBytes) * 100)
          );
        }
      )
      .catch((e) => {
        console.log("[CodePush] Error: ", e);
        setIsCodePushReady(true);
      });
  };

  return {
    isCodePushReady,
    SyncStatus: codePush.SyncStatus,
    currentStatus,
    currentMetadata,
    downloadReceivedBytes,
    downloadTotalBytes,
    downloadPercent,
    runCodePush: codePushProcess,
  };
};

export const useCodePushProvider = Platform.select({
  default: useCodePushHook,
  web: () => {
    const SyncStatus = codePush.SyncStatus;

    return {
      isCodePushReady: true,
      SyncStatus,
      currentStatus: SyncStatus.UP_TO_DATE,
      currentMetadata: null,
      downloadReceivedBytes: 0,
      downloadTotalBytes: 0,
      downloadPercent: 0,
      runCodePush: () => {},
    } as {
      isCodePushReady: boolean;
      SyncStatus: typeof SyncStatus;
      currentStatus: number;
      currentMetadata: LocalPackage | null;
      downloadReceivedBytes: number;
      downloadTotalBytes: number;
      downloadPercent: number;
      runCodePush: () => void;
    };
  },
});

export const CodePushProvider = ({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider: ReturnType<typeof useCodePushProvider>;
}) => {
  return (
    <CodePushCtx.Provider value={provider}>{children}</CodePushCtx.Provider>
  );
};

export function useCodePushCtx() {
  const context = useContext(CodePushCtx);
  return context;
}

export function CodePushHOC(Component: React.ComponentType) {
  if (!__DEV__ && Platform.OS !== "web")
    return codePush(codePushConfig)(Component);
  return Component;
}
