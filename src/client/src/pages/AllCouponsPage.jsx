import { useState } from 'react';
import DataTableList from '../components/DataTableList';
import VerticalAppBar from '../components/VerticalAppBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AllCouponsPage = () => {
    const [coupons, setCoupons] = useState([
        { id: 1, code: 'CUPOM2024', status: 'Ativo', type: 'Porcentagem', value: '10%' },
        { id: 2, code: 'PROMO50', status: 'Ativo', type: 'Porcentagem', value: '50%' },
        { id: 3, code: 'OFERTA15', status: 'Inativo', type: 'Valor Fixo', value: 'R$ 15,00' },
        { id: 4, code: 'BLACKFRIDAY', status: 'Ativo', type: 'Porcentagem', value: '25%' },
        { id: 5, code: 'CUPOM5', status: 'Ativo', type: 'Valor Fixo', value: 'R$ 5,00' },
    ]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'code', headerName: 'Código do Cupom', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'type', headerName: 'Tipo', flex: 1 },
        { field: 'value', headerName: 'Valor', flex: 1 },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 150,
            renderCell: (params) => (
                <div>
                    <Tooltip title="Editar">
                        <IconButton
                            color="primary"
                            onClick={() => handleEdit(params.row.id)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <IconButton
                            color="secondary"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const handleEdit = (id) => {
        console.log(`Editar cupom com ID: ${id}`);
    };

    const handleDelete = (id) => {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
        console.log(`Excluir cupom com ID: ${id}`);
    };

    const handleAdd = () => {
        console.log('Adicionar cupom');
    };

    return (
        <div>
            <VerticalAppBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Códigos de Cupons</h1>
                <Button
                    sx={{ width: '300px', height: '3rem' }}
                    variant="contained"
                    color="primary"
                    startIcon={<LocalOfferIcon />}
                    onClick={handleAdd}
                >
                    Adicionar Cupom
                </Button>
            </div>
            <DataTableList datas={coupons} columns={columns} />
        </div>
    );
};

export default AllCouponsPage;
