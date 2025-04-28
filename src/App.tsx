import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material'
import { 
  DataGrid, 
  GridColDef
} from '@mui/x-data-grid'
import { format, parseISO } from 'date-fns'
import './App.css'


interface Training {
  date: string;
  duration: number;
  activity: string;
  _links: {
    self: { href: string };
    training: { href: string };
    customer: { href: string };
  };
}

interface TrainingResponse {
  _embedded: {
    trainings: Training[];
  };
}

function App() {
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

  // Define columns for the DataGrid with error handling
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      valueFormatter: (value) => {
        if (!value) return '-';
        try {
          // The value here is the full date string from the 'date' field
          const date = parseISO(String(value));
          return format(date, 'dd.MM.yyyy');
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      // Keep field as 'time' for identification, but use valueGetter based on the row's 'date'
      field: 'time', 
      headerName: 'Time',
      width: 90,
      // Use params.row.date to access the correct data field
      valueGetter: (value, row) => { 
        if (!row || !row.date) return '-'; // Check if row and row.date exist
        try {
          // Parse the full date string from the row's 'date' field
          const date = parseISO(String(row.date)); 
          return format(date, 'HH:mm'); // Format only the time part
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
        id: crypto.randomUUID(), // More reliable than Math.random
        ...training
      };
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading trainings...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, color: 'error.main' }}>{error}</Box>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Training Sessions
      </Typography>
      
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>
    </Container>
  );
}

export default App
