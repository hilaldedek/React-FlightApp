import React, { useEffect, useState } from 'react';
import { Card, Button } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import resultJson from "./results.json";

const Result = () => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    setResults(resultJson);
  }, []);
  
  return (
    <div className='flex flex-wrap mt-16 gap-4 justify-center items-center'>
      {results.map(result => (
        <Card key={result.key} title={`${result.from} > ${result.to}`} style={{ width: 300, marginBottom: 20 }}>
          <p>Departure: {result.departure}</p>
          <p>Company: {result.company}</p>
          <Button type="primary" className='mt-4'><Link to={`/flight-detail/${result.from}/${result.to}/${result.company}`}>Detail</Link> </Button>
        </Card>
      ))}
    </div>
  )
}

export default Result
