import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingIndicator = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
    <Typography sx={{ ml: 2 }}>Loading trainings...</Typography>
  </Box>
);

export default LoadingIndicator;