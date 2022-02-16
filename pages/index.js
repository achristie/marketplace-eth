import { Navbar, Footer, Hero, Breadcrumbs } from "@components/common";
import { List } from "@components/course";
import { Card } from "@components/order";
import { WalletBar, EthRates } from "@components/web3";

export default function Home() {
  return (
    <div>
      <div className="relative bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4">
          <Navbar />
          <div className="fit">
            <Hero />
            <Breadcrumbs />
            <EthRates />
            <WalletBar />
            <Card />
            <List />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
