import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x366d0395e8f6489e529134186b576f5a507ab6affa72d4928f583da8c33e40d2": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => {
      return web3 ? "web3/accounts" : null;
    },
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      if (!account) {
        throw new Error("Cannot retrieve an account");
      }
      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider]);
  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
