import { Hero, Breadcrumbs } from "@components/common";
import { List } from "@components/course";
import { BaseLayout } from "@components/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Home({ courses }) {
  return (
    <BaseLayout>
      <Hero />
      <List courses={courses} />
    </BaseLayout>
  );
}

// export function getStaticPaths() {
//   const { data } = getAllCourses();

//   return {
//     paths: data.map((c) => ({
//       params: {
//         slug: c.slug,
//       },
//     })),
//     fallback: false,
//   };
// }

export function getStaticProps({}) {
  const { data } = getAllCourses();
  return {
    props: { courses: data },
  };
}
