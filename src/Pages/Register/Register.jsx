import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input } from 'antd';

const Login = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-4 m-16'>
      <h1 className='text-4xl m-4'>Register</h1>
        <Input size="large" placeholder="Username" className='w-72' prefix={<UserOutlined />} />
        <Input placeholder="Email" size="large" className='w-72'/>
      <Input.Password size="large" className='w-72'
        placeholder="Password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Button className='w-32'>Register</Button>
      
    </div>
  )
}

export default Login