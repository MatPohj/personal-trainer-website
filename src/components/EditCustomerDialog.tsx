import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Customer } from "../types";

interface EditCustomerDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onCustomerUpdated: () => void;
}

export default function EditCustomerDialog({ open, customer, onClose, onCustomerUpdated }: EditCustomerDialogProps) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    streetaddress: "",
    postcode: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        streetaddress: customer.streetaddress,
        postcode: customer.postcode,
        city: customer.city,
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const response = await fetch(customer._links.self.href, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to update customer");
      onCustomerUpdated();
      onClose();
    } catch (err) {
      alert("Error updating customer");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Edit Customer</DialogTitle>
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
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}