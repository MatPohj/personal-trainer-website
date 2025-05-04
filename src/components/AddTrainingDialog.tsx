import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { Customer } from "../types";
import { fi } from "date-fns/locale";
interface AddTrainingDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onTrainingAdded: () => void;
}

const initialForm = {
  date: "",
  activity: "",
  duration: "",
};

export default function AddTrainingDialog({ open, customer, onClose, onTrainingAdded }: AddTrainingDialogProps) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [dateValue, setDateValue] = useState<Date | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (value: Date | null) => {
    setDateValue(value);
    setForm({ ...form, date: value ? value.toISOString() : "" });
  };

  const handleSubmit = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        customer: customer._links.self.href,
      };
      const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to add training");
      setForm(initialForm);
      setDateValue(null);
      onTrainingAdded();
      onClose();
    } catch (err) {
      alert("Error adding training");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setDateValue(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Add Training for {customer?.firstname} {customer?.lastname}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fi}>
        <DateTimePicker
            label="Date and Time"
            value={dateValue}
            onChange={handleDateChange}
            ampm={false}
            format="dd.MM.yyyy HH:mm"
            slotProps={{ textField: { required: true } }}
        />
        </LocalizationProvider>
          <TextField
            label="Activity"
            name="activity"
            value={form.activity}
            onChange={handleChange}
            required
          />
          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}