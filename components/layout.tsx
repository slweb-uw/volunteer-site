// components/Layout.js
import React, { Component } from "react";
import Footer from "./footer";
import Header from "./header";

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div
        style={{
          overflow: "hidden",
          width: "101%",
          marginLeft: "-1em",
          marginTop: "-1em",
        }}
      >
        <Header />
        {children}
        <Footer />
      </div>
    );
  }
}

export default Layout;
