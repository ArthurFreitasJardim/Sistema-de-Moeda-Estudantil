/* eslint-disable no-unused-vars */
import  { useState } from 'react';
import DataTableList from '../components/DataTableList';
import VerticalAppBar from '../components/VerticalAppBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import '../styles/dataTableList.css'

const AllStudentsPage = () => {

    const [students, setStudents] = useState([
        { id: 1, name: 'Ana Silva', course: 'Engenharia de Software', email: 'ana.silva@exemplo.com' },
        { id: 2, name: 'Bruno Costa', course: 'Ciência da Computação', email: 'bruno.costa@exemplo.com' },
        { id: 3, name: 'Carlos Oliveira', course: 'Sistemas de Informação', email: 'carlos.oliveira@exemplo.com' },
        { id: 4, name: 'Daniela Souza', course: 'Engenharia de Software', email: 'daniela.souza@exemplo.com' },
    ]);

    const onEdit = () => {
        console.log('teste');
    }

    const onDelete = () => {
        console.log('teste');
    }

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

    const handleEdit = (id) => {
        console.log(`Editar professor com ID: ${id}`);
    };

    const handleDelete = (id) => {
        setStudents(students.filter(teacher => teacher.id !== id));
        console.log(`Excluir professor com ID: ${id}`);
    };

    const handleAdd= () => {
        console.log('teste');
    }

    return (
        <div>
            <VerticalAppBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Lista de Alunos</h1>
                <Button
                    sx={{width: '300px', height: '3rem'}}
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
