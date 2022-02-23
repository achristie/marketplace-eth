import Link from "next/link";
import react from "react";
import { useRouter } from "next/router";
export default function ActiveLink({ children, activeLinkClass, ...props }) {
  const { pathname } = useRouter();
  let className = children.props.className || "";

  if (pathname == props.href) {
    className = `${className} ${
      activeLinkClass ? activeLinkClass : "text-indigo-500"
    }`;
  }
  return <Link {...props}>{react.cloneElement(children, { className })}</Link>;
}
