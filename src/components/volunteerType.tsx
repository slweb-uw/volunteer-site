import { Component } from "react"
import { Select } from "antd"

const { Option } = Select

const children = []

const volunteerTypes = [
  "School of Medicine",
  "School of Dentistry",
  "School of Nursing",
  "School of Pharmacy",
  "School of Public Health",
  "School of Social Work",
  "MEDEX",
  "PT/OT/P&O",
]

export default class VolunteerType extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    for (let volunteer of volunteerTypes) {
      children.push(<Option key={volunteer}>{volunteer}</Option>)
    }
    return (
      <Select
        defaultValue={
          this.props.eventData?.["Types of Volunteers Needed"]
            ? this.props.eventData?.["Types of Volunteers Needed"]
            : []
        }
        onChange={(v: any) => this.props.setVolunteer(v)}
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select one or more"
        getPopupContainer={(node) => node.parentNode}
      >
        {children}
      </Select>
    )
  }
}
