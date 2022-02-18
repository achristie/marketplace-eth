import Link from "next/link";
export default function Navbar() {
  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex justify-between">
            <div>
              <Link href="#">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Product
                </a>
              </Link>
              <Link href="/features">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Features
                </a>
              </Link>
              <Link href="/marketplace">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>
              </Link>
            </div>
            <div>
              <a
                href="#"
                className="font-medium mr-8 text-gray-500 hover:text-gray-900"
              >
                Company
              </a>
              <a
                href="#"
                className="px-8 py-3 border rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Connect Wallet
              </a>
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}
