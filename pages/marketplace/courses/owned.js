import { MarketHeader } from "@components/ui/marketplace";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button, Message } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { useRouter } from "next/router";

function OwnedCourses({ courses }) {
  const router = useRouter();
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            {/* <Message /> */}
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the Course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
    </>
  );
}

const Wrapper = ({ ...props }) => (
  <BaseLayout>
    <OwnedCourses {...props} />
  </BaseLayout>
);

export function getStaticProps({}) {
  const { data } = getAllCourses();
  return {
    props: { courses: data },
  };
}
export default Wrapper;
