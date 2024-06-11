import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  active: {
    fontWeight: 600,
    borderBottom: "solid #b7a57a .4em",
  },
});

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: any;
}) {
  const classes = useStyles();
  const router = useRouter();

  let className = children.props.className || "";

  if (
    router.pathname === href ||
    ((router.pathname.includes("/opportunities") ||
      router.pathname === "/[location]/[event]") &&
      href === "/opportunities")
  ) {
    className = `${className} ${classes.active}`;
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
}
