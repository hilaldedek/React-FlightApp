import React, { useState } from 'react'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Segmented, ConfigProvider } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/auth/login', {
        username,
        password,
        status
      });
      if (response.data.status === 200) {
        toast.success('Login successfully.');
        localStorage.setItem("name", username);
        localStorage.setItem("token", response.data.tokens["access token"]);
        localStorage.setItem("userStatus", response.data.userStatus);
        navigate("/")
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid username, password or status.');
    }
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
          Segmented: {
            colorPrimary: '#A8CD9F',
          },
        },
      }}
    >
      <div className='m-16'>
        <h1 className='text-4xl m-6 font-sevillana text-3xl'>Login</h1>
        <Segmented options={["Customer", "Company"]} block value={status} onChange={(value) => setStatus(value)} className="mb-8 w-96 m-auto" />
        <div className='flex flex-col justify-center items-center gap-4'>
          <Input size="large" placeholder={status === "Customer" ? "Username" : "Company Name"} className='w-72' prefix={<UserOutlined />} value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <Input.Password size="large" className='w-72'
            placeholder={status === "Customer" ? "Password" : "Company Password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          <Button className='w-32' onClick={handleLogin}>Login</Button>
        </div>
        <div className='mt-4'>
          <span>If you don't have an account <a href="/register" className='text-lime-600'>Sign up!</a></span>
        </div>
        <ToastContainer />
      </div>
    </ConfigProvider>
  )
}

export default Login;
