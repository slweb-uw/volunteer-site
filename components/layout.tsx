// components/Layout.js
import type { PropsWithChildren } from "react"
import Footer from "./footer"
import Header from "./header"

type LayoutProps = PropsWithChildren
function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        minHeight: "100vh",
      }}
    >
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
