import { List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { WalletBar } from "@components/ui/web3";
import { useAccount } from "@components/hooks/web3/useAccount";

function Marketplace({ courses }) {
  const { account } = useAccount();

  return (
    <>
      <div className="py-4">
        <WalletBar address={account.data} />
      </div>
      <List courses={courses} />
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
