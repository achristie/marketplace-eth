import { ActiveLink } from "@components/ui/common";
import React from "react";

const BreadCrumbItem = ({ item, i }) => {
  return (
    <li
      key={i}
      className={`${
        i == 0 ? "pr-4" : "px-4"
      } font-medium mr-8 text-gray-500 hover:text-gray-900`}
    >
      <ActiveLink href={item.href}>
        <a href={item.href}>{item.value}</a>
      </ActiveLink>
    </li>
  );
};

export default function Breadcrumbs({ items, isAdmin }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
        {items.map((item, i) => (
          <React.Fragment key={item.href}>
            {!item.requireAdmin && <BreadCrumbItem item={item} i={i} />}
            {item.requireAdmin && isAdmin && (
              <BreadCrumbItem item={item} i={i} />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
