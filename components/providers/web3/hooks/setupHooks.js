import { handler as createUseAccount } from "@components/providers/web3/hooks/useAccount";

export const setupHooks = (web3) => {
  return {
    useAccount: createUseAccount(web3),
  };
};
