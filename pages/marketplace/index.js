import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { WalletBar } from "@components/ui/web3";
import { useAccount, useNetwork } from "@components/hooks/web3";

function Marketplace({ courses }) {
  const { account } = useAccount();
  const { network } = useNetwork();

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
      </div>
      <List courses={courses}>
        {(course) => <Card key={course.id} course={course} />}
      </List>
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
