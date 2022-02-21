import { Hero, Breadcrumbs } from "@components/ui/common";
import { List, Card } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWeb3 } from "@components/providers";

function Home({ courses }) {
  const { web3, isLoading } = useWeb3();

  return (
    <>
      <p>{isLoading ? "IS" : web3 ? "Web3 Ready" : "Install Metamask"}</p>
      <Hero />
      <List courses={courses}>
        {(course) => <Card key={course.id} course={course} />}
      </List>
    </>
  );
}

const Wrapper = ({ ...props }) => (
  <BaseLayout>
    <Home {...props} />
  </BaseLayout>
);

export default Wrapper;

export function getStaticProps({}) {
  const { data } = getAllCourses();
  return {
    props: { courses: data },
  };
}
