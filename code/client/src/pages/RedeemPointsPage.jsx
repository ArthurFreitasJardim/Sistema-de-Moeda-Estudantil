import { Grid, Paper, Typography, Button } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerticalAppBar from '../components/VerticalAppBar';
import '../styles/redeemPoints.css';

const products = [
    { id: 1, name: 'Produto A', points: 100, image: 'https://example.com/produto-a.jpg' },
    { id: 2, name: 'Produto B', points: 200, image: 'https://example.com/produto-b.jpg' },
    { id: 3, name: 'Produto C', points: 150, image: 'https://example.com/produto-c.jpg' },
];

const RedeemPointsPage = () => {
    const handleRedeem = (productId) => {
        console.log(`Resgatar produto com ID: ${productId}`);
    };

    return (
        <div>
            <VerticalAppBar />
            <div id="redeem-points-container" style={{ padding: '30px' }}>
                <Typography variant="h4" gutterBottom>
                    Resgatar Pontos em Produtos
                </Typography>
                <Grid container spacing={2}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Paper className="product-card" elevation={3}>
                                <div className="card-body">
                                    <img src={product.image} alt={product.name} className="product-image" />
                                    <Typography variant="h6" className="product-title">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        Pontos Necessários: {product.points}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<LocalOfferIcon />}
                                        onClick={() => handleRedeem(product.id)}
                                    >
                                        Resgatar
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default RedeemPointsPage;
