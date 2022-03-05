import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button, Message } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";

function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { account, hasConnectedWallet, isConnecting, network } =
    useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data, network);
  const [isNewPurchase, setIsNewPurchase] = useState(false);

  const purchaseCourse = async (order) => {
    console.log(JSON.stringify(order));
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));
    console.log(contract);

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );
      _purchaseCourse(hexCourseId, proof, value);
    } else {
      _repurchaseCourse(orderHash, value);
    }
  };

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const c = await contract;
      const result = c.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(result);
    } catch (err) {
      console.log("Purchase course operation has failed", err);
    }
  };

  const _repurchaseCourse = async (courseHash, value) => {
    try {
      const c = await contract;
      const result = c.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      console.log(result);
    } catch (err) {
      console.log("Purchase course operation has failed", err);
    }
  };

  return (
    <>
      <MarketHeader />
      <List courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <Card
              key={course.id}
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <div className="mt-4">
                      <Button variant="lightPurple" disabled={true}>
                        Install
                      </Button>
                    </div>
                  );
                }
                if (isConnecting) {
                  return (
                    <div className="mt-4">
                      <Button variant="lightPurple" disabled={true}>
                        Loading
                      </Button>
                    </div>
                  );
                }

                if (!ownedCourses.isInitialized) {
                  return (
                    <div className="mt-4">
                      <Button variant="lightPurple" disabled={true}>
                        Install
                      </Button>
                    </div>
                  );
                }

                if (owned) {
                  return (
                    <div className="mt-4">
                      <Button variant="white" disabled={true}>
                        Owned &#10003;
                      </Button>
                      {owned.state === "deactivated" && (
                        <Button
                          variant="purple"
                          onClick={() => {
                            setIsNewPurchase(false);
                            setSelectedCourse(course);
                          }}
                        >
                          Fund to Activate
                        </Button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="mt-4">
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      variant="lightPurple"
                      disabled={!hasConnectedWallet}
                    >
                      Purchase
                    </Button>
                  </div>
                );
              }}
            />
          );
        }}
      </List>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={purchaseCourse}
          onClose={() => {
            setIsNewPurchase(true);
            setSelectedCourse(null);
          }}
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
