import React, { useState } from 'react';
import { Radio, Button, List } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';
import fromToImg from "../../assets/destination.png";
import durationImg from "../../assets/clock.png";
import departureImg from "../../assets/calendar.png";
import companyImg from "../../assets/airport.png";
import { ToastContainer, toast } from 'react-toastify';

const FlightDetail = () => {
  const location = useLocation();
  const navigate=useNavigate();
  const flightDetails = location.state;
  const [value1, setValue1] = useState('');
  let totalPrice = 0;

  const handlePayButtonClick = () => {
    if (!value1) {
      toast.warn('Please select seat type.');
    }
  else{
    navigate("/payment",{ state: totalPrice })
  }}
  const onChange1 = ({ target: { value } }) => {
    setValue1(value);
  };

  const plainOptions = [`Business: ${flightDetails.businessClassPrice}$`, `Economic: ${flightDetails.economicClassPrice}$`];

  
  
  if (value1 === plainOptions[0]) {
    totalPrice = flightDetails.businessClassPrice + flightDetails.directPrice;
  } else if(value1 === plainOptions[1]) {
    totalPrice = flightDetails.economicClassPrice + flightDetails.directPrice;
  }

  

  const data = [
    {
      icon: fromToImg,
      title: `${flightDetails.from} > ${flightDetails.to}`,
    },
    {
      icon: companyImg,
      title: flightDetails.company,
    },
    {
      icon: departureImg,
      title: flightDetails.departure,
    },
    {
      icon: durationImg,
      title: `${flightDetails.type} | ${flightDetails.duration} hours`,
    },
  ];

  return (
    <div className='mt-16'>
      <div>
        <List className='w-72 m-auto'
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <img src={item.icon} alt="" className='w-12'/>
              <List.Item.Meta
                title={item.title}
              />
            </List.Item>
          )}
        />
      </div>
      <div className='m-12 flex flex-col m-auto'>
        <h1 className='mt-6'>{flightDetails.directPrice > 0 ? `Direct Price: ${flightDetails.directPrice}$` : ""}</h1>
        <Radio.Group options={plainOptions} onChange={onChange1} value={value1} className='mt-6'/>
        <p className='m-6'>{totalPrice ? `Total Price: ${totalPrice}$`: ``}</p>
        <Button type="primary" className=' w-32 m-auto' onClick={handlePayButtonClick}>
          Pay
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FlightDetail;
