import { useState, useEffect } from 'react';
import DataTableList from '../components/DataTableList';
import VerticalAppBar from '../components/VerticalAppBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AlunoService from '../services/AlunoService'; 
import { useNavigate } from 'react-router-dom'; 

import '../styles/dataTableList.css'

const AllStudentsPage = () => {
    const navigate = useNavigate(); 

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const response = await AlunoService.getAllAlunos();
            console.log(response)
            const studentsData = response.map(student => ({
                id: student.id,
                name: student.usuario.nome,
                course: student.curso, 
                email: student.email, 
            }));
            setStudents(studentsData);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStudents();
    }, []);

    const onEdit = (id) => {
        console.log(`Editar aluno com ID: ${id}`);
    };

    const onDelete = (id) => {
        setStudents(students.filter(student => student.id !== id));
        console.log(`Excluir aluno com ID: ${id}`);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nome', flex: 1 },
        { field: 'course', headerName: 'Curso', flex: 1 },
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
                            onClick={() => onEdit(params.row.id)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <IconButton
                            color="secondary"
                            onClick={() => onDelete(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const handleAdd = () => {
        navigate('/register');
    };

    if (loading) {
        return <div>Carregando...</div>; 
    }

    return (
        <div>
            <VerticalAppBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Lista de Alunos</h1>
                <Button
                    sx={{ width: '300px', height: '3rem' }}
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAdd}
                >
                    Adicionar Aluno
                </Button>
            </div>
            <DataTableList datas={students} columns={columns} />
        </div>
    );
};

export default AllStudentsPage;
