import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { useState } from "react";

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

const initialForm = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  streetaddress: "",
  postcode: "",
  city: "",
};

export default function AddCustomerDialog({ open, onClose, onCustomerAdded }: AddCustomerDialogProps) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to add customer");
      setForm(initialForm);
      onCustomerAdded();
      onClose();
    } catch (err) {
      alert("Error adding customer");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="First Name" name="firstname" value={form.firstname} onChange={handleChange} required />
          <TextField label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} required />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <TextField label="Street Address" name="streetaddress" value={form.streetaddress} onChange={handleChange} required />
          <TextField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} required />
          <TextField label="City" name="city" value={form.city} onChange={handleChange} required />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}