import { useState, useEffect } from 'react';
import DataTableList from '../components/DataTableList';
import VerticalAppBar from '../components/VerticalAppBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProfessorService from '../services/ProfessorService'; 
import { useNavigate } from 'react-router-dom'; 

const AllTeachersPage = () => {
    const navigate = useNavigate(); 

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
            const response = await ProfessorService.getAllProfessores();
            const professorsData = response.map(professor => ({
                id: professor.id,
                name: professor.usuario.nome,
                course: professor.instituicaoId,
                email: professor.usuario.login
            }));
            setTeachers(professorsData);
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'course', headerName: 'Instituição', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
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
        console.log(`Editar professor com ID: ${id}`);
    };

    const handleDelete = (id) => {
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        console.log(`Excluir professor com ID: ${id}`);
    };

    const handleAdd = () => {
        navigate('/register-professor');
    };

    if (loading) {
        return <div>Carregando...</div>; 
    }

    return (
        <div>
            <VerticalAppBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Lista de Professores</h1>
                <Button
                    sx={{ width: '300px', height: '3rem' }}
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAdd}
                >
                    Adicionar Professores
                </Button>
            </div>
            <DataTableList datas={teachers} columns={columns} />
        </div>
    );
};

export default AllTeachersPage;
