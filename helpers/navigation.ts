//function for help button

export const handleHelpButtonClick = (router: any, fromPage: string) => {
  router.push({
    pathname: '/help',
    query: { [fromPage]: true },
  });
};