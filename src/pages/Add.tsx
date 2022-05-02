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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api, {
  Category,
  Discipline,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from '../services/api';

const styles = {
  container: {
    marginTop: "180px",
    width: "460px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  title: { marginBottom: "30px" },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "26px",
  },
  input: { marginBottom: "16px" },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

interface FormData {
  name: string;
  pdfUrl: string;
  category: string; //criar tipo pra esses de dropdown
  teacher: string;
}

function Add() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categories, setCategories] = useState(null);
  const [teachers, setTeachers] = useState(null);  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    pdfUrl: '',
    category: '',
    teacher: '',
  });

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      //const { data: testsData } = await api.//falta um getTeachers
      const { data: categoriesData } = await api.getCategories(token);
      //setCategories(categoriesData.categories);
    }
    loadPage();
  }, [token]);

  return (
    <>
      <Typography sx={styles.title} variant="h4" component="h1">
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
          name="name"
          sx={styles.input}
          label="Título da prova"
          type="text"
          variant="outlined"
          //onChange={handleInputChange}
          //value={formData.email}
        />
        <TextField
          name="pdfUrl"
          sx={styles.input}
          label="PDF da prova"
          type="text"
          variant="outlined"
          //onChange={handleInputChange}
          //value={formData.email}
        />

      </Box>
    </>
  );
}

export default Add;
