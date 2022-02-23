import { Card, List } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { Button } from "@components/ui/common";
import { getAllCourses } from "@content/courses/fetcher";
import { useWalletInfo } from "@components/hooks/web3";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";

function Marketplace({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { canPurchaseCourse } = useWalletInfo();

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <List courses={courses}>
        {(course) => (
          <Card
            key={course.id}
            course={course}
            disabled={!canPurchaseCourse}
            Footer={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                  disabled={canPurchaseCourse}
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </List>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
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
