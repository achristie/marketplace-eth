import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button, Loader, Message } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";
import { withToast } from "utils/toast";

function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { account, hasConnectedWallet, isConnecting, network } =
    useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data, network);
  const [isNewPurchase, setIsNewPurchase] = useState(false);
  const [busyCourse, setBusyCourse] = useState(null);

  const purchaseCourse = async (order, course) => {
    const hexCourseId = web3.utils.utf8ToHex(course.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));

    setBusyCourse(course.id);
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );
      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash, value }, course));
    }
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      const c = await contract;
      const result = c.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setBusyCourse(null);
    }
  };

  const _repurchaseCourse = async ({ courseHash, value }, course) => {
    try {
      const c = await contract;
      const result = c.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      return result;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setBusyCourse(null);
    }
  };

  const cleanupModal = () => {
    setIsNewPurchase(true);
    setSelectedCourse(null);
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

                const isBusy = busyCourse === course.id;
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
                      {isBusy ? (
                        <div className="flex">
                          <Loader size="sm" />
                          <div className="ml-2">In Progress</div>
                        </div>
                      ) : (
                        <div>Purchase</div>
                      )}
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
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={cleanupModal}
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
