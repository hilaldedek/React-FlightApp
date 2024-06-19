import { DeleteOutlined } from '@ant-design/icons';
import { Space, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Flights = () => {
    const [flightsArray, setFlightsArray] = useState([]);
  
    const columns = [
        {
          title: 'Where',
          dataIndex: 'where',
          key: 'where',
        },
        {
          title: 'To',
          dataIndex: 'to',
          key: 'to',
        },
        {
          title: 'Departure',
          dataIndex: 'departure',
          key: 'departure',
        },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
        },
        {
          title: 'Duration',
          key: 'duration',
          dataIndex: 'duration',
        },
        {
            title: '',
            key: 'delete',
            render: (_, record) => (
              <Space size="middle">
                <button onClick={() => handleFlightsDelete(record._id)}><DeleteOutlined /></button>
              </Space>
            ),
        },
    ];
  
    const handleFlights = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/flights', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.flights);
            if (response.status === 200) {
                setFlightsArray(response.data.flights);
            } else {
                toast.error('Flights not found.');
            }
        } catch (error) {
            toast.error('An error occurred while searching flights.');
            console.error(error);
        }
    };
  
    const handleFlightsDelete = async (flightId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete('http://localhost:5000/flights', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    _id: flightId,
                },
            });
            console.log(response.data);
            if (response.status === 200) {
                toast.success('Flight deleted successfully.');
                handleFlights();
            } else {
                toast.error('Flight could not be deleted.');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the flight.');
            console.error(error);
        }
    };
    
  
    useEffect(() => {
        handleFlights();
    }, []);
  
    return (
        <div className='mt-16 mx-12'>
            <Table columns={columns} dataSource={flightsArray} rowKey="_id" />
        </div>
    );
}

export default Flights;
