
import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Customer, CustomerResponse } from '../types'; 
import LoadingIndicator from '../components/LoadingIndicator'; 
import ErrorMessage from '../components/ErrorMessage'; 
import CustomerGrid from '../components/CustomerGrid'; 

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch('/api/customers') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: CustomerResponse) => {
        if (data && data._embedded && Array.isArray(data._embedded.customers)) {
          setCustomers(data._embedded.customers);
        } else {
          throw new Error('Invalid data structure received');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching customer data');
        setLoading(false);
        console.error('Error fetching API:', err);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 150 },
    { field: 'streetaddress', headerName: 'Address', width: 200 },
    { field: 'postcode', headerName: 'Postcode', width: 120 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
  ];

  const rows = customers.map((customer) => {
    try {
      const urlParts = customer._links.self.href.split('/');
      const id = urlParts[urlParts.length - 1]; 
      
      return {
        id,
        ...customer
      };
    } catch (err) {
      console.error('Error extracting ID:', err);

      return {
        id: crypto.randomUUID(), 
        ...customer
      };
    }
  });

  if (loading) {
    return <LoadingIndicator />; 
  }

  if (error) {
    return <ErrorMessage message={error} />; 
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}> 
      <Typography variant="h4" component="h1" gutterBottom>
        Customers
      </Typography>
      
      <CustomerGrid rows={rows} columns={columns} /> 
    </Container>
  );
}

export default CustomerPage;