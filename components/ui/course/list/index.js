import Image from "next/image";
import Link from "next/link";

export default function List({ courses }) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((c) => (
        <div
          key={c.id}
          className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <Image
                className="object-cover"
                src={c.coverImage}
                alt={c.title}
                layout="fixed"
                width="200"
                height="230"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {c.type}
              </div>
              <Link href={`/courses/${c.slug}`}>
                <a
                  href="#"
                  className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
                >
                  {c.title}
                </a>
              </Link>
              <p className="mt-2 text-gray-500">{c.description}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
