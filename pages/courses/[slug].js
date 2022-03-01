import { Hero, KeyPoint, Lecture } from "@components/ui/course";
import { Message, Modal } from "@components/ui/common";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";

function Course({ course }) {
  const { isLoading } = useWeb3();
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  const isLocked =
    !courseState ||
    courseState === "purchased" ||
    courseState === "deactivated";
  // const courseState = "deactivated";

  return (
    <>
      <div className="py-4">
        <Hero
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <KeyPoint points={course.wsl} />
      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "purchased" && (
            <Message>Course is purchased and awaiting Activation</Message>
          )}
          {courseState === "deactivated" && (
            <Message type="danger">Course is deactivated</Message>
          )}
          {courseState === "activated" && (
            <Message type="success">Course is active. Good luck!</Message>
          )}
        </div>
      )}
      <Lecture
        locked={isLocked}
        courseState={courseState}
        isLoading={isLoading}
      />
      <Modal />
    </>
  );
}

export default function Wrapper({ ...props }) {
  return (
    <BaseLayout>
      <Course {...props} />
    </BaseLayout>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];
  return {
    props: { course },
  };
}
