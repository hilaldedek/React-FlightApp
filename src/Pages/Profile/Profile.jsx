import React from 'react'
import { Typography } from 'antd';

const { Text, Link } = Typography;

const Profile = () => {
    const username=localStorage.getItem("name");
  return (
    <div>
        <h1 className='mt-16 right-0 text-5xl font-sevillana'>Welcome {username}!</h1>
        <div>
            <h1 className='m-24 text-3xl font-sevillana'>Your Tickets</h1>
        </div>
    </div>
  )
}

export default Profile