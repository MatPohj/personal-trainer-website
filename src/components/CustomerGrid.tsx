
import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface CustomerGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
}

const CustomerGrid = ({ rows, columns }: CustomerGridProps) => (
  <Box sx={{ width: "100%" }}> 
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 },
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      sx={{ 
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "lightgray",
        }
      }}
    />
  </Box>
);

export default CustomerGrid;