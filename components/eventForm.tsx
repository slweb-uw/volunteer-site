import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
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

const getOrganizations = async (city) => {
    try {
        let doc = await firebaseClient.firestore().collection('cache').doc(city).get()
        return doc.data();
    } catch (e) {
        console.log(e);
    }
    return null;
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

const CollectionCreateForm: React.FC<Props> = (Props) => {
    const [form] = Form.useForm();
    const [recEndDate, setRecEndDate] = useState(null);
    const [tabNum, setTabNum] = useState(1);
    const [interval, setInterval] = useState(null);
    const [weekday, setWeekday] = useState(null);
    const [month, setMonth] = useState(null);
    const [monthday, setMonthday] = useState(null);
    const [add, setAdd] = useState(false);
    const [city, setCity] = useState(null);
    const [orgo, setOrgo] = useState(null);

    const weekdayOptions = [
        { label: "Monday", value: "MO" },
        { label: "Tuesday", value: "TU" },
        { label: "Wednesday", value: "WE" },
        { label: "Thursday", value: "TH" },
        { label: "Friday", value: "FR" },
        { label: "Saturday", value: "SA" },
        { label: "Sunday", value: "SU" }
    ];
    const monthOptions = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
    ];
    const monthdayOptions = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
        { label: "11", value: "11" },
        { label: "12", value: "12" },
        { label: "13", value: "13" },
        { label: "14", value: "14" },
        { label: "15", value: "15" },
        { label: "16", value: "16" },
        { label: "17", value: "17" },
        { label: "18", value: "18" },
        { label: "19", value: "19" },
        { label: "20", value: "20" },
        { label: "21", value: "21" },
        { label: "22", value: "22" },
        { label: "23", value: "23" },
        { label: "24", value: "24" },
        { label: "25", value: "25" },
        { label: "26", value: "26" },
        { label: "27", value: "27" },
        { label: "28", value: "28" },
        { label: "29", value: "29" },
        { label: "30", value: "30" },
        { label: "31", value: "31" }
    ];

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
        form.setFieldsValue({
            Recurrence: {
  const [form] = Form.useForm();
  const [recEndDate, setRecEndDate] = useState(null);
  const [tabNum, setTabNum] = useState(1);
  const [interval, setInterval] = useState(null);
  const [weekday, setWeekday] = useState(null);
  const [month, setMonth] = useState(null);
  const [monthday, setMonthday] = useState(null);
  const [city, setCity] = useState(null);
  const [orgo, setOrgo] = useState(null);

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
  React.useEffect(() => {
    form.setFieldsValue({
      Recurrence: {
        recEndDate,
        tabNum,
        interval,
        weekday,
        month,
        monthday,
        city,
        orgo,
      },
    });
  }, [recEndDate, tabNum, interval, weekday, month, monthday, city, orgo]);

  return (
    <Modal
      visible={Props.visible}
      title="Create New Event"
      width={900}
      okText="Create"
      cancelText="Cancel"
      onCancel={Props.onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            Props.onCreate(values);
            setRecEndDate(null);
            setTabNum(1);
            setInterval(null);
            setWeekday(null);
            setMonth(null);
            setMonthday(null);
            setCity(null);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
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
              <Input />
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
              <Input type="textarea" />
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
              <Select onChange={(v: any) => setCity(v)}>
                <Select.Option value="Alaska">Alaska</Select.Option>
                <Select.Option value="Montana">Montana</Select.Option>
                <Select.Option value="Seattle">Seattle</Select.Option>
                <Select.Option value="Spokane">Spokane</Select.Option>
                <Select.Option value="Wyoming">Wyoming</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="Organization"
              // label="* Organization (select Location first)"
              label={<><label style={{ color: "red" }}>∗</label><label>&nbsp;Organization (select Location first)</label></>}
            >
              <OrganizationDropdown
                orgs={getOrganizations}
                city={city}
                setOrgo={setOrgo}
              />
            </Form.Item>

            <Form.Item
              name="Types of Volunteers Needed"
              label="Types of Volunteers Needed"
            >
              <Input />
              <VolunteerType setVolunteer={setVolunteer} />
            </Form.Item>

            <Form.Item
              name="Contact Information and Cancellation Policy"
              label="Contact Information and Cancellation Policy"
            >
              <Input />
            </Form.Item>

            <Form.Item name="Website Link" label="Website Link">
              <Input />
            </Form.Item>

            <Form.Item name="Sign-up Link" label="Sign-up Link">
              <Input />
            </Form.Item>

            <Form.Item
              name="Parking and Directions"
              label="Parking and Directions"
            >
              <Input />
            </Form.Item>

            <Form.Item name="Provider Information" label="Provider Information">
              <Input />
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
              <Input />
            </Form.Item>

            <Form.Item name="Clinic Schedule" label="Clinic Schedule">
              <Input />
            </Form.Item>

            <Form.Item
              name="HS Grad Student Information"
              label="HS Grad Student Information"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="Project Specific Training"
              label="Project Specific Training"
            >
              <Input />
            </Form.Item>

            <Form.Item name="Services Provided" label="Services Provided">
              <Input />
            </Form.Item>

            <Form.Item name="Tips and Reminders" label="Tips and Reminders">
              <Input />
            </Form.Item>

            <Form.Item
              name="Undergraduate Information"
              label="Undergraduate Information"
            >
              <Input />
            </Form.Item>

            <Form.Item name="DateObject" label="Date/Time">
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
                            <Select style={{ width: 120 }} onChange={ (v: any)=> setInterval(v)}>
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
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onOk={ (v: any)=> setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
                            </Space>
                        </TabPane>
                        <TabPane tab="Weekly" key="2">
                            <Checkbox.Group options={weekdayOptions} onChange={(v: any) => setWeekday(v)}/>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
                            </Space>
                        </TabPane>
                        <TabPane tab="Monthly" key="3">
                            Month day:
                            <Checkbox.Group options={monthdayOptions} onChange={(v: any) => setMonthday(v)}/>
                            <br />
                            <br />
                            <Space>
                            Recurrence End Date:
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>
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
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onOk={(v: any) => setRecEndDate(v.format('YYYYMMDD[T]HHmmss[Z]'))}/>

                            </Space>
                        </TabPane>
                    </Tabs>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item name="VolunteerType" label="Volunteer Type" >
                    <Input onChange={ (v: any)=>{console.log(interval); } }/>
                </Form.Item>
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
                        {/*
                <Form.List name="recurrences">
                    {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field) => (
                      if (values.recurrences.recEndDate) {
            let rec = [];
            switch(values.Recurrence.tabNum) {
                case "1":
                    rec.push(`RRULE:FREQ=DAILY;INTERVAL=${values.Recurrence.interval};UNTIL=${values.Recurrence.recEndDate}`);
                    break;
                case "2":
                    rec.push(`RRULE:FREQ=WEEKLY;BYDAY=${values.Recurrence.weekday};UNTIL=${values.Recurrence.recEndDate}`);
                    break;
                case "3":
                    rec.push(`RRULE:FREQ=MONTHLY;BYMONTHDAY=${values.Recurrence.monthday};UNTIL=${values.Recurrence.recEndDate}`);
                    break;
                case "4":
                    rec.push(`RRULE:FREQ=YEARLY;BYMONTH=${values.Recurrence.month};BYMONTHDAY=${values.Recurrence.monthday};UNTIL=${values.Recurrence.recEndDate}`);
                    break;
                default:
                    break;
           <Form.Item
                            required={false}
                            key={field.key}
                            label="test"
                        >
                            <Form.Item
                            
                            >
                            <Tabs>

                            </Tabs>
                            </Form.Item>
                            <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                            />
                        </Form.Item>
                        ))}
                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                        */}
                <Form.List name="users">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                               onthly
                            <Form.Item
                                        {...restField}
                                        name={[name, 'detailKey']}
                                        fieldKey={[fieldKey, 'detailKey']}
                                        rules={[{ required: true, message: 'Missing detail name' }]}
                                    >
                                        <Input placeholder="Detail Name (i.e. Parking Directions)" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'detailValue']}
                                        fieldKey={[fieldKey, 'detailValue']}
                                        rules={[{ required: true, message: 'Missing detail value' }]}
                                    >
                                        <Input placeholder="Detail Value (i.e. Park at level 2)" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item name="Field Ordering" label="Field Ordering" >
                    {/* <Ordering /> */}
                </Form.Item>
                {/* <Form.Item name="Field Ordering" label="Field Ordering" >
                    <Input onChange={(v: any) => console.log(orgo) }/>
                </Form.Item> */}

            </Col>
            </Row>
            </Form>
        </Modal>
    );
};

const CollectionsPage = () => {
    const [visible, setVisible] = useState(false);
    const DOMAIN = "http:" + '//' + "localhost:3000";
    const calendarApiPath = '/api/put-calendar-event';
    const eventApiPath = '/api/put-event-data';

    const onCreate = (values) => {
        const rangeTimeValue = values['DateObject'];
        // console.log('Received values of form: ', values);


        let startTime = rangeTimeValue[0].toISOString();
        let endTime = rangeTimeValue[1].toISOString();
        console.log(startTime);
        console.log(endTime);

        const calEvent: CalendarEventData = {
            Name: values.Name,
            Description: values.Description,
            Organization: values.Organization,
            Location: values.Location,
            StartDate: startTime,
            EndDate: endTime,
            Timezone: "GMT"
        }
       
        let rec = [];
        for (let i of values.recurrences) {
            if (i !== undefined && i.recEndDate) {
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
            calEvent.Recurrence = rec;
        }

        const firestoreEvent: CalendarEventData = {}
        Object.keys(values).forEach((element) => {
            if (element != "Recurrence" && element != "DateObject" && element != "addNewFields" && element != "Organization") {
                firestoreEvent[element] = values[element];
            }
            if (element == "addNewFields" && values[element] != null) {
                values[element].forEach(newField => {
                        firestoreEvent[newField.detailKey] = newField.detailValue;
                    })
            }
            if (element == "Organization") {
                firestoreEvent[element] = values.Recurrence["orgo"];
            }
        });

        Promise.all([
            fetch(DOMAIN + calendarApiPath, {
                method: 'POST',
                body: JSON.stringify({ eventData: calEvent }),
            }),
            fetch(DOMAIN + eventApiPath, {
                method: 'POST',
                body: JSON.stringify({ eventData: calEvent }),
            })
        ]).then((res: any) => {
              }}
            >
              <Tabs defaultActiveKey="1" onChange={(v: any) => setTabNum(v)}>
                <TabPane tab="Daily" key="1">
                  <Space>
                    Reapeat Every
                    <Select
                      style={{ width: 120 }}
                      onChange={(v: any) => setInterval(v)}
                    >
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
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onOk={(v: any) =>
                        setRecEndDate(v.format("YYYYMMDD[T]HHmmss[Z]"))
                      }
                    />
                  </Space>
                </TabPane>
                <TabPane tab="Weekly" key="2">
                  <Checkbox.Group
                    options={weekdayOptions}
                    onChange={(v: any) => setWeekday(v)}
                  />
                  <br />
                  <br />
                  <Space>
                    Recurrence End Date:
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onOk={(v: any) =>
                        setRecEndDate(v.format("YYYYMMDD[T]HHmmss[Z]"))
                      }
                    />
                  </Space>
                </TabPane>
                <TabPane tab="Monthly" key="3">
                  Month day:
                  <Checkbox.Group
                    options={monthdayOptions}
                    onChange={(v: any) => setMonthday(v)}
                  />
                  <br />
                  <br />
                  <Space>
                    Recurrence End Date:
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onOk={(v: any) =>
                        setRecEndDate(v.format("YYYYMMDD[T]HHmmss[Z]"))
                      }
                    />
                  </Space>
                </TabPane>
                <TabPane tab="Yearly" key="4">
                  Month:
                  <Checkbox.Group
                    options={monthOptions}
                    onChange={(v: any) => setMonth(v)}
                  />
                  <br />
                  <br />
                  Month day:
                  <Checkbox.Group
                    options={monthdayOptions}
                    onChange={(v: any) => setMonthday(v)}
                  />
                  <br />
                  <br />
                  <Space>
                    Recurrence End Date:
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      onOk={(v: any) =>
                        setRecEndDate(v.format("YYYYMMDD[T]HHmmss[Z]"))
                      }
                    />
                  </Space>
                </TabPane>
              </Tabs>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
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
        element != "Organization"
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
      }
    });
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
        onClick={() => {
          setVisible(true);
        }}
      >
        Add Event
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

class EventForm extends React.Component {
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

    return <CollectionsPage />;
  }
}

export default EventForm;
