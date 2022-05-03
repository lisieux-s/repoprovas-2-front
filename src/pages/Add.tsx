import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import api, {
  Category,
  Discipline,
  Teacher,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from '../services/api';

const styles = {
  container: {
    marginTop: '180px',
    width: '460px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  title: { marginBottom: '30px' },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
    marginBottom: '26px',
  },
  input: { marginBottom: '16px' },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

interface CategoryOptions {
  id: number;
  name: string;
}

interface DisciplineOptions {
  id: number;
  name: string;
}

interface TeacherOptions {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  pdfUrl: string;
  category: CategoryOptions;
  discipline: DisciplineOptions;
  teacher: TeacherOptions;
}

function Add() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    pdfUrl: '',
    category: {
      id: 0,
      name: '',
    },
    discipline: {
      id: 0,
      name: '',
    },
    teacher: {
      id: 0,
      name: '',
    },
  });

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);
      const { data: disciplinesData } = await api.getDisciplines(token);
      setDisciplines(disciplinesData.disciplines);
    }
    loadPage();
  }, [token]);

  useEffect(() => {
    async function loadTeachers() {
      if (!token) return;
      if (!formData.discipline.name) return;

      const { data: teachersData } = await api.getTeachersByDiscipline(
        token,
        formData.discipline.id
      );
      console.log(teachersData.teachers);
      setTeachers(teachersData.teachers)
    }
    loadTeachers()
  }, [formData.discipline]);

  async function handleSubmit(e: any) {
    if(!token) return;

    e.preventDefault();
    const testData = {
      name: formData.name,
      pdfUrl: formData.pdfUrl,
      categoryId: formData.category.id,
      disciplineId: formData.discipline.id,
      teacherId: formData.teacher.id
    }
    await api.createTest(token, testData); 
  }

  function handleChange({ target }: any) {
    setFormData({ ...formData, [target.name]: target.value })
  }

  return (
    <>
      <Typography sx={styles.title} variant='h4' component='h1'>
        Adicione uma prova
      </Typography>
      <Divider sx={{ marginBottom: '35px' }} />
      <Box
        sx={{
          marginX: 'auto',
          width: '700px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant='outlined'
            onClick={() => navigate('/app/disciplinas')}
          >
            Disciplinas
          </Button>
          <Button
            variant='outlined'
            onClick={() => navigate('/app/pessoas-instrutoras')}
          >
            Pessoa Instrutora
          </Button>
          <Button
            variant='contained'
            onClick={() => navigate('/app/adicionar')}
          >
            Adicionar
          </Button>
        </Box>
        <TextField
          name='name'
          sx={{ marginX: "auto", marginTop: "25px"}}
          label='Título da prova'
          type='text'
          variant='outlined'
          value={formData.name}
          onChange={(e) => handleChange(e)}
        />
        <TextField 
          name='pdfUrl'
          sx={{ marginX: "auto", marginTop: "25px"}}
          label='PDF da prova'
          type='text'
          variant='outlined'
          value={formData.pdfUrl}
          onChange={(e) => handleChange(e)}
        />
        <CategoriesSelect categories={categories} />
        <DisciplinesSelect disciplines={disciplines} />
        {!formData.discipline.name ? '' : <TeachersSelect teachers={teachers} />}
      
      <Button
        onClick={(e) => handleSubmit(e)}
      >Enviar</Button>
      
      </Box>
    </>
  );

  interface CategoriesMenuProps {
    categories: Category[];
  }

  function CategoriesSelect({ categories }: CategoriesMenuProps) {
    function handleChange({ target }: any) {
      //
    }

    function handleSelect(category: Category) {
      setFormData({
        ...formData,
        category: { id: category.id, name: category.name },
      });
    }

    return (
      <Box sx={{ marginX: "auto", marginTop: "25px"}}>
        <FormControl fullWidth>
          <InputLabel id='categories-select-label'>Categorias</InputLabel>
          <Select
            id='categories-select'
            labelId='categories-select-label'
            value={formData.category.name}
            label='Categoria'
            onChange={(e) => handleChange(e)}
          >
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.name}
                onClick={() => handleSelect(category)}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  interface TeachersMenuProps {
    teachers: Teacher[];
  }

  function TeachersSelect({ teachers }: TeachersMenuProps) {

    function handleChange({ target }: any) {
      //
    }

    function handleSelect(teacher: Teacher) {
      setFormData({
        ...formData,
        teacher: { id: teacher.id, name: teacher.name },
      });
    }

    return (
      <Box sx={{ marginX: "auto", marginTop: "25px"}}>
        <FormControl fullWidth>
          <InputLabel id='teachers-select-label'>Pessoa Instrutura</InputLabel>
          <Select
            id='teachers-select'
            labelId='teachers-select-label'
            value={formData.teacher.name}
            label='Pessoa Instrutura'
            onChange={(e) => handleChange(e)}
          >
            {teachers.map((teacher) => (
              
              <MenuItem
                key={teacher.id}
                value={teacher.name}
                onClick={() => handleSelect(teacher)}
              >
                {teacher.name}
              </MenuItem>
            
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  interface DisciplinesMenuProps {
    disciplines: Discipline[];
  }

  function DisciplinesSelect({ disciplines }: DisciplinesMenuProps) {

    function handleChange({ target }: any) {
      //
    }

    function handleSelect(discipline: Discipline) {
      setFormData({
        ...formData,
        discipline: { id: discipline.id, name: discipline.name },
      });
    }

    return (
      <Box sx={{ marginX: "auto", marginTop: "25px"}}>
        <FormControl fullWidth>
          <InputLabel id='disciplines-select-label'>Disciplinas</InputLabel>
          <Select
            id='disciplines-select'
            labelId='disciplines-select-label'
            value={formData.discipline.name}
            label='Disciplina'
            onChange={(e) => handleChange(e)}
          >
            {disciplines.map((discipline) => (
              <MenuItem
                key={discipline.id}
                value={discipline.name}
                onClick={() => handleSelect(discipline)}
              >
                {discipline.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
}

export default Add;
