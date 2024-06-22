import React, { useEffect, useState } from 'react';
import { Card, Button, Empty, Spin, Dropdown, Menu, Slider, Radio, Form, Row, Col } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RiseOutlined } from '@ant-design/icons';

const Result = () => {
  const [responseLength, setResponseLength] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDuration, setMaxDuration] = useState(10);
  const [flightType, setFlightType] = useState('all'); // 'all', 'direct', 'connecting'
  const navigate = useNavigate();
  const location = useLocation();
  const { from, to, departureDate, selectedCompanies } = location.state || {};
  let filteredArray=[]

  const handleFlightSearch = async () => {
    try {
        const response = await axios.post('http://localhost:5000/flight-result', {
                where: from,
                to: to,
                departure: departureDate,
                company: selectedCompanies[0],
        });
        if (response.status === 200) {
            setResponseLength(response.data.flights.length);
            setResults(response.data.flights);
            setFilteredResults(response.data.flights);
            console.log(response.data.flights);
        } else {
            toast.error('Flights not found.');
            setResults([]);
            setFilteredResults([]);
        }
    } catch (error) {
        toast.error('An error occurred while searching flights.');
        console.error(error);
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
    if (flightType!="all"){
      flightType=="direct" ? filteredArray.push({"type":"Direct"}) : filteredArray.push({"type":"Connecting Flight"})
      }
    else{
      filteredArray.push({})
    }
    maxPrice>0 ? filteredArray.push({"price":maxPrice}) : filteredArray.push({})
    
    maxDuration>0 ? filteredArray.push({"duration":maxDuration}) : filteredArray.push({})
    console.log("Filtered array: ",filteredArray)
    console.log(from,to,departureDate)
    try {
      const response = await axios.post('http://localhost:5000//filter-flight', {
              where: from,
              to: to,
              departure: departureDate,
              filteredArray:filteredArray
      });
      if (response.status === 200) {
          console.log("HELÜÜÜÜ",response.data);
          filteredArray=[];

      } else {
          toast.error('Flights not found.');
          filteredArray=[];
      }
  } catch (error) {
      toast.error('An error occurred while searching flights.');
      console.error(error);
  } finally {
      setLoading(false);
  }
  filteredArray=[];
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="direct">
        Aktarmalı/Aktarmasız Uçuş
      </Menu.Item>
      <Menu.Item key="price">
        Fiyat
      </Menu.Item>
      <Menu.Item key="duration">
        Uçuş Süresi
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button><RiseOutlined />Sort By</Button>
      </Dropdown>
      
      <Form layout="vertical" className='mt-4 mx-16'>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Max Price">
              <Slider 
                max={10000} 
                onChange={value => setMaxPrice(value)} 
                value={maxPrice} 
                tooltipVisible 
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Max Duration (hours)">
              <Slider 
                max={24} 
                onChange={value => setMaxDuration(value)} 
                value={maxDuration} 
                tooltipVisible 
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Flight Type">
              <Radio.Group 
                onChange={e => setFlightType(e.target.value)} 
                value={flightType}
              >
                <Radio value="all">Tüm Uçuşlar</Radio>
                <Radio value="direct">Aktarmasız Uçuş</Radio>
                <Radio value="connecting">Aktarmalı Uçuş</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" onClick={handleFilter}>
          Filter
        </Button>
      </Form>
      
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
  );
};

export default Result;
