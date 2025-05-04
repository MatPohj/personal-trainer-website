import { useState, useEffect } from "react";
import { Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import { EnrichedTraining, TrainingResponse, extractIdFromUrl } from "../types"; 
import LoadingIndicator from "../components/LoadingIndicator"; 
import ErrorMessage from "../components/ErrorMessage"; 
import TrainingGrid from "../components/TrainingGrid"; 
import DeleteIcon from "@mui/icons-material/Delete";
import { GridActionsCellItem } from "@mui/x-data-grid";

function TrainingPage() {
  const [trainings, setTrainings] = useState<EnrichedTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTrainingId, setDeleteTrainingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteTrainingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTrainingId) return;
    try {
      const response = await fetch(`/api/trainings/${deleteTrainingId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete training");
      setDeleteTrainingId(null);
      // Refresh trainings
      fetchTrainings();
    } catch (err) {
      alert("Error deleting training");
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings");
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

  useEffect(() => {
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
      valueGetter: (_, row) => { 
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
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id as string)}
        />
      ]
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
      <Dialog open={!!deleteTrainingId} onClose={() => setDeleteTrainingId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this training session?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTrainingId(null)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TrainingPage;