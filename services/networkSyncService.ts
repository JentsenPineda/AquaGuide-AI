import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { syncAllOfflineData } from "./syncService";

let unsubscribeNetwork: (() => void) | null = null;
let currentUid: string | null = null;
let lastOnlineState: boolean | null = null;

const isConnected = (state: NetInfoState): boolean => {
  return state.isConnected === true && state.isInternetReachable !== false;
};

export const startNetworkSync = (uid: string): (() => void) => {
  if (!uid) {
    return () => {};
  }

  if (unsubscribeNetwork && currentUid === uid) {
    return () => {};
  }

  stopNetworkSync();

  currentUid = uid;

  const handleNetworkChange = async (state: NetInfoState) => {
    const online = isConnected(state);

    console.log(
      "NETWORK STATUS:",
      online ? "ONLINE" : "OFFLINE",
      "| internet:",
      state.isInternetReachable,
    );

    const cameBackOnline = online && lastOnlineState === false;

    const firstNetworkCheck = lastOnlineState === null;

    lastOnlineState = online;

    if (!online) {
      return;
    }

    // Sync when:
    // 1. The listener receives its first online state.
    // 2. The device transitions from offline → online.
    if (firstNetworkCheck || cameBackOnline) {
      try {
        console.log("NETWORK SYNC: Starting...");

        const result = await syncAllOfflineData(uid);

        console.log("NETWORK SYNC: Completed:", result);
      } catch (error) {
        console.log("NETWORK SYNC ERROR:", error);
      }
    }
  };

  unsubscribeNetwork = NetInfo.addEventListener(handleNetworkChange);

  return () => {
    stopNetworkSync();
  };
};

export const stopNetworkSync = () => {
  if (unsubscribeNetwork) {
    unsubscribeNetwork();
    unsubscribeNetwork = null;
  }

  currentUid = null;
  lastOnlineState = null;
};
