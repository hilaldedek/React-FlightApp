import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input } from 'antd';

const Login = () => {
  return (
    <div className='m-16'>
      <h1 className='text-4xl m-6'>Login</h1>
      <div className='flex flex-col justify-center items-center gap-4'>
        <Input size="large" placeholder="Username" className='w-72' prefix={<UserOutlined />} />
      <Input.Password size="large" className='w-72'
        placeholder="Password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Button className='w-32'>Login</Button>
      </div>
        
      <div className='mt-4'>
        <span>If you don't have an account <a href="/register" className='text-lime-600'>Sign up!</a></span>
      </div>
    </div>
  )
}

export default Login