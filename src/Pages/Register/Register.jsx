import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Segmented, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status,setStatus]=useState('Müşteri');
  const navigate=useNavigate();

  const handleRegister = async () => {
    try {
      console.log("STATUS: ",status)
      const response = await axios.post('http://localhost:5000/user/auth/register', {
        username,
        email,
        password,
        status
      });
      if (response.data.status === "201") {
        message.success('User registration successfully.');
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred during registration.');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center gap-4 m-16'>
      <h1 className='text-4xl m-4'>Register</h1>
      <Segmented options={["Customer", "Company"]} block value={status} onChange={(value) => setStatus(value)} className="mb-8 w-96 m-auto"/>
      <Input
        size="large"
        placeholder= {status=="Customer" ? "Username" : "Company Name"}
        className='w-72'
        prefix={<UserOutlined />}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        size="large"
        placeholder= {status=="Customer" ? "Email" : "Company Email"}
        className='w-72'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input.Password
        size="large"
        className='w-72'
        placeholder= {status=="Customer" ? "Password" : "Company Password"}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className='w-32' onClick={handleRegister}>Register</Button>
    </div>
  )
}

export default Register;
