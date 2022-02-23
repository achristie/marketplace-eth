import { MarketHeader } from "@components/ui/marketplace";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";

function OwnedCourses() {
  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <section className="grid grid-cols-1">
        <OwnedCourseCard />
      </section>
    </>
  );
}

const Wrapper = ({ ...props }) => (
  <BaseLayout>
    <OwnedCourses {...props} />
  </BaseLayout>
);
export default Wrapper;
