export default (list: string[] | string): string => {
  if (!(list instanceof Array)) {
    return list
  }
  if (list.length == 0) {
    return "";
  } else if ((new Date(list[0]) !== "Invalid Date") && !isNaN(new Date(list[0]))) {
    return list.map(element => new Date(element).toLocaleDateString()).join(" and ");
  } else if (list.length == 1) {
      return list[0];
  } else if (list.length == 2) {
    return `${list[0]} and ${list[1]}`;
  } else {
    return `${list.slice(0, list.length - 1).join(", ")}, and ${list[list.length - 1]}`;
  }
}