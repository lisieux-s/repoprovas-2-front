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
  Autocomplete
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api, {
  Category,
  Teacher,
  TeacherDisciplines,
  Test,
  TestByTeacher,
} from '../services/api';

let TOKEN: string = '';

function Instructors() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [teachersDisciplines, setTeachersDisciplines] = useState<
    TestByTeacher[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [teachersList, setTeachersList]: any[] = useState([])

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      TOKEN = token;
      const { data: testsData } = await api.getTestsByTeacher(token);
      setTeachersDisciplines(testsData.tests);
      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);
    }
    loadPage();
  }, [token]);

  useEffect(() => {
    async function loadSearch() {
      if (!token) return;

      const { data: teachersData } = await api.getTeachers(token);
      setTeachers(teachersData.teacher);

    }
    loadSearch()
  }, [token])

  useEffect(() => {
    async function listTeachers() {
      const list: any[] = []
      if(!teachers) return;
      teachers.map(teacher => {
        list.push(teacher.name)
      })
      setTeachersList(list)
    }
    listTeachers();
  }, [teachers])

  return (
    <>
      <Autocomplete
      sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
      disablePortal
      id="disciplines-search"
      options={teachersList}
      renderInput={(params) => <TextField {...params} label="Pesquise por pessoa instrutura" />}
    />
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
            variant='contained'
            onClick={() => navigate('/app/pessoas-instrutoras')}
          >
            Pessoa Instrutora
          </Button>
          <Button variant='outlined' onClick={() => navigate('/app/adicionar')}>
            Adicionar
          </Button>
        </Box>
        <TeachersDisciplinesAccordions
          categories={categories}
          teachersDisciplines={teachersDisciplines}
        />
      </Box>
    </>
  );
}

interface TeachersDisciplinesAccordionsProps {
  teachersDisciplines: TestByTeacher[];
  categories: Category[];
}

function TeachersDisciplinesAccordions({
  categories,
  teachersDisciplines,
}: TeachersDisciplinesAccordionsProps) {
  const teachers = getUniqueTeachers(teachersDisciplines);

  return (
    <Box sx={{ marginTop: '50px' }}>
      {teachers.map((teacher) => (
        <Accordion sx={{ backgroundColor: '#FFF' }} key={teacher}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight='bold'>{teacher}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categories
              .filter(doesCategoryHaveTests(teacher, teachersDisciplines))
              .map((category) => (
                <Categories
                  key={category.id}
                  category={category}
                  teacher={teacher}
                  teachersDisciplines={teachersDisciplines}
                />
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

function getUniqueTeachers(teachersDisciplines: TestByTeacher[]) {
  return [
    ...new Set(
      teachersDisciplines.map(
        (teacherDiscipline) => teacherDiscipline.teacher.name
      )
    ),
  ];
}

function doesCategoryHaveTests(
  teacher: string,
  teachersDisciplines: TeacherDisciplines[]
) {
  return (category: Category) =>
    teachersDisciplines.filter(
      (teacherDiscipline) =>
        teacherDiscipline.teacher.name === teacher &&
        testOfThisCategory(teacherDiscipline, category)
    ).length > 0;
}

function testOfThisCategory(
  teacherDiscipline: TeacherDisciplines,
  category: Category
) {
  return teacherDiscipline.tests.some(
    (test) => test.category.id === category.id
  );
}

interface CategoriesProps {
  teachersDisciplines: TeacherDisciplines[];
  category: Category;
  teacher: string;
}

function Categories({
  category,
  teachersDisciplines,
  teacher,
}: CategoriesProps) {
  return (
    <>
      <Box sx={{ marginBottom: '8px' }}>
        <Typography fontWeight='bold'>{category.name}</Typography>
        {teachersDisciplines
          .filter(
            (teacherDiscipline) => teacherDiscipline.teacher.name === teacher
          )
          .map((teacherDiscipline) => (
            <Tests
              key={teacherDiscipline.id}
              tests={teacherDiscipline.tests.filter(
                (test) => test.category.id === category.id
              )}
              disciplineName={teacherDiscipline.discipline.name}
            />
          ))}
      </Box>
    </>
  );
}

async function handleClick(testId: number) {
  await api.incrementViews(TOKEN, testId);
}

interface TestsProps {
  disciplineName: string;
  tests: Test[];
}

function Tests({ tests, disciplineName }: TestsProps) {
  return (
    <>
      {tests.map((test) => (
        <Typography key={test.id} color='#878787'>
          <Link
            href={test.pdfUrl}
            target='_blank'
            underline='none'
            color='inherit'
            onClick={() => handleClick(test.id)}
          >{`${test.name} (${disciplineName}) (${test.views} visualizações)`}</Link>
        </Typography>
      ))}
    </>
  );
}

export default Instructors;
