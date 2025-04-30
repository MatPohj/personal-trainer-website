import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import './App.css';
import TrainingPage from './pages/TrainingPage'; 
import CustomerPage from './pages/CustomerPage'; 

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Trainer App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Trainings
          </Button>
          <Button color="inherit" component={Link} to="/customers">
            Customers
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}> 
        <Routes>
          <Route path="/" element={<TrainingPage />} />
          <Route path="/customers" element={<CustomerPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;