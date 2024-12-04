import { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import VerticalAppBar from '../components/VerticalAppBar';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from 'react-router-dom'; 
import EmpresService from '../services/EmpresService'; 
import '../styles/partners.css';

const PartnersPage = () => {
    const navigate = useNavigate(); 
    const [empresas, setEmpresas] = useState([]); 

    const handleAdd = () => {
        navigate('/register-empresa'); 
    };

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const empresasData = await EmpresService.getAllEmpresas(); 
                setEmpresas(empresasData);
            } catch (error) {
                console.error('Erro ao buscar empresas:', error);
            }
        };

        fetchEmpresas();
    }, []); 

    return (
        <>
            <VerticalAppBar />
            <div id="partners-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                    <h1>Empresas Parceiras</h1>
                    <Button
                        sx={{ width: '300px', height: '3rem' }}
                        variant="contained"
                        color="primary"
                        startIcon={<CorporateFareIcon />}
                        onClick={handleAdd}
                    >
                        Adicionar Empresa
                    </Button>
                </div>

                <Grid container spacing={0} mt={2}>
                    {empresas.length > 0 ? (
                        empresas.map((empresa) => (
                            <Grid item xs={12} sm={6} md={4} key={empresa.id} sx={{ padding: '1rem', cursor: 'pointer' }}>
                                <img src={empresa.image} alt={empresa.nome} className="company-image" />
                            </Grid>
                        ))
                    ) : (
                        <p>Nenhuma empresa cadastrada.</p> 
                    )}
                </Grid>
            </div>
        </>
    );
};

export default PartnersPage;
