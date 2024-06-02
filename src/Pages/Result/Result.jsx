import React, { useEffect, useState } from 'react';
import { Card, Button, Empty } from "antd";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import resultJson from "./results.json";

const Result = () => {
  const navigate=useNavigate();
  const location = useLocation();
  const { from, to, departureDate, selectedCompanies } = location.state || {};
  console.log(from, to, departureDate, selectedCompanies);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let filteredResults = resultJson;

    if (from && to && departureDate) {
      filteredResults = filteredResults.filter(result => 
        result.from === from &&
        result.to === to &&
        new Date(result.departure).toISOString().split('T')[0] === departureDate
      );
    }

    if (from && to && departureDate && selectedCompanies && selectedCompanies.length > 0) {
      filteredResults = filteredResults.filter(result =>
        selectedCompanies.includes(result.company)
      );
    }

    setResults(filteredResults);
  }, [from, to, departureDate, selectedCompanies]);

  
  return (
    <div className='flex flex-wrap mt-16 gap-4 justify-center items-center'>
      {results.length > 0 ? (
        results.map(result => (
          <Card key={result.key} title={`${result.from} > ${result.to}`} style={{ width: 300, marginBottom: 20 }}>
            <p>Departure: {result.departure}</p>
            <p>Company: {result.company}</p>
            <p>{result.type}</p>
            <Button type="primary" className='mt-4' onClick={()=>{navigate(`/flight-detail/${result.from}/${result.to}/${result.company}`, { state: result })}}>
              Detail
            </Button>
          </Card>
        ))
      ) : (
        <Empty description="No Data Found" />
      )}
    </div>
  )
}

export default Result;
