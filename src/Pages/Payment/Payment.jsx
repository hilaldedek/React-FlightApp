import React, { useState } from 'react';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate=useNavigate();
  const priceDetails = location.state;
  const seat=priceDetails[0];
  const businessPrice=priceDetails[1];
  const economicPrice=priceDetails[2];
  const directPrice=priceDetails[3];
  console.log("PAYMENT DATA: ",priceDetails)
  const [modal, contextHolder] = Modal.useModal();
  console.log("SEAT: ",seat)
  
  const calculateTotalPrice = (seats, businessPrice, economicPrice, directPrice) => {
    let totalPrice = 0;
    seats.forEach(seat => {
      const seatNumber = parseInt(seat.split(' ')[1]);
      if (seatNumber >= 1 && seatNumber <= 3) {
        totalPrice += businessPrice + directPrice;
      } else {
        totalPrice += economicPrice + directPrice;
      }
    });
    return totalPrice;
  };

  const totalPrice = calculateTotalPrice(seat, businessPrice, economicPrice,directPrice);

  const handlePay=async()=>{
    try {
      const response = await axios.put('http://127.0.0.1:5000/select-seat', {
        _id: priceDetails[4],
        selected: seat
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        
      } else {
        toast.error('Failed to reserve seats.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response ? error.response.data.message : 'An error occurred');
    }
  }

  const confirmPayment = () => {
    modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Do you confirm the ${totalPrice}$ payment?`,
      okText: 'Okey',
      cancelText: 'Close',
      onOk: () => {
        handlePay()
        navigate("/ticket")
      },
    });
  };
  return (
    <div className='mt-16'>
      <div className="flex flex-col justify-around bg-gray-800 p-4 border border-white border-opacity-30 rounded-lg shadow-md max-w-xs mx-auto">
        <div className="flex flex-row items-center justify-between mb-3">
          <input className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2 mb-3 flex-grow" type="text" name="cardName" id="cardName" placeholder="Full Name" />
          <div className="flex items-center justify-center relative w-14 h-9 bg-gray-800 border border-white border-opacity-20 rounded-md">
            <svg className="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 48 48">
              <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
              <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
              <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <input className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2" type="text" name="cardNumber" id="cardNumber" placeholder="0000 0000 0000 0000" />
          <div className="flex flex-row justify-between">
            <input className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2" type="text" name="expiryDate" id="expiryDate" placeholder="MM/AA" />
            <input className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2" type="text" name="cvv" id="cvv" placeholder="CVV" />
          </div>
        </div>
      </div>
      <div className='mt-12 text-2xl'>{totalPrice}$</div>
      <div>
        <Space>
          <Button className='mt-8' onClick={confirmPayment}>Pay</Button>
        </Space>
      </div>
      {contextHolder}
    </div>
  );
}

export default Payment;
