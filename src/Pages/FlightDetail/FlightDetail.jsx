import React , { useState }from 'react'
import { Radio,Button } from 'antd';
import { Link } from 'react-router-dom';

const FlightDetail = () => {
  const plainOptions = ['Business', 'Economic'];
  const [value1, setValue1] = useState('Apple');
  const onChange1 = ({ target: { value } }) => {
    console.log('radio1 checked', value);
    setValue1(value);
  };
  return (
    <div className='mt-16'>
      <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />
      <Button type="primary">
        <Link to="/payment">Pay</Link>
      </Button>
      
    </div>
  )
}

export default FlightDetail