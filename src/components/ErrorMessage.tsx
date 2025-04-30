import { Box } from '@mui/material';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, color: 'error.main' }}>
    {message}
  </Box>
);

export default ErrorMessage;