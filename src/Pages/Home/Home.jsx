import React, { useState, useEffect } from 'react';
import { Button, Steps, theme, Input, DatePicker, Select } from 'antd';
import { useNavigate } from 'react-router';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import companyData from './company.json';

const Home = () => {
  const onChange = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const [companies, setCompanies] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    setCompanies(companyData);
  }, []);

  const steps = [
    {
      title: 'From > To',
      content: () => (
        <>
          <div className='m-14 flex flex-row justify-center items-center'>
            <Input
              placeholder="From"
              className='w-72 m-2'
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <ArrowRightOutlined />
            <Input
              placeholder="To"
              className='w-72 m-2'
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      title: 'Departure',
      content: () => (
        <>
          <DatePicker className='w-72 m-14' onChange={onChange} />
        </>
      ),
    },
    {
      title: 'Company',
      content: () => (
        <div className='m-14'>
          <Select
            mode="multiple"
            allowClear
            className='w-72'
            placeholder="Please select"
            value={selectedCompanies}
            onChange={handleChange}
            options={companies.map(company => ({ value: company.companyName, label: company.companyName }))}
          />
        </div>
      ),
    },
  ];

  const handleChange = (value) => {
    setSelectedCompanies(value);
  };

  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current === 0 && (!from || !to)) {
      toast.warn('Please fill in the "From" and "To" fields.');
      return;
    }
    if (current === 1 && !departureDate) {
      toast.warn('Please fill in the "Departure Date" field.');
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    lineHeight: '50px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const handleDone = () => {
    const formData = {
      from,
      to,
      departureDate,
      selectedCompanies,
    };
    navigate('/result', { state: formData });
  };

  return (
    <>
      <div className='w-3/4 m-auto'>
        <Steps current={current} items={items} className='mt-16' />
        <div style={contentStyle}>{typeof steps[current].content === 'function' ? steps[current].content() : steps[current].content}</div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleDone}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
