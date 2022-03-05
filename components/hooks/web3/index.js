import { useHooks } from "@components/providers/web3";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useWeb3 } from "@components/providers";

const _isEmpty = (data) => {
  return (
    data == null ||
    data == "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = (swrResponse) => {
  const { data, error } = swrResponse;
  const isInitialized = !!(data || error);
  const isEmpty = isInitialized && _isEmpty(data);

  return {
    ...swrResponse,
    isInitialized,
    isEmpty,
  };
};

export const useAccount = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account: swrRes,
  };
};

export const useAdmin = ({ redirectTo }) => {
  const { account } = useAccount();
  const router = useRouter();
  const { requireInstall } = useWeb3();

  useEffect(() => {
    if (
      requireInstall ||
      (account.isInitialized && !account.isAdmin) ||
      account.isEmpty
    ) {
      router.push(redirectTo);
    }
  }, [account]);

  return { account };
};

export const useNetwork = () => {
  const swrRes = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: swrRes,
  };
};
export const useOwnedCourse = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourse)(...args)
  );

  return {
    ownedCourse: swrRes,
  };
};

export const useOwnedCourses = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourses)(...args)
  );

  return {
    ownedCourses: swrRes,
  };
};

export const useManageCourses = (...args) => {
  const swrRes = enhanceHook(
    useHooks((hooks) => hooks.useManageCourses)(...args)
  );

  return {
    manageCourses: swrRes,
  };
};
export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();
  const hasConnectedWallet = !!(account.data && network.isSupported);
  const isConnecting = !account.isInitialized && network.isInitialized;

  return {
    account,
    network,
    isConnecting,
    hasConnectedWallet,
  };
};
