import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0xfd5900b596e99d34c4a2541a61190fa9614bbebf40c0ee5577b793427bebadbb": true,
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
