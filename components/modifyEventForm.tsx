import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Button,
  Modal,
  Form,
  Input,
  Col,
  Row,
  DatePicker,
  Select,
  Space,
  Tabs,
  Checkbox,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { firebaseClient } from "../firebaseClient";
import OrganizationDropdown from "./organizationDropdown";
import VolunteerType from "./volunteerType";
import { rrulestr } from 'rrule';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const moment = require('moment');

const rangeConfig = {
  rules: [
    {
      type: "array",
      required: true,
      message: "Please select time!",
    },
  ],
};

interface Props {
  visible: any;
  onCreate: any;
  onCancel: any;
}

const getOrganizations = async (city: string) => {
  try {
    let doc = await firebaseClient
      .firestore()
      .collection("cache")
      .doc(city)
      .get();
    return doc.data();
  } catch (e) {
    console.log(e);
  }
  return null;
};

const generateLabelValuePairs = (
  upper: number
): { label: string; value: string }[] => {
  const ret: { label: string; value: string }[] = [];
  for (let i = 1; i <= upper; i++) {
    const str = i + "";
    ret.push({ label: str, value: str });
  }
  return ret;
};

export const CollectionCreateForm: React.FC<Props> = (Props) => {
  const [form] = Form.useForm();
  const [recEndDate, setRecEndDate] = useState(null);
  const [tabNum, setTabNum] = useState("1");
  const [interval, setInterval] = useState(null);
  const [weekday, setWeekday] = useState(null);
  const [month, setMonth] = useState(null);
  const [monthday, setMonthday] = useState(null);
  const [add, setAdd] = useState(false);
  const [city, setCity] = useState(null);
  const [orgo, setOrgo] = useState(null);
  const [volunteer, setVolunteer] = useState(null);

  const weekdayOptions = [
    { label: "Monday", value: "MO" },
    { label: "Tuesday", value: "TU" },
    { label: "Wednesday", value: "WE" },
    { label: "Thursday", value: "TH" },
    { label: "Friday", value: "FR" },
    { label: "Saturday", value: "SA" },
    { label: "Sunday", value: "SU" },
  ];
  const monthOptions = generateLabelValuePairs(12);
  const monthdayOptions = generateLabelValuePairs(31);

  const eventData = Props.eventData;

  React.useEffect(() => {
    let recurrencesFields = form.getFieldValue("recurrences");
    if (add && (recEndDate != null)) {
        let ind = recurrencesFields.length - 1
        recurrencesFields[ind] = {
                recEndDate,
                tabNum,
                interval,
                weekday,
                month,
                monthday
        }
        setRecEndDate(null);
    }
  }, [add, recEndDate]);


  React.useEffect(() => {
    form.setFieldsValue({
    Location: [
        city,
        orgo,
        volunteer
    ]
    });
  }, [city, orgo, volunteer]);


  const now = moment();
  console.log(eventData);

  return (
    <Modal
      visible={Props.visible}
      title="Modify Event"
      width={900}
      zIndex={1300}
      okText="Update"
      cancelText="Cancel"
      onCancel={Props.onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            Props.onCreate(values);
            setRecEndDate(null);
            setTabNum("1");
            setInterval(null);
            setWeekday(null);
            setMonth(null);
            setMonthday(null);
            setCity(null);
            setAdd(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal"
        initialValues={{
          ["Title"]: eventData.Title ? eventData.Title : null,
          ["Project Description"]: eventData["Project Description"] ? eventData["Project Description"].replace(/\n/gi, " ") : null,
          ["Location"]: eventData["Location"] ? eventData["Location"] : null,
          // ["Organization"]: 
          ["Types of Volunteers Needed"]: eventData["Types of Volunteers Needed"] ? eventData["Types of Volunteers Needed"] : null,
          ["Contact Information and Cancellation Policy"]: eventData["Contact Information and Cancellation Policy"] ? eventData["Contact Information and Cancellation Policy"].replace(/\n/gi, " ") : null,
          ["Website Link"]: eventData["Website Link"] ? eventData["Website Link"] : null,
          ["Sign-up Link"]: eventData["Sign-up Link"] ? eventData["Sign-up Link"] : null,
          ["Parking and Directions"]: eventData["Parking and Directions"] ? eventData["Parking and Directions"].replace(/\n/gi, " ") : null,
          ["Provider Information"]: eventData["Provider Information"] ? eventData["Provider Information"].replace(/\n/gi, " ") : null,
          ["Clinic Flow"]: eventData["Clinic Flow"] ? eventData["Clinic Flow"].replace(/\n/gi, " ") : null,
          ["Clinic Schedule"]: eventData["Clinic Schedule"] ? eventData["Clinic Schedule"].replace(/\n/gi, " ") : null,
          ["HS Grad Student Information"]: eventData["HS Grad Student Information"] ? eventData["HS Grad Student Information"].replace(/\n/gi, " ") : null,
          ["Project Specific Training"]: eventData["Project Specific Training"] ? eventData["Project Specific Training"].replace(/\n/gi, " ") : null,
          ["Services Provided"]: eventData["Services Provided"] ? eventData["Services Provided"].replace(/\n/gi, " ") : null,
          ["Tips and Reminders"]: eventData["Tips and Reminders"] ? eventData["Tips and Reminders"].replace(/\n/gi, " ") : null,
          ["Undergraduate Information"]: eventData["Undergraduate Information"] ? eventData["Undergraduate Information"].replace(/\n/gi, " ") : null,
          ["DateObject"]: eventData.DateObject ? [moment(eventData.DateObject[0]), moment(eventData.DateObject[1])] : null,
          ["recurrences"]: eventData["recurrences original"] ? eventData["recurrences original"] : null,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="Title"
              label="Event Name"
              rules={[
                {
                  required: true,
                  message: "Please input the name of the event!", //shows upon incompletion
                },
              ]}
            >
              <Input value={eventData.Title ? eventData.Title : null}/>
            </Form.Item>

            <Form.Item
              name="Project Description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please input a description of the event!", //shows upon incompletion
                },
              ]}
            >
              <Input type="textarea" value={eventData["Project Description"] ? eventData["Project Description"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item
              name="Location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: "Please select the location of the event!", //shows upon incompletion
                },
              ]}
            >
              <Select 
                value={eventData?.Location ? eventData?.Location : null} 
                onChange={(v: any) => setCity(v)}
                getPopupContainer={node => node.parentNode}
              >
                <Select.Option value="Alaska">Alaska</Select.Option>
                <Select.Option value="Montana">Montana</Select.Option>
                <Select.Option value="Seattle">Seattle</Select.Option>
                <Select.Option value="Spokane">Spokane</Select.Option>
                <Select.Option value="Wyoming">Wyoming</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="Organization"
              label={<><label style={{ color: "red" }}>∗</label><label>&nbsp;Organization (select Location first)</label></>}
            >
              <OrganizationDropdown
                orgs={getOrganizations}
                city={city}
                setOrgo={setOrgo}
                eventData={eventData}
              />
            </Form.Item>

            <Form.Item
              name="Types of Volunteers Needed"
              label="Types of Volunteers Needed"
            >
              <VolunteerType setVolunteer={setVolunteer} eventData={eventData} />
            </Form.Item>

            <Form.Item
              name="Contact Information and Cancellation Policy"
              label="Contact Information and Cancellation Policy"
            >
              <Input value={eventData["Contact Information and Cancellation Policy"] ? eventData["Contact Information and Cancellation Policy"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="Website Link" label="Website Link">
              <Input value={eventData["Website Link"] ? eventData["Website Link"] : null}/>
            </Form.Item>

            <Form.Item name="Sign-up Link" label="Sign-up Link">
              <Input value={eventData["Sign-up Link"] ? eventData["Sign-up Link"] : null}/>
            </Form.Item>

            <Form.Item
              name="Parking and Directions"
              label="Parking and Directions"
            >
              <Input value={eventData["Parking and Directions"] ? eventData["Parking and Directions"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="Provider Information" label="Provider Information">
              <Input value={eventData["Provider Information"] ? eventData["Provider Information"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.List name="addNewFields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "detailKey"]}
                        fieldKey={[fieldKey, "detailKey"]}
                        rules={[
                          { required: true, message: "Missing detail name" },
                        ]}
                      >
                        <Input placeholder="Detail Name (i.e. Parking Directions)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "detailValue"]}
                        fieldKey={[fieldKey, "detailValue"]}
                        rules={[
                          { required: true, message: "Missing detail value" },
                        ]}
                      >
                        <Input placeholder="Detail Value (i.e. Park at level 2)" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={12}>
            <Form.Item name="Clinic Flow" label="Clinic Flow">
              <Input value={eventData["Clinic Flow"] ? eventData["Clinic Flow"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="Clinic Schedule" label="Clinic Schedule">
              <Input value={eventData["Clinic Schedule"] ? eventData["Clinic Schedule"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item
              name="HS Grad Student Information"
              label="HS Grad Student Information"
            >
              <Input value={eventData["HS Grad Student Information"] ? eventData["HS Grad Student Information"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item
              name="Project Specific Training"
              label="Project Specific Training"
            >
              <Input value={eventData["Project Specific Training"] ? eventData["Project Specific Training"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="Services Provided" label="Services Provided">
              <Input value={eventData["Services Provided"] ? eventData["Services Provided"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="Tips and Reminders" label="Tips and Reminders">
              <Input value={eventData["Tips and Reminders"] ? eventData["Tips and Reminders"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item
              name="Undergraduate Information"
              label="Undergraduate Information"
            >
              <Input value={eventData["Undergraduate Information"] ? eventData["Undergraduate Information"].replace(/\n/gi, " ") : null}/>
            </Form.Item>

            <Form.Item name="DateObject" label="Date/Time">
              <RangePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss" 
                getPopupContainer={node => node.parentNode}
                value={ eventData.DateObject ? [moment(eventData.DateObject[0]), moment(eventData.DateObject[1])] : null}
              />
            </Form.Item>
            <Form.List name="recurrences" initialValue={[]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({name, key, ...restField}) => (
                <Form.Item name={name} key={key} {...restField} label="Event Recurrence"
                rules={[
                {
                  required: true,
                  message: "All fields in recurrences are required", //shows upon incompletion
                },
              ]}>
                    <Tabs defaultActiveKey="1" onChange={(v) => setTabNum(v)}>
                        <TabPane tab="Daily" key="1">
                            <Space>
                            Reapeat Every
                            <Select getPopupContainer={node => node.parentNode} style={{ width: 120 }} onChange={ (v: any)=> setInterval(v)}>
                                <Select.Option value="1">1</Select.Option>
                                <Select.Option value="2">2</Select.Option>
                                <Select.Option value="3">3</Select.Option>
                                <Select.Option value="4">4</Select.Option>
                                <Select.Option value="5">5</Select.Option>
                                <Select.Option value="6">6</Select.Option>
                            </Select>
                            Day
                            </Space>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime getPopupContainer={node => node.parentNode} format="YYYY-MM-DD HH:mm:ss" onOk={ (v: any)=> setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
                            </Space>
                        </TabPane>
                        <TabPane tab="Weekly" key="2">
                            <Checkbox.Group options={weekdayOptions} onChange={(v: any) => setWeekday(v)}/>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime getPopupContainer={node => node.parentNode} format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
                            </Space>
                        </TabPane>
                        <TabPane tab="Monthly" key="3">
                            Month day:
                            <Checkbox.Group options={monthdayOptions} onChange={(v: any) => setMonthday(v)}/>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime getPopupContainer={node => node.parentNode} format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
                            </Space>
                        </TabPane>
                        <TabPane tab="Yearly" key="4">
                            Month:
                            <Checkbox.Group options={monthOptions} onChange={(v: any) => setMonth(v)}/>
                            <br />
                            <br />
                            Month day:
                            <Checkbox.Group options={monthdayOptions} onChange={(v: any) => setMonthday(v)}/>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime getPopupContainer={node => node.parentNode} format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>

                            </Space>
                        </TabPane>
                    </Tabs>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                </Form.Item>
              ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => {add(); setAdd(true);}} block icon={<PlusOutlined />}>
                        Add Recurrence
                    </Button>
                </Form.Item>
            </>
            )}   
            </Form.List>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CollectionsPage = (props) => {
  const [visible, setVisible] = useState(false);
  const DOMAIN = "http:" + "//" + "localhost:3000";
  const calendarApiPath = "/api/put-calendar-event";
  const eventApiPath = "/api/put-event-data";

  const onCreate = async (values: any) => {
    // TODO: clean up organization and this check
    if (!values.Location[1]) {
      alert("Please select an organization for your event.");
      return;
    }

    const rangeTimeValue = values["DateObject"];

    let startTime = null;
    let endTime = null;
    if (rangeTimeValue) {
      startTime = rangeTimeValue[0].toISOString();
      endTime = rangeTimeValue[1].toISOString();
    }

    // TODO: Type address type mismatch, either with a separate type or by adding missing fields
    const calEvent: CalendarEventData = {
      Name: values.Title,
      Description: values["Project Description"],
      Organization: values.Organization,
      Location: values.Location,
      StartDate: startTime,
      EndDate: endTime,
      Timezone: "GMT",
    };
    let rec: string[] = [];
    for (let i of values.recurrences) {
        if (i.recEndDate) {
            switch(i.tabNum) {
                case "1":
                    rec.push(`RRULE:FREQ=DAILY;INTERVAL=${i.interval};UNTIL=${i.recEndDate}`);
                    break;
                case "2":
                    rec.push(`RRULE:FREQ=WEEKLY;BYDAY=${i.weekday};UNTIL=${i.recEndDate}`);
                    break;
                case "3":
                    rec.push(`RRULE:FREQ=MONTHLY;BYMONTHDAY=${i.monthday};UNTIL=${i.recEndDate}`);
                    break;
                case "4":
                    rec.push(`RRULE:FREQ=YEARLY;BYMONTH=${i.month};BYMONTHDAY=${i.monthday};UNTIL=${i.recEndDate}`);
                    break;
                default:
                    break;
            }
        }
    }
    calEvent.Recurrence = rec;
    let recReadable: string[] = [];
    for (let i of rec) {
      if (i) {
        recReadable.push(rrulestr(i).toText());
      }
    }

    // TODO: Do this in a way that doesn't make the linter complain
    const firestoreEvent: CalendarEventData = {};
    Object.keys(values).forEach((element) => {
      if (
        // element != "DateObject" &&
        element != "addNewFields" &&
        element != "Organization" &&
        element != "Location" &&
        element != "recurrences" &&
        element != "Types of Volunteers Needed"
      ) {
        firestoreEvent[element] = values[element];
      }
      if (element == "addNewFields" && values[element] != null) {
        values[element].forEach((newField) => {
          firestoreEvent[newField.detailKey] = newField.detailValue;
        });
      }
      if (element == "Organization") {
        firestoreEvent[element] = values.Location[1];
      }
      if (element == "Location") {
        firestoreEvent[element] = values.Location[0];
      }
      if (element == "Types of Volunteers Needed") {
        firestoreEvent[element] = values.Location[2];
      }
      if (element == "recurrences") {
        firestoreEvent[element] = recReadable;
        firestoreEvent["recurrences original"] = rec;
      }
    });
    
    if (props.eventData?.id) {
      firestoreEvent["id"] = props.eventData.id;
    }

    const calendarPromise = async(calEvent: any, userToken: any) => {
      if (calEvent.StartDate) {
        fetch(DOMAIN + calendarApiPath, {
        method: "POST",
        body: JSON.stringify({ eventData: calEvent, userToken }),
        })
      }};
    firebaseClient
      .auth()
      .currentUser?.getIdToken()
      .then((userToken) => {
        Promise.all([
          calendarPromise(calEvent, userToken),
          fetch(DOMAIN + eventApiPath, {
            method: "POST",
            body: JSON.stringify({ eventData: firestoreEvent, userToken }),
          }),
        ])
          .then((res: any) => {
            // Get a JSON object from each of the responses
            // return Promise.all(res.map((response: any) => {
            //     return response.json();
            // }));
            // }).then((data: any) => {
            //     // Log the data to the console
            //     // You would do something with both sets of data here
            //     console.log(data);
          })
          .catch((error) => {
            // if there's an error, log it
            console.log(error);
          });
        setVisible(false);
      });
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={(e) => {
          // props.handleClose();
          setVisible(true);       
        }}
      >
        Modify Event
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        eventData={props.eventData}
      />
    </div>
  );
};

class ModifyEventForm extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    return <CollectionsPage eventData={this.props.eventData} handleClose={this.props.handleClose} test={this.state.test}/>;
  }
}

export default ModifyEventForm;
