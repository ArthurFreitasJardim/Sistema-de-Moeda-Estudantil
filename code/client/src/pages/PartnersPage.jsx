import { Grid, Button } from '@mui/material';
import VerticalAppBar from '../components/VerticalAppBar';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import '../styles/partners.css';

const partners = [
    { id: 1, name: 'Empresa A', image: 'https://startse-uploader.s3.us-east-2.amazonaws.com/medium_Texto_do_seu_paragrafo_11_21eecaddaa.jpg' },
    { id: 2, name: 'Empresa B', image: 'https://st4.depositphotos.com/1001860/28345/i/450/depositphotos_283453120-stock-photo-amazon-echo-dot.jpg' },
    { id: 3, name: 'Empresa C', image: 'https://static.vecteezy.com/ti/vetor-gratis/p1/20336038-samsung-logotipo-samsung-icone-livre-gratis-vetor.jpg' },
];

const handleAdd = () => {
    console.log('teste');
}

const PartnersPage = () => {
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
                    {partners.map((partner) => (
                        <Grid item xs={12} sm={6} md={4} key={partner.id} sx={{padding: '1rem', cursor: 'pointer'}}>
                            <img src={partner.image} alt={partner.name} className="company-image" />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default PartnersPage;
