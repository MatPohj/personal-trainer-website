// filepath: c:\Users\arimo\Gitkansio\PersonalTrainerWebsite\src\pages\TrainingPage.tsx
import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { Training, TrainingResponse } from '../types'; 
import LoadingIndicator from '../components/LoadingIndicator'; 
import ErrorMessage from '../components/ErrorMessage'; 
import TrainingGrid from '../components/TrainingGrid'; 

function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch('/api/trainings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: TrainingResponse) => {
        if (data && data._embedded && Array.isArray(data._embedded.trainings)) {
          setTrainings(data._embedded.trainings);
        } else {
          throw new Error('Invalid data structure received');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching training data');
        setLoading(false);
        console.error('Error fetching API:', err);
      });
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      valueFormatter: (value) => {
        if (!value) return '-';
        try {
          const date = parseISO(String(value));
          return format(date, 'dd.MM.yyyy');
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      field: 'time', 
      headerName: 'Time',
      width: 140,
      valueGetter: (value, row) => { 
        if (!row || !row.date) return '-'; 
        try {
          const date = parseISO(String(row.date)); 
          return format(date, 'HH:mm'); 
        } catch {
          return 'Invalid time';
        }
      }
    },
    { field: 'activity', headerName: 'Activity', width: 150 },
    { 
      field: 'duration', 
      headerName: 'Duration (min)', 
      type: 'number', 
      width: 130
    }
  ];

  const rows = trainings.map((training) => {
    try {
      const urlParts = training._links.self.href.split('/');
      const id = urlParts[urlParts.length - 1]; 
      
      return {
        id,
        ...training
      };
    } catch (err) {
      console.error('Error extracting ID:', err);
      return {
        id: crypto.randomUUID(), 
        ...training
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Training Sessions
      </Typography>
      
      <TrainingGrid rows={rows} columns={columns} /> 
    </Container>
  );
}

export default TrainingPage;