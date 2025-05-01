import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Customer, CustomerResponse, extractIdFromUrl } from '../types'; 
import LoadingIndicator from '../components/LoadingIndicator'; 
import ErrorMessage from '../components/ErrorMessage'; 
import CustomerGrid from '../components/CustomerGrid'; 

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: CustomerResponse = await response.json();
        
        if (data && data._embedded && Array.isArray(data._embedded.customers)) {
          setCustomers(data._embedded.customers);
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (err) {
        setError('Error fetching customer data');
        console.error('Error fetching API:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
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

  const rows = customers.map((customer) => ({
    id: extractIdFromUrl(customer._links.self.href),
    ...customer
  }));

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