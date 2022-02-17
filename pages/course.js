import { Hero, KeyPoint, Lecture, Modal } from "@components/course";
import { BaseLayout } from "@components/layout";

export default function Course() {
  return (
    <BaseLayout>
      <div className="py-4">
        <Hero />
      </div>
      <KeyPoint />
      <Lecture />
      <Modal />
    </BaseLayout>
  );
}
