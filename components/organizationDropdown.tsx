import React, { useState } from 'react';
import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

let index = 0;

export default class OrganizationDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: '',
      city: (this.props.city != null) ? this.props.city: null
    }
  }  

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.city);
    this.props.orgs(nextProps.city).then((data) => { 
      if (data != null) {
        this.setState({items: Object.keys(data)});
      }
    });
  }

  onNameChange = event => {
    this.setState({
      name: event.target.value,
    });
  };

  addItem = () => {
    // console.log('addItem');
    const { items, name } = this.state;
    this.setState({
      items: [...items, name || `New item ${index++}`],
      name: '',
    });
  };

  componentDidMount() {
    // this.props.orgs("Alaska").then((data) => { 
    //   console.log(data);
    //   if (data != null) {
    //     this.setState({items: Object.keys(data)});
    //   }
    // });
  }

  render() {
    const { items, name } = this.state;
    return (
      <Select
        defaultValue={this.props.eventData?.Organization ? this.props.eventData?.Organization : null}
        onChange={(v: any) => this.props.setOrgo(v) }
        style={{ width: 240 }}
        placeholder="select Location first"
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
              <a
                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                onClick={this.addItem}
              >
                <PlusOutlined /> Add item
              </a>
            </div>
          </div>
        )}
        getPopupContainer={node => node.parentNode}
      >
        {items.map(item => (
          <Option key={item}>{item}</Option>
        ))}
      </Select>
    );
  }
}
