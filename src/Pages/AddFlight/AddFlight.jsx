import React, { useState } from 'react'
import {
    Button,
    DatePicker,
    Form,
    Input,
    Radio,
    message,
} from 'antd';
import axios from 'axios';
import moment from 'moment';

const AddFlight = () => {
    const [flightType, setFlightType] = useState("")
    const [where, setWhere] = useState('');
    const [to, setTo] = useState('');
    const [departure, setDeparture] = useState('');
    const [duration, setDuration] = useState('');
    const [economicClassPrice, setEconomicClassPrice] = useState('');
    const [bussinessClassPrice, setBussinessClassPrice] = useState('');
    const [directPrice, setDirectPrice] = useState('');
    const company = localStorage.getItem("name");

    const handleAddFlight = async () => {
      try {
        if (flightType === "Connecting Flight") {
          setDirectPrice(0)
        }            
        const response = await axios.post('http://localhost:5000/add-flight', {
          where,
          to,
          departure,
          duration: parseInt(duration),
          economicClassPrice: parseInt(economicClassPrice),
          bussinessClassPrice: parseInt(bussinessClassPrice),
          directPrice: parseInt(directPrice) || 0,
          company,
          flightType
        });
        console.log(response.data)
        if (response.data.status === "201") {
          message.success('New Flight added successfully.');
          // navigate("/login");
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        message.error('An error occurred during add flight.');
      }
    };

    return (
      <div className='mt-16 flex justify-center items-center'>
        <Form
          labelCol={{
            span: 8,
          }}
        >
          <Form.Item label="Where">
            <Input value={where} onChange={(e) => setWhere(e.target.value)} />
          </Form.Item>
          <Form.Item label="To">
            <Input value={to} onChange={(e) => setTo(e.target.value)} />
          </Form.Item>
          <Form.Item label="Company">
            <Input disabled placeholder={localStorage.getItem("name")} />
          </Form.Item>
          <Form.Item label="Departure">
            <DatePicker value={departure ? moment(departure) : null}
              onChange={(date, dateString) => setDeparture(dateString)}
              showTime />
          </Form.Item>
          <Form.Item label="Duration">
            <Input addonAfter="hours" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </Form.Item>
          <Form.Item label="Economic Class">
            <Input addonAfter="$" value={economicClassPrice} onChange={(e) => setEconomicClassPrice(e.target.value)} />
          </Form.Item>
          <Form.Item label="Bussiness Class">
            <Input addonAfter="$" value={bussinessClassPrice} onChange={(e) => setBussinessClassPrice(e.target.value)} />
          </Form.Item>
          <Radio.Group name="radiogroup" defaultValue={1} onChange={(e) => { setFlightType(e.target.value) }}>
            <Radio value={"Direct"}>Direct</Radio>
            <Radio value={"Connecting Flight"}>Connecting Flight</Radio>
          </Radio.Group>
          {
            flightType === "Direct" ?
              <Form.Item label="Direct Price">
                <Input addonAfter="$" value={directPrice} onChange={(e) => setDirectPrice(e.target.value)} />
              </Form.Item>
              : ""
          }
          <Form.Item>
            <Button onClick={handleAddFlight}>Add</Button>
          </Form.Item>
        </Form>
      </div>
    );
}

export default AddFlight
