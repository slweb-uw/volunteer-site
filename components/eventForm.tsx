import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Modal, Form, Input, Radio, DatePicker, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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


const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();


  return (
    <Modal
      visible={visible}
      title="Create New Event"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
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
          name="Organization"
          label="Organization"
          rules={[
            {
              required: true,
              message: 'Please input the name of the organization!', //shows upon incompletion
            },
          ]}
        >
          <Input />
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
          <Select>
            <Select.Option value="Alaska">Alaska</Select.Option>
            <Select.Option value="Idaho">Idaho</Select.Option>
            <Select.Option value="Montana">Montana</Select.Option>
            <Select.Option value="Seattle">Seattle</Select.Option>
            <Select.Option value="Spokane">Spokane</Select.Option>
            <Select.Option value="Wyoming">Wyoming</Select.Option>
          </Select>        
        </Form.Item>

        <Form.Item name="DateObject" label="Date/Time" rules={[
            {
              required: true,
              message: 'Please input the date and time of the event!', //shows upon incompletion
            },
          ]} {...rangeConfig} >
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item
          name="Timezone"
          label="Timezone"
          rules={[
            {
              required: true,
              message: 'Please input the timezone of the event!', //shows upon incompletion
            },
          ]}
        >
          <Select>
            <Select.Option value="America/Los_Angeles">America/Los_Angeles</Select.Option>
            <Select.Option value="America/Anchorage">America/Anchorage</Select.Option>
            <Select.Option value="America/Juneau">America/Juneau</Select.Option>
            <Select.Option value="America/Sitka">America/Sitka</Select.Option>
            <Select.Option value="America/Yakutat">America/Yakutat</Select.Option>
            <Select.Option value="America/Nome">America/Nome</Select.Option>
            <Select.Option value="America/Adak">America/Adak</Select.Option>
            <Select.Option value="America/Metlakatla">America/Metlakatla</Select.Option>
            <Select.Option value="Pacific/Honolulu">Pacific/Honolulu</Select.Option>
            <Select.Option value="America/Phoenix">America/Phoenix</Select.Option>
            <Select.Option value="America/Boise">America/Boise</Select.Option>
            <Select.Option value="America/Denver">America/Denver</Select.Option>
            <Select.Option value="America/North_Dakota/Center">America/North_Dakota/Center</Select.Option>
            <Select.Option value="America/North_Dakota/New_Salem">America/North_Dakota/New_Salem</Select.Option>
            <Select.Option value="America/North_Dakota/Beulah">America/North_Dakota/Beulah</Select.Option>
            <Select.Option value="America/Menominee">America/Menominee</Select.Option>
            <Select.Option value="America/Indiana/Knox">America/Indiana/Knox</Select.Option>
            <Select.Option value="America/Indiana/Tell_City">America/Indiana/Tell_City</Select.Option>
            <Select.Option value="America/Chicago">America/Chicago</Select.Option>
            <Select.Option value="America/Indiana/Vevay">America/Indiana/Vevay</Select.Option>
            <Select.Option value="America/Indiana/Petersburg">America/Indiana/Petersburg</Select.Option>
            <Select.Option value="America/Indiana/Marengo">America/Indiana/Marengo</Select.Option>
            <Select.Option value="America/Indiana/Winamac">America/Indiana/Winamac</Select.Option>
            <Select.Option value="America/Indiana/Vincennes">America/Indiana/Vincennes</Select.Option>
            <Select.Option value="America/Indiana/Indianapolis">America/Indiana/Indianapolis</Select.Option>
            <Select.Option value="America/Kentucky/Monticello">America/Kentucky/Monticello</Select.Option>
            <Select.Option value="America/Kentucky/Louisville">America/Kentucky/Louisville</Select.Option>
            <Select.Option value="America/Detroit">America/Detroit</Select.Option>
            <Select.Option value="America/New_York">America/New_York</Select.Option>
          </Select>        
        </Form.Item>

        <Form.Item name="Recurrence" label="Event Recurrence" >
          <Input /> {/*TODO: find out what this needs to take form of */}
        </Form.Item>

        <Form.Item name="VolunteerType" label="Volunteer Type" >
          <Input />
        </Form.Item>

        <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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

      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);
  const DOMAIN = "http:" + '//' + "localhost:3000";
  const calendarApiPath = '/api/put-calendar-event';
  
  const onCreate = (values) => {
    const rangeTimeValue = values['DateObject'];
    const dateValue = {
      ...values,
      'DateObject': [
        rangeTimeValue[0].format('YYYY-MM-DDTHH:mm:ss'),
        rangeTimeValue[1].format('YYYY-MM-DDTHH:mm:ss'),
      ]
    };

    console.log('Received values of form: ', values);
    console.log('YURRRR: ', dateValue);

    
    let startTime = dateValue.DateObject[0] + 'Z';
    let endTime = dateValue.DateObject[1] + 'Z';
    console.log(startTime);
    console.log(endTime);
    
    const calEvent: CalendarEventData = {
        Name: values.Name,
        Description: values.Description,
        Organization: values.Organization,
        Location: values.Location,
        StartDate: startTime,
        EndDate: endTime,
        Timezone: values.Timezone
    }
    fetch(DOMAIN + calendarApiPath, {
        method: 'POST',
        body: JSON.stringify({ eventData: calEvent }),
    })
        .then(
            (res: any) => {
                // setIsLoaded(true); may needed later
                console.log("Calendar updated success.");
            },
            (error) => {
                // setIsLoaded(true);
                console.log(error.message);
            }
        )
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