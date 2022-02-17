import { Hero, Breadcrumbs } from "@components/common";
import { List } from "@components/course";
import { BaseLayout } from "@components/layout";
import { Card } from "@components/order";
import { WalletBar, EthRates } from "@components/web3";

export default function Home() {
  return (
    <BaseLayout>
      <Hero />
      <Breadcrumbs />
      <EthRates />
      <WalletBar />
      <Card />
      <List />
    </BaseLayout>
  );
}
