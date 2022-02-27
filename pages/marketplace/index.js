import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { useWalletInfo } from "@components/hooks/web3";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";

function Marketplace({ courses }) {
  const { web3, contract } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { account, canPurchaseCourse } = useWalletInfo();

  const purchaseCourse = async (order) => {
    console.log(JSON.stringify(order));
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const emailHash = web3.utils.sha3(order.email);
    const proof = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: orderHash }
    );

    const value = web3.utils.toWei(String(order.price));
    console.log(contract);

    try {
      const c = await contract;
      const result = c.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(result);
    } catch (err) {
      console.log("Purchase course operation has failed", err);
    }

    console.log(hexCourseId, orderHash, emailHash, proof);
  };

  return (
    <>
      <MarketHeader />
      <List courses={courses}>
        {(course) => (
          <Card
            key={course.id}
            course={course}
            disabled={!canPurchaseCourse}
            Footer={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                  disabled={!canPurchaseCourse}
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
          onSubmit={purchaseCourse}
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
