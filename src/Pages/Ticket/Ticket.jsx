import React from 'react'
import { Card } from 'antd';

const Ticket = () => {
  return (
    <div className='mt-16 flex flex-wrap justify-center'>
        <Card title="Card title" bordered={false} style={{ width: 300 }}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
    </div>
  )
}

export default Ticket