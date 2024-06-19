import React, { useEffect, useState } from 'react';
import { Card, Button, Empty } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Result = () => {
  const [responseLength,setResponseLength]=useState("")
  const navigate = useNavigate();
  const location = useLocation();
  const { from, to, departureDate, selectedCompanies } = location.state || {};
  const [results, setResults] = useState([]);

  const handleFlightSearch = async () => {
    try {
        const response = await axios.post('http://localhost:5000/flight-result', {
                where: from,
                to: to,
                departure: departureDate,
                company: selectedCompanies[0],
        });
        console.log(response.status)
        console.log("RESPONSE LEngth: ",response.data.flights.length)
        console.log("response : ",response.data.flights[0])
        
        if (response.status === 200) {
            setResponseLength(response.data.flights.length)
            setResults(response.data.flights)
            console.log(results)
        } else {
            toast.error('Flights not found.');
            setResults([]);
        }
    } catch (error) {
        toast.error('An error occurred while searching flights.');
        console.error(error);
        setResults([]);
    }
};

useEffect(() => {
  handleFlightSearch();
}, []);
    
 

  return (
    <div className='flex flex-wrap mt-16 gap-4 justify-center items-center'>
      {responseLength> 0 ? (
        results.map(result => (
          <Card key={result._id} title={`${result.where} > ${result.to}`} style={{ width: 300, marginBottom: 20 }}>
            <p>Departure: {result.departure}</p>
            <p>Company: {result.company}</p>
            <p>{result.type}</p>
            <Button type="primary" className='mt-4' onClick={() => navigate(`/flight-detail/${result.where}/${result.to}/${result.company}`, { state: result })}>
              Detail
            </Button>
          </Card>
        ))
      ) : (
        <Empty description="No Data Found" />
      )}
    </div>
  );
};

export default Result;
