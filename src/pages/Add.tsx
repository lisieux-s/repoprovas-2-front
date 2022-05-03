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

      //const { data: testsData } = await api.//falta um getTeachers
      const { data: categoriesData } = await api.getCategories(token);
      console.log(categoriesData);
      setCategories(categoriesData.categories);
      const { data: disciplinesData } = await api.getDisciplines(token);
      console.log(disciplinesData.disciplines);
      setDisciplines(disciplinesData.disciplines);
      //setDisciplines(disciplinesData.disciplines);
    }
    loadPage();
  }, [token]);

  useEffect(() => {
    async function loadTeachers() {
      if (!token) return;
      if (!disciplines) return;

      const { data: teachersData } = await api.getTeachersByDiscipline(
        token,
        formData.discipline.id
      );
      console.log(teachersData);
    }
  }, [formData.discipline]);

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
          sx={styles.input}
          label='Título da prova'
          type='text'
          variant='outlined'
          //onChange={handleInputChange}
          //value={formData.email}
        />
        <TextField
          name='pdfUrl'
          sx={styles.input}
          label='PDF da prova'
          type='text'
          variant='outlined'
          //onChange={handleInputChange}
          //value={formData.email}
        />
        <CategoriesMenu categories={categories} />
        <DisciplinesMenu disciplines={disciplines} />
      </Box>
    </>
  );
}

interface CategoriesMenuProps {
  categories: Category[];
}

function CategoriesMenu({ categories }: CategoriesMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id='positioned-button'
        aria-controls={open ? 'positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Categorias
      </Button>
      <Menu
        id='positioned-menu'
        aria-labelledby='positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {categories.map((category) => (
          <MenuItem 
            key={category.id} 
            onClick={handleClose}>
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

interface DisciplinesMenuProps {
  disciplines: Discipline[];
}

function DisciplinesMenu({ disciplines }: DisciplinesMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id='positioned-button'
        aria-controls={open ? 'positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Disciplinas
      </Button>
      <Menu
        id='positioned-menu'
        aria-labelledby='positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {disciplines.map((discipline) => (
          <MenuItem 
            key={discipline.id} 
            onClick={handleClose}>
            {discipline.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default Add;
