import { useWeb3 } from "@components/providers";
import { useWalletInfo } from "@components/hooks/web3";
import { Button } from "@components/ui/common";

export default function WalletBar() {
  const { requireInstall } = useWeb3();
  const { account, network, canPurchaseCourse } = useWalletInfo();
  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="text-sm xs:text-xl break-words">
          Hello, {account.data}
        </h1>
        <h2 className="subtitle mb-5 text-sm xs:text-base">
          I hope you are having a great day!
        </h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <Button variant="white" className="mr-1 text-sm xs:text-lg">
              Learn how to purchase
            </Button>
          </div>
          <div>
            {network.isInitialized && !network.isSupported && (
              <div className="bg-red-400 p-4 rounded-lg">
                <div>Connected to wrong network</div>
                <div>
                  Connect to: {` `} <strong>{network.target}</strong>
                </div>
              </div>
            )}
            {requireInstall && (
              <div>Cannot connect to network. Please install Metamask</div>
            )}
            <div>
              <span>Currently on </span>
              <strong className="text-2xl">{network.data}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
