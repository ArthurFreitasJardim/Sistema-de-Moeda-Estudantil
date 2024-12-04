import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard'; 
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; 
import StarIcon from '@mui/icons-material/Star'; 
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import { Box, Typography, List, ListItem, ListItemText, Grid, Button } from '@mui/material';
import VerticalAppBar from '../components/VerticalAppBar';
import { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import AlunoService from '../services/AlunoService';
import ProfessorService from '../services/ProfessorService';


const Dashboard = () => {

    const id = location.state?.userId || localStorage.getItem('userId');
    const [aluno, setAluno] = useState(null);  // Estado para armazenar os dados do aluno
    const [professor, setProfessor] = useState(null);  // Estado para armazenar os dados do aluno
    const [loading, setLoading] = useState(true);  // Estado para controle de carregamento


    useEffect(() => {
        const fetchAluno = async () => {
            try {
                const alunoData = await AlunoService.getAlunoById(id);
                setAluno(alunoData);  // Atualiza o estado com os dados do aluno
                setLoading(false);  // Define que o carregamento foi concluído
            } catch (error) {
                console.error('Erro ao buscar aluno', error);
                setLoading(false);  // Caso ocorra erro, ainda define como carregado
            }
        };

        fetchAluno();  // Chama a função para buscar o aluno
    }, [id]);  // Reexecuta quando o ID mudar

    // Enquanto os dados não estiverem carregados, mostra uma tela de loading
    if (loading) {
        return <Typography>Carregando...</Typography>;
    }

    const formatarParaReal = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };


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
                        Olá, <span style={{ color: '#1074b4' }}>{aluno.usuario.nome}</span>!
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
                            {formatarParaReal(aluno.saldo)}
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
                                {/* <List>
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
                                </List> */}
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
                                {/* <List>
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
                                </List> */}
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
                                {/* <List>
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
                                </List> */}
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
