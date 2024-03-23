import { cloneElement } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  active: {
    fontWeight: 600,
    borderBottom: "solid #b7a57a .4em",
  },
})

export default ({ href, children }: { href: string; children: any }) => {
  const classes = useStyles()
  const router = useRouter()

  let className = children.props.className || ""

  if (
    router.pathname === href ||
    ((router.pathname.includes("/opportunities") ||
      router.pathname === "/[location]/[event]") &&
      href === "/opportunities")
  ) {
    className = `${className} ${classes.active}`
  }

  return <Link href={href}>{cloneElement(children, { className })}</Link>
}
