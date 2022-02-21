import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x5923687f86d1f4365d3373eafd75d64867950131e16dce105740a52a7a431be6": true,
};

export const handler = (web3) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => {
      return web3 ? "web3/accounts" : null;
    },
    async () => {
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    }
  );

  useEffect(() => {
    window.ethereum &&
      window.ethereum.on("accountsChanged", (accounts) =>
        mutate(accounts[0] ?? null)
      );
  }, [web3]);
  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
