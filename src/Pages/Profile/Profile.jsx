import React, { useEffect, useState } from 'react'
import { Table, Typography } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';

const { Text, Link } = Typography;

const Profile = () => {
    const username = localStorage.getItem("name");
    const [ticketsArray, setTicketsArray] = useState([]);
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
            title: 'Company',
            key: 'company',
            dataIndex: 'company',
        },
        {
            title: 'Seats',
            key: 'seats',
            dataIndex: 'seat',
            render: (seats) => seats.join(', '),
        },
    ];

    const handleTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/tickets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setTicketsArray(response.data.tickets);
            } else {
                toast.error('Tickets not found.');
            }
        } catch (error) {
            toast.error('An error occurred while searching tickets.');
            console.error(error);
        }
    };

    useEffect(() => {
        handleTickets();
    }, []);

    return (
        <div>
            <h1 className='mt-16 right-0 text-5xl font-sevillana'>Welcome {username}!</h1>
            <div>
                <h1 className='m-24 text-3xl font-sevillana' style={{color:"#556d43"}}>Your Tickets</h1>
                <div className='mt-16 mx-12'>
                    <Table
                        columns={columns}
                        dataSource={ticketsArray.map((ticket, index) => ({ ...ticket, key: ticket._id || index }))}
                        rowKey="key"
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile
