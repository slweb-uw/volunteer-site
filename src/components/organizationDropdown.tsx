import React, { useState } from "react";
import { Select, Divider, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

let index = 0;

export default class OrganizationDropdown extends React.Component<
  {
    city: string;
    orgo: string;
    orgsList: string[];
    setOrgsList: Function;
    setOrgo: Function;
  },
  { name: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  onNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  addItem = () => {
    // console.log('addItem');
    this.setState({
      name: "",
    });
    this.props.setOrgsList([
      ...this.props.orgsList,
      this.state.name || `New item ${index++}`,
    ]);
  };

  render() {
    const { name } = this.state;
    return (
      <Select
        value={this.props.orgo}
        onChange={(v: any) => this.props.setOrgo(v)}
        style={{ width: 240 }}
        placeholder="Select Location First"
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: "4px 0" }} />
            <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
              <Input
                style={{ flex: "auto" }}
                value={name}
                onChange={this.onNameChange}
              />
              <a
                style={{
                  flex: "none",
                  padding: "8px",
                  display: "block",
                  cursor: "pointer",
                }}
                onClick={this.addItem}
              >
                <PlusOutlined /> Add item
              </a>
            </div>
          </div>
        )}
        getPopupContainer={(node) => node.parentNode}
      >
        {this.props.orgsList &&
          this.props.orgsList.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
      </Select>
    );
  }
}
