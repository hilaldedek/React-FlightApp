import React, { useEffect, useState } from 'react';
import { Card, Button, Empty, Spin, Dropdown, Menu, Slider, Radio, Form } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RiseOutlined, FilterOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';

const Result = () => {
  const [responseLength, setResponseLength] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDuration, setMaxDuration] = useState(10);
  const [flightType, setFlightType] = useState('all'); // 'all', 'direct', 'connecting'
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { from, to, departureDate, selectedCompanies } = location.state || {};
  let filteredArray = [];

  const handleFlightSearch = async () => {
    try {
        const response = await axios.post('http://localhost:5000/flight-result', {
            where: from,
            to: to,
            departure: departureDate,
            company: selectedCompanies,
        });
        if (response.status === 200) {
            setResponseLength(response.data.flights.length);
            setResults(response.data.flights);
            setFilteredResults(response.data.flights);
        } else {
            toast.error('Flights not found.');
            setResults([]);
            setFilteredResults([]);
        }
    } catch (error) {
        toast.error('An error occurred while searching flights.');
        setResults([]);
        setFilteredResults([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    handleFlightSearch();
  }, []);

  const handleMenuClick = (e) => {
    let sortedResults;
    switch (e.key) {
      case 'direct':
        sortedResults = [...filteredResults].sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'price':
        sortedResults = [...filteredResults].sort((a, b) => a.economicClassPrice - b.economicClassPrice);
        break;
      case 'duration':
        sortedResults = [...filteredResults].sort((a, b) => a.duration - b.duration);
        break;
      default:
        sortedResults = filteredResults;
    }
    setFilteredResults(sortedResults);
  };

  const handleFilter = async() => {
    if (flightType !== "all") {
      flightType === "direct" ? filteredArray.push({ "type": "Direct" }) : filteredArray.push({ "type": "Connecting Flight" });
    } else {
      filteredArray.push({});
    }
    maxPrice > 0 ? filteredArray.push({ "price": maxPrice }) : filteredArray.push({});
    maxDuration > 0 ? filteredArray.push({ "duration": maxDuration }) : filteredArray.push({});

    try {
      const response = await axios.post('http://localhost:5000/filter-flight', {
        where: from,
        to: to,
        departure: departureDate,
        filteredArray: filteredArray
      });
      if (response.status === 200) {
        setFilteredResults(response.data.flights);
      } else {
        toast.error('Flights not found.');
      }
    } catch (error) {
      toast.error('An error occurred while searching flights.');
    } finally {
      setLoading(false);
    }
    filteredArray = [];
  };

  const sortMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="direct">
      Connecting/Direct Flight
      </Menu.Item>
      <Menu.Item key="price">
        Price
      </Menu.Item>
      <Menu.Item key="duration">
        Duration
      </Menu.Item>
    </Menu>
  );

  const filterMenu = (
    <Menu>
      <Menu.Item key="priceFilter">
        <Form.Item label="Max Price">
          <Slider 
            max={10000} 
            onChange={value => setMaxPrice(value)} 
            value={maxPrice} 
            tooltipVisible={tooltipVisible} 
            onAfterChange={() => setTooltipVisible(false)}
            onBeforeChange={() => setTooltipVisible(true)} 
          />
        </Form.Item>
      </Menu.Item>
      <Menu.Item key="durationFilter">
        <Form.Item label="Max Duration (hours)">
          <Slider 
            max={24} 
            onChange={value => setMaxDuration(value)} 
            value={maxDuration} 
            tooltipVisible={tooltipVisible} 
            onAfterChange={() => setTooltipVisible(false)}
            onBeforeChange={() => setTooltipVisible(true)}
          />
        </Form.Item>
      </Menu.Item>
      <Menu.Item key="typeFilter">
        <Form.Item label="Flight Type">
          <Radio.Group 
            onChange={e => setFlightType(e.target.value)} 
            value={flightType}
          >
            <Radio value="all">All Flights</Radio>
            <Radio value="direct">Direct Flight</Radio>
            <Radio value="connecting">Connecting Flight</Radio>
          </Radio.Group>
        </Form.Item>
      </Menu.Item>
      <Menu.Item key="applyFilter">
        <Button type="primary"  onClick={handleFilter}>
          Filter
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A8CD9F',
          borderRadius: 8,
        },
        components: {
          Button: {
            colorPrimary: '#a8cd9fb4',
            colorPrimaryHover: '#85b382',
            colorPrimaryActive: '#6a966a',
          },
          Spin: {
            colorPrimary: '#A8CD9F',
          },
        },
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
          <Dropdown overlay={sortMenu} placement="bottom" className='m-6'>
            <Button><RiseOutlined /> Sort</Button>
          </Dropdown>
          <Dropdown overlay={filterMenu} placement="bottom" className='m-6' onVisibleChange={visible => setTooltipVisible(visible)}>
            <Button><FilterOutlined />Filter</Button>
          </Dropdown>
        </div>

        <div className='flex flex-wrap mt-16 gap-4 justify-center items-center'>
          {loading ? (
            <Spin size="large" />
          ) : (
            responseLength > 0 ? (
              filteredResults.map(result => (
                <Card key={result._id} title={`${result.where} > ${result.to}`} style={{ width: 300, marginBottom: 20 }}>
                  <p>Departure: {result.departure}</p>
                  <p>Company: {result.company}</p>
                  <p>{result.type}</p>
                  <Button type="primary" className='mt-4' onClick={() => navigate(`/flight-detail/${result.where}/${result.to}/${result.company}`, { state: result })}>
                    Detail
                  </Button>
                </Card>
              ))
            ) : (
              <Empty description="No Data Found" />
            )
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Result;
