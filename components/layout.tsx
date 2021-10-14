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
