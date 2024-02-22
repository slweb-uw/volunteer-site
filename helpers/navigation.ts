//function for help button
import { useRouter } from "next/router";

export const handleHelpButtonClick = (router: any, fromPage: string) => {
  router.push({
    pathname: '/help',
    query: { [fromPage]: true },
  });
};