import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Form, Input, Radio, Col, Row, DatePicker, Select, Space, Tabs, Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { firebaseAdmin } from "../firebaseAdmin";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rangeConfig = {
    rules: [
        {
            type: 'array',
            required: true,
            message: 'Please select time!',
        },
    ],
};

interface Props {
    visible: any,
    onCreate: any,
    onCancel: any
}

const printOrganizations = async () => {
    let doc = await firebaseAdmin.firestore().collection('cache').doc('Alaska').get()
    console.log(doc.data())
}

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
                        setAdd(false);
                        setDel(false);
                        setCity(null);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Row gutter={[16, 16]}>
                <Col span={12}>
                <Form.Item
                    name="Name"
                    label="Event Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of the event!', //shows upon incompletion
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="Description" label="Description" rules={[
                    {
                        required: true,
                        message: 'Please input a description of the event!', //shows upon incompletion
                    },
                ]}>
                    <Input type="textarea" />
                </Form.Item>

                <Form.Item
                    name="Location"
                    label="Location"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the location of the event!', //shows upon incompletion
                        },
                    ]}
                >
                    <Select onChange={(v: any) => setCity(v)}>
                        <Select.Option value="Alaska">Alaska</Select.Option>
                        <Select.Option value="Idaho">Idaho</Select.Option>
                        <Select.Option value="Montana">Montana</Select.Option>
                        <Select.Option value="Seattle">Seattle</Select.Option>
                        <Select.Option value="Spokane">Spokane</Select.Option>
                        <Select.Option value="Wyoming">Wyoming</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="Organization"
                    label="Organization (select Location first)"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of the organization!', //shows upon incompletion
                        },
                    ]}
                >
                    <Input disabled={!form.getFieldValue('Location')} 
                    // onChange={printOrganizations}
                    />
                </Form.Item>

                <Form.Item name="TypesOfVolunteersNeeded" label="Types of Volunteers Needed" >
                    <Input />
                </Form.Item>

                <Form.Item name="ContactInformationAndCancellationPolicy" label="Contact Information and Cancellation Policy" >
                    <Input />
                </Form.Item>

                <Form.Item name="WebsiteLink" label="Website Link" >
                    <Input />
                </Form.Item>

                <Form.Item name="SignupLink" label="Sign-up Link" >
                    <Input />
                </Form.Item>

                <Form.Item name="ParkingAndDirections" label="Parking and Directions" >
                    <Input />
                </Form.Item>

                <Form.Item name="ProviderInformation" label="Provider Information" >
                    <Input />
                </Form.Item>

                </Col>
                <Col span={12}>

                <Form.Item name="ClinicFlow" label="Clinic Flow" >
                    <Input />
                </Form.Item>

                <Form.Item name="ClinicSchedule" label="Clinic Schedule" >
                    <Input />
                </Form.Item>

                <Form.Item name="HSGradStudentInformation" label="HS Grad Student Information" >
                    <Input />
                </Form.Item>

                <Form.Item name="ProjectSpecificTraining" label="Project Specific Training" >
                    <Input />
                </Form.Item>

                <Form.Item name="ServicesProvided" label="Services Provided" >
                    <Input />
                </Form.Item>

                <Form.Item name="TipsAndReminders" label="Tips and Reminders" >
                    <Input />
                </Form.Item>

                <Form.Item name="UndergraduateInformation" label="Undergraduate Information" >
                    <Input />
                </Form.Item>

                <Form.Item name="DateObject" label="Date/Time" >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.List name="recurrences" initialValue={[]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({name, key, ...restField}) => (
                    <Form.Item name={name} key={key} {...restField} label="Event Recurrence">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Daily" key="1">
                                <Space>
                                Reapeat Every
                                <Select style={{ width: 120 }} onChange={ (v: any)=> setInterval(v)}>
                                    <Select.Option value="1">1</Select.Option>
                                    <Select.Option value="2">2</Select.Option>
                                    <Select.Option value="3">3</Select.Option>
                                    <Select.Option value="4">4</Select.Option>:
￼
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

                {/* <Form.Item name="Field Ordering" label="Field Ordering" >
                    <Ordering />
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

    const onCreate = async (values) => {
        const rangeTimeValue = values['DateObject'];
        console.log('Received values of form: ', values);


        let startTime = null;
        let endTime = null;
        if (rangeTimeValue) {
            startTime = rangeTimeValue[0].toISOString();
            endTime = rangeTimeValue[1].toISOString();
        }

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

        const firestoreEvent: CalendarEventData = {
            Title: values.Name,
            ProjectDescription: values.Description,
            Location: values.Location,
            Organization: values.Organization,
            TypesOfVolunteersNeeded: values.TypesOfVolunteersNeeded,
            ClinicFlow: values.ClinicFlow,
            ClinicSchedule: values.ClinicSchedule,
            ContactInformationAndCancellationPolicy: values.ContactInformationAndCancellationPolicy,
            HSGradStudentInformation: values.HSGradStudentInformation,
            ParkingAndDirections: values.ParkingAndDirections,
            ProjectSpecificTraining: values.ProjectSpecificTraining,
            ProviderInformation: values.ProviderInformation,
            ServicesProvided: values.ServicesProvided,
            SignupLink: values.SignupLink,
            TipsAndReminders: values.TipsAndReminders,
            UndergraduateInformation: values.UndergraduateInformation,
            WebsiteLink: values.WebsiteLink
        }

        Promise.all([
            () => { 
                if (calEvent.StartDate) {
                    fetch(DOMAIN + calendarApiPath, {
                        method: 'POST',
                        body: JSON.stringify({ eventData: calEvent }),
                    })
                }
            },
            fetch(DOMAIN + eventApiPath, {
                method: 'POST',
                body: JSON.stringify({ eventData: firestoreEvent }),
            })
        ]).then((res: any) => {
            // Get a JSON object from each of the responses
            // return Promise.all(res.map((response: any) => {
            //     return response.json();
            // }));
        // }).then((data: any) => {
        //     // Log the data to the console
        //     // You would do something with both sets of data here
        //     console.log(data);
        }).catch((error) => {
            // if there's an error, log it
            console.log(error);
        });
        setVisible(false);
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

export default CollectionsPage;
