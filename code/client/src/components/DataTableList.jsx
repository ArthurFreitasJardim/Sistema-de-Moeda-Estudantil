/* eslint-disable react/prop-types */
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DataTableList = ({ columns, datas }) => {

    return (
        <Paper sx={{ height: '80vh', width: '98vw', margin: 'auto', padding: '20px' }}>
            <DataGrid
                rows={datas}
                columns={columns}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                disableColumnMenu
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    },
                }}
                sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeader': { backgroundColor: '#1074b4', color: 'white' },
                    '& .MuiDataGrid-cell': { color: '#1074b4' },
                    '& .Mui-selected': { backgroundColor: '#d6eaf8 !important' },
                }}
            />
        </Paper>
    );
};

export default DataTableList;
