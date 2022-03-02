import { normalizeOwnedCourse } from "@utils/normalize";
import useSWR from "swr";

export const handler = (web3, contract) => (account) => {
  const swrRes = useSWR(
    () =>
      web3 && contract && account.data && account.isAdmin
        ? `web3/manageCourses/${account.data}`
        : null,
    async () => {
      const courses = [];
      const c = await contract;
      const courseCount = await c.methods.getCourseCount().call();

      for (let i = Number(courseCount) - 1; i >= 0; i--) {
        const courseHash = await c.methods.getCourseHashAtIndex(i).call();
        const course = await c.methods.getCourseByHash(courseHash).call();

        if (course) {
          courses.push(
            normalizeOwnedCourse(web3)({ hash: courseHash }, course)
          );
        }
      }
      return courses;
    }
  );

  return swrRes;
};
