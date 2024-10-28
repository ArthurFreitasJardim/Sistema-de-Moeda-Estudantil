import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard'; // Ícone para entrada (Crédito)
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Ícone para saída (Débito)
import StarIcon from '@mui/icons-material/Star'; // Ícone para metas
import AssignmentIcon from '@mui/icons-material/Assignment'; // Ícone para desafios
import { Box, Typography, List, ListItem, ListItemText, Grid, Button } from '@mui/material';
import VerticalAppBar from '../components/VerticalAppBar';

// Exemplo de dados
const transacoes = [
    {
        id: 1,
        tipo: "Crédito",
        data: "2024-10-20",
        valor: 500.00,
        descricao: "Depósito de bolsa de estudos",
        icon: <CreditCardIcon sx={{ color: 'green', mr: 1 }} /> // Ícone de entrada
    },
    {
        id: 2,
        tipo: "Débito",
        data: "2024-10-22",
        valor: 150.00,
        descricao: "Compra de materiais escolares",
        icon: <AttachMoneyIcon sx={{ color: 'red', mr: 1 }} /> // Ícone de saída
    },
    {
        id: 3,
        tipo: "Débito",
        data: "2024-10-24",
        valor: 200.00,
        descricao: "Pagamento de mensalidade",
        icon: <AttachMoneyIcon sx={{ color: 'red', mr: 1 }} /> // Ícone de saída
    },
    {
        id: 4,
        tipo: "Crédito",
        data: "2024-10-25",
        valor: 300.00,
        descricao: "Bolsas de incentivo acadêmico",
        icon: <CreditCardIcon sx={{ color: 'green', mr: 1 }} /> // Ícone de entrada
    },
    {
        id: 5,
        tipo: "Débito",
        data: "2024-10-26",
        valor: 75.00,
        descricao: "Pagamento de transporte",
        icon: <AttachMoneyIcon sx={{ color: 'red', mr: 1 }} /> // Ícone de saída
    }
];

const metas = [
    {
        id: 1,
        meta: "Viajar nas férias",
        valorMeta: 1500.00,
        valorAtual: 800.00,
        dataLimite: "2024-12-20",
        icon: <StarIcon sx={{ color: '#FFD700', mr: 1 }} /> // Ícone de meta
    },
    {
        id: 2,
        meta: "Comprar um novo laptop",
        valorMeta: 3000.00,
        valorAtual: 1200.00,
        dataLimite: "2025-02-15",
        icon: <StarIcon sx={{ color: '#FFD700', mr: 1 }} /> // Ícone de meta
    },
    {
        id: 3,
        meta: "Curso de inglês",
        valorMeta: 600.00,
        valorAtual: 300.00,
        dataLimite: "2025-01-10",
        icon: <StarIcon sx={{ color: '#FFD700', mr: 1 }} /> // Ícone de meta
    },
    {
        id: 4,
        meta: "Fazer intercâmbio",
        valorMeta: 5000.00,
        valorAtual: 1500.00,
        dataLimite: "2025-07-01",
        icon: <StarIcon sx={{ color: '#FFD700', mr: 1 }} /> // Ícone de meta
    }
];

const desafios = [
    {
        id: 1,
        titulo: "Desafio 30 dias sem gastar",
        progresso: 75, // 75% do desafio concluído
        dataLimite: "2024-11-30",
        recompensa: "R$50 em saldo extra"
    },
    {
        id: 2,
        titulo: "Economize R$100 esta semana",
        progresso: 40,
        dataLimite: "2024-10-31",
        recompensa: "Desconto em produtos selecionados"
    },
    {
        id: 3,
        titulo: "Economize para um passeio",
        progresso: 20,
        dataLimite: "2025-01-15",
        recompensa: "Vale-presente"
    },
    {
        id: 4,
        titulo: "Desafio de 7 dias sem café",
        progresso: 60,
        dataLimite: "2024-10-30",
        recompensa: "R$30 em saldo extra"
    }
];

const Dashboard = () => {
    return (
        <div>
            <VerticalAppBar />
            <Box sx={{ display: 'flex', marginTop: '-3.6rem' }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        height: '100vh',
                    }}
                >
                    <h1 className='user-name'>
                        Olá, <span style={{ color: '#1074b4' }}>Wilken Moreira</span>!
                    </h1>

                    <Box
                        sx={{
                            flexGrow: 1,
                            backgroundColor: '#1074b4',
                            p: 3,
                            height: '30vh',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 50, mr: 1 }} />
                            <Typography variant="h5">Seu Saldo:</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                            R$ 1.000,00
                        </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: '95%',
                                    height: '325px',
                                    bgcolor: '#f9f9f9',
                                    borderRadius: '8px',
                                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Transações Recentes
                                </Typography>
                                <List>
                                    {transacoes.slice(0, 3).map((transacao) => (
                                        <ListItem key={transacao.id}>
                                            {transacao.icon}
                                            <ListItemText
                                                primary={`${transacao.tipo}: R$ ${transacao.valor.toFixed(2)}`}
                                                secondary={`${transacao.data} - ${transacao.descricao}`}
                                                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="outlined" sx={{ margin: 2, color: '#1074b4', borderColor: '#1074b4' }} onClick={() => console.log('Ver mais transações')}>
                                    Ver Mais
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: '95%',
                                    height: '325px',
                                    borderRadius: '8px',
                                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Metas de Economia
                                </Typography>
                                <List>
                                    {metas.slice(0, 3).map((meta) => (
                                        <ListItem key={meta.id}>
                                            {meta.icon}
                                            <ListItemText
                                                primary={meta.meta}
                                                secondary={`Meta: R$ ${meta.valorMeta.toFixed(2)} | Atual: R$ ${meta.valorAtual.toFixed(2)} | Limite: ${meta.dataLimite}`}
                                                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="outlined" sx={{ margin: 2, color: '#1074b4', borderColor: '#1074b4' }} onClick={() => console.log('Ver mais metas')}>
                                    Ver Mais
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: '94%',
                                    height: '325px',
                                    borderRadius: '8px',
                                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Desafios
                                </Typography>
                                <List>
                                    {desafios.slice(0, 3).map((desafio) => (
                                        <ListItem key={desafio.id}>
                                            <AssignmentIcon sx={{ color: '#ff9800', mr: 1 }} />
                                            <ListItemText
                                                primary={desafio.titulo}
                                                secondary={`Progresso: ${desafio.progresso}% | Limite: ${desafio.dataLimite} | Recompensa: ${desafio.recompensa}`}
                                                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button variant="outlined" sx={{ marginTop: '-0.7rem', marginLeft: 2 , color: '#1074b4', borderColor: '#1074b4' }} onClick={() => console.log('Ver mais desafios')}>
                                    Ver Mais
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
};

export default Dashboard;
