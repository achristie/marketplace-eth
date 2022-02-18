import { useWeb3 } from "@components/providers";
import Link from "next/link";
import { Button } from "@components/ui/common";
import { useAccount } from "@components/web3/hooks/useAccount";
export default function Navbar() {
  const { connect, isWeb3Loaded, isLoading } = useWeb3();
  const { account } = useAccount();
  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex justify-between items-center">
            <div>
              <Link href="#">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  {account}
                </a>
              </Link>
              <Link href="/features">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Features
                </a>
              </Link>
              <Link href="/marketplace">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>
              </Link>
            </div>
            <div>
              <a
                href="#"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Company
              </a>

              {isLoading ? (
                <Button disabled={true} onClick={connect}>
                  Loading...
                </Button>
              ) : isWeb3Loaded ? (
                <Button onClick={connect}>Connect Wallet</Button>
              ) : (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download.html", "_blank")
                  }
                >
                  Install Metamask
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
