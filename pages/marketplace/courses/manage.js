import { useAdmin, useManageCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import {
  CourseFilter,
  ManagedCourseCard,
  OwnedCourseCard,
} from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { useState } from "react";

const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState();
  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button onClick={() => onVerify(email)}>Verify</Button>
    </div>
  );
};

function ManageCourses() {
  const [proofedOwnership, setProofedOwnership] = useState({});
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const { manageCourses } = useManageCourses(account);

  const verifyCourse = (email, { hash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({ ...proofedOwnership, [hash]: true })
      : setProofedOwnership({ ...proofedOwnership, [hash]: false });
  };

  const changeCourseState = async (courseHash, method) => {
    try {
      const c = await contract;
      await c.methods[method](courseHash).send({ from: account.data });
    } catch (e) {
      console.error(e.message);
    }
  };
  if (!account.isAdmin) {
    return null;
  }
  return (
    <>
      <MarketHeader />
      <CourseFilter />
      <section className="grid grid-cols-1">
        {manageCourses.data?.map((course) => (
          <ManagedCourseCard key={course.ownedCourseId} course={course}>
            <VerificationInput
              onVerify={(email) => {
                verifyCourse(email, { hash: course.hash, proof: course.proof });
              }}
            />
            {proofedOwnership[course.hash] && (
              <div className="mt-4">
                <Message>Verified</Message>
              </div>
            )}
            {proofedOwnership[course.hash] == false && (
              <div className="mt-4">
                <Message type="danger">Wrong Proof</Message>
              </div>
            )}
            <div className="mt-4">
              <Button
                variant="green"
                onClick={() => changeCourseState(course.hash, "activateCourse")}
              >
                Activate
              </Button>
              <Button
                variant="red"
                onClick={() =>
                  changeCourseState(course.hash, "deactivateCourse")
                }
              >
                Deactivate
              </Button>
            </div>
          </ManagedCourseCard>
        ))}
      </section>
    </>
  );
}
const Wrapper = ({ ...props }) => (
  <BaseLayout>
    <ManageCourses {...props} />
  </BaseLayout>
);
export default Wrapper;
