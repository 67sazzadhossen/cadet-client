import { ReactNode } from "react";

export const sideBarItemsGenerator = (
  item: { name: string; icon?: ReactNode }[]
) => {
  const route = item.reduce(
    (
      acc: { name: string; link: string; icon?: ReactNode }[],
      item: { name: string; icon?: ReactNode }
    ) => {
      if (item.name) {
        const formattedLink = item.name
          .toLowerCase() // A → a
          .trim() // extra space remove
          .replace(/\s+/g, "-"); // space → hyphen

        acc.push({
          name: item.name,
          link:
            item.name === "Home" ? `/dashboard` : `/dashboard/${formattedLink}`,
          icon: item.icon,
        });
      }
      return acc;
    },
    []
  );

  return route;
};
