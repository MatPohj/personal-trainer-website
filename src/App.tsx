import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'; 
import './App.css';
import TrainingPage from './pages/TrainingPage'; 
import CustomerPage from './pages/CustomerPage'; 

function App() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} /> 
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}> 
            Personal Trainer App
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}> 
            <Button 
              color="inherit" 
              component={Link} 
              to="//"
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                }
              }}
            >
              Trainings
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/customers"
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                }
              }}
            >
              Customers
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2, pt: '80px' }}> 
        <Routes>
          <Route path="/" element={<TrainingPage />} />
          <Route path="/customers" element={<CustomerPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;