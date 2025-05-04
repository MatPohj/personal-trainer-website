import { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import { EnrichedTraining, TrainingResponse, extractIdFromUrl } from "../types"; 
import LoadingIndicator from "../components/LoadingIndicator"; 
import ErrorMessage from "../components/ErrorMessage"; 
import TrainingGrid from "../components/TrainingGrid"; 

function TrainingPage() {
  const [trainings, setTrainings] = useState<EnrichedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("/api/trainings");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data: TrainingResponse = await response.json();
        
        if (data && data._embedded && Array.isArray(data._embedded.trainings)) {
          const trainingsWithCustomers = await Promise.all(
            data._embedded.trainings.map(async (training) => {
              try {
                const customerResponse = await fetch(training._links.customer.href);
                if (!customerResponse.ok) {
                  throw new Error("Failed to fetch customer");
                }
                const customer = await customerResponse.json();
                return {
                  ...training,
                  customerName: `${customer.firstname} ${customer.lastname}`
                };
              } catch (err) {
                console.error("Error fetching customer:", err);
                return {
                  ...training,
                  customerName: "Unknown"
                };
              }
            })
          );
          
          setTrainings(trainingsWithCustomers);
        } else {
          throw new Error("Invalid data structure received");
        }
      } catch (err) {
        setError("Error fetching training data");
        console.error("Error fetching API:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainings();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 160,
      valueFormatter: (value) => {
        if (!value) return "-";
        try {
          const date = parseISO(String(value));
          return format(date, "dd.MM.yyyy");
        } catch {
          return "Invalid date";
        }
      },
    },
    {
      field: "time", 
      headerName: "Time",
      width: 140,
      valueGetter: (value, row) => { 
        if (!row || !row.date) return "-"; 
        try {
          const date = parseISO(String(row.date)); 
          return format(date, "HH:mm"); 
        } catch {
          return "Invalid time";
        }
      }
    },
    { field: "activity", headerName: "Activity", width: 150 },
    { 
      field: "duration", 
      headerName: "Duration (min)", 
      type: "number", 
      width: 130
    },
    {
      field: "customerName",
      headerName: "Customer",
      width: 180
    }
  ];

  const rows = trainings.map((training) => ({
    id: extractIdFromUrl(training._links.self.href),
    ...training
  }));

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