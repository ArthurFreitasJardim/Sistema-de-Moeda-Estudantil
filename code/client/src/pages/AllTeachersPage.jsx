import { useState } from 'react';
import DataTableList from '../components/DataTableList';
import VerticalAppBar from '../components/VerticalAppBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const AllTeachersPage = () => {
    const [teachers, setTeachers] = useState([
        { id: 1, name: 'Dr. João Mendes', course: 'Engenharia de Software', email: 'joao.mendes@exemplo.com' },
        { id: 2, name: 'Profa. Maria Souza', course: 'Ciência da Computação', email: 'maria.souza@exemplo.com' },
        { id: 3, name: 'Prof. Carlos Silva', course: 'Sistemas de Informação', email: 'carlos.silva@exemplo.com' },
        { id: 4, name: 'Profa. Daniela Reis', course: 'Matemática', email: 'daniela.reis@exemplo.com' },
    ]);


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

    const handleAdd= () => {
        console.log('teste');
    }

    return (
        <div>
            <VerticalAppBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Lista de Professores</h1>
                <Button
                    sx={{width: '300px', height: '3rem'}}
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
