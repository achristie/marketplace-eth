import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { EthRates, WalletBar } from "@components/ui/web3";
import { useAccount, useNetwork } from "@components/hooks/web3";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { useEthPrice } from "@components/hooks/useEthPrice";

function Marketplace({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { account } = useAccount();
  const { network } = useNetwork();
  const { eth } = useEthPrice();

  return (
    <>
      <div className="py-4">
        <WalletBar
          address={account.data}
          network={{
            data: network.data,
            target: network.targetNetwork,
            isSupported: network.isSupported,
            isInitialized: network.isInitialized,
          }}
        />
        <EthRates eth={eth.data} />
      </div>
      <List courses={courses}>
        {(course) => (
          <Card
            key={course.id}
            course={course}
            Footer={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </List>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
}

const Wrapper = ({ ...props }) => (
  <BaseLayout>
    <Marketplace {...props} />
  </BaseLayout>
);

export default Wrapper;

export function getStaticProps({}) {
  const { data } = getAllCourses();
  return {
    props: { courses: data },
  };
}
