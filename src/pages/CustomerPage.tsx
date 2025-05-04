import { useState, useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Customer, CustomerResponse, extractIdFromUrl } from "../types"; 
import LoadingIndicator from "../components/LoadingIndicator"; 
import ErrorMessage from "../components/ErrorMessage"; 
import CustomerGrid from "../components/CustomerGrid"; 
import AddCustomerDialog from "../components/AddCustomerDialog";
import EditCustomerDialog from "../components/EditCustomerDialog";
import AddTrainingDialog from "../components/AddTrainingDialog";

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [selectedCustomerForTraining, setSelectedCustomerForTraining] = useState<Customer | null>(null);
  
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data: CustomerResponse = await response.json();
      
      if (data && data._embedded && Array.isArray(data._embedded.customers)) {
        setCustomers(data._embedded.customers);
      } else {
        throw new Error("Invalid data structure received");
      }
    } catch (err) {
      setError("Error fetching customer data");
      console.error("Error fetching API:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = (customer: Customer) => {
    setEditCustomer(customer);
  };

  const handleDeleteClick = (customer: Customer) => {
    setDeleteCustomer(customer);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCustomer) return;
    const id = extractIdFromUrl(deleteCustomer._links.self.href);
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete customer");
      setDeleteCustomer(null);
      fetchCustomers();
    } catch (err) {
      alert("Error deleting customer");
    }
  };

  const columns: GridColDef[] = [
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "streetaddress", headerName: "Address", width: 200 },
    { field: "postcode", headerName: "Postcode", width: 120 },
    { field: "city", headerName: "City", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 160,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<AddIcon />}
          label="Add Training"
          onClick={() => setSelectedCustomerForTraining(params.row)}
          showInMenu={false}
        />
      ]
    }
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
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setAddDialogOpen(true)}
      >
        Add Customer
      </Button>
      <CustomerGrid rows={rows} columns={columns} /> 
      <AddCustomerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCustomerAdded={fetchCustomers}
      />
      <EditCustomerDialog
        open={!!editCustomer}
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
        onCustomerUpdated={() => {
          setEditCustomer(null);
          fetchCustomers();
        }}
      />
      <AddTrainingDialog
        open={!!selectedCustomerForTraining}
        customer={selectedCustomerForTraining}
        onClose={() => setSelectedCustomerForTraining(null)}
        onTrainingAdded={() => setSelectedCustomerForTraining(null)}
      />
      <Dialog open={!!deleteCustomer} onClose={() => setDeleteCustomer(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete customer&nbsp;
          <b>
            {deleteCustomer?.firstname} {deleteCustomer?.lastname}
          </b>
          ?<br />
          This will also delete all their trainings!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCustomer(null)}>Cancel</Button>
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

export default CustomerPage;