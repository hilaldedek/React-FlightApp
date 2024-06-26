import React, { useState } from 'react';
import { Button, List, Transfer, Alert, ConfigProvider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import fromToImg from "../../assets/destination.png";
import durationImg from "../../assets/clock.png";
import departureImg from "../../assets/calendar.png";
import companyImg from "../../assets/airport.png";
import moneyImg from "../../assets/wallet.png";
import { ToastContainer, toast } from 'react-toastify';
import Marquee from 'react-fast-marquee';

const FlightDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flightDetails = location.state;
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [disabled, setDisabled] = useState(false);
  let totalPrice = 0;
  const emptySeat = flightDetails.empty;
  const handlePayButtonClick = () => {
    
    if (targetKeys.length === 0) {
      toast.warn('Please select seat.');
    } else {
      handleSelect();
    }
  };

  const data = [
    {
      icon: fromToImg,
      title: `${flightDetails.where} > ${flightDetails.to}`,
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
    {
      icon: moneyImg,
      title: (
        <div>
          {flightDetails.directPrice > 0 ? (
            <div>Direct: {flightDetails.directPrice}$</div>
          ) : ""}
          <div>Business Class: {flightDetails.businessClassPrice}$</div>
          <div>Economic Class: {flightDetails.economicClassPrice}$</div>
        </div>
      ),
    },
  ];

  const mockData = emptySeat.map((seat, i) => ({
    key: seat,
    title: seat,
  }));

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  
  const handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  const handleDisable = (checked) => {
    setDisabled(checked);
  };

  const handleSelect = async () => {
    const payData = [targetKeys, flightDetails];
    navigate("/payment", { state: payData });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A8CD9F',
          borderRadius: 8,
        },
        components: {
          Button: {
            colorPrimary: '#A8CD9F',
            colorPrimaryHover: '#85b382',
            colorPrimaryActive: '#6a966a',
          },
          Transfer: {
            colorPrimary: '#A8CD9F',
          },
        },
      }}
    >
      <div className='mt-12 flex flex-wrap justify-center '>
        <div className='mx-auto'>
          <List className='w-72 mx-auto mt-12'
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <img src={item.icon} alt="" className='w-12' />
                <List.Item.Meta
                  title={item.title}
                />
              </List.Item>
            )}
          />
        <ToastContainer />
        </div>
        {localStorage.getItem("token") && localStorage.getItem("userStatus") === "Customer" ? (
          <div>
            <Alert className='w-2/5 mt-12 mx-auto'
              banner
              message={
                <Marquee pauseOnHover gradient={false}>
                  The first 3 seats are reserved for Business Class. (Seat1, Seat2, Seat3)
                </Marquee>
              }
            />
            <Transfer
              dataSource={mockData}
              titles={['Empty Seats', 'Selected Seats']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              onScroll={handleScroll}
              render={(item) => item.title}
              disabled={disabled}
              oneWay
              className='mt-16 flex justify-center'
            />
            <Button type="primary" className='w-32 m-auto my-12' onClick={handlePayButtonClick}>
              Pay
            </Button>
          </div>
        ) : ""}
      </div>
    </ConfigProvider>
  );
}

export default FlightDetail;
