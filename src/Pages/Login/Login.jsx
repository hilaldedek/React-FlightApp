import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Segmented } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status,setStatus]=useState('');
  console.log("STATUS: ",status);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("STATUS: ",status);
      const response = await axios.post('http://localhost:5000/user/auth/login', {
        username,
        password,
        status
      });
      if (response.data.status === 200) {
        toast.success('Login successfully.');
        localStorage.setItem("name",username);
        localStorage.setItem("token",response.data.tokens["access token"]);
        navigate("/")
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid username, password or status.');
    }
  };
  return (
    <div className='m-16'>
      <h1 className='text-4xl m-6'>Login</h1>
      <Segmented options={["Customer", "Company"]} block value={status} onChange={(value) => setStatus(value)}/>
      <div className='flex flex-col justify-center items-center gap-4'>
        <Input size="large" placeholder= {status=="Customer" ? "Username" : "Company Name"} className='w-72' prefix={<UserOutlined />} value={username}
        onChange={(e) => setUsername(e.target.value)}/>
      <Input.Password size="large" className='w-72'
        placeholder= {status=="Customer" ? "Password" : "Company Password"} value={password}
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
  )
}

export default Login