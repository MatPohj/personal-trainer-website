import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

interface TrainingGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
}

const TrainingGrid = ({ rows, columns }: TrainingGridProps) => (
  <Box sx={{ width: '100%' }}> 
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
      autoHeight 
    />
  </Box>
);

export default TrainingGrid;