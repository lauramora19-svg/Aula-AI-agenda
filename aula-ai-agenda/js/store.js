/* ==========================================================================
   AulaAI - Store & Local Storage Management
   ========================================================================== */

const STORAGE_KEY = 'aulaai_agenda_db_v1';

// Catalog of default Subjects with styles & icons
const DEFAULT_SUBJECTS = {
  MATES: { id: 'MATES', name: 'Matemáticas', colorClass: 'subj-mates', icon: 'fa-calculator' },
  LENGUA: { id: 'LENGUA', name: 'Lengua Castellana', colorClass: 'subj-lengua', icon: 'fa-book-open' },
  CIENCIAS: { id: 'CIENCIAS', name: 'Ciencias Naturales', colorClass: 'subj-ciencias', icon: 'fa-flask' },
  INGLES: { id: 'INGLES', name: 'Inglés', colorClass: 'subj-ingles', icon: 'fa-language' },
  EF: { id: 'EF', name: 'Educación Física', colorClass: 'subj-ef', icon: 'fa-running' },
  MUSICA: { id: 'MUSICA', name: 'Música', colorClass: 'subj-musica', icon: 'fa-music' },
  ARTISTICA: { id: 'ARTISTICA', name: 'Educación Artística', colorClass: 'subj-artistica', icon: 'fa-palette' },
  TUTORIA: { id: 'TUTORIA', name: 'Tutoría / Valores', colorClass: 'subj-tutoria', icon: 'fa-comments' },
  RECREO: { id: 'RECREO', name: 'Recreo / Descanso', colorClass: 'subj-recreo', icon: 'fa-coffee' }
};

// Default Schedule Slots (6 periods + Recreo) — estructura, no son datos inventados de alumnado
const DEFAULT_SLOTS = [
  { id: 'S1', label: '1ª Hora', time: '09:00 - 09:55' },
  { id: 'S2', label: '2ª Hora', time: '09:55 - 10:50' },
  { id: 'REC', label: 'Recreo', time: '10:50 - 11:20', isBreak: true },
  { id: 'S3', label: '3ª Hora', time: '11:20 - 12:15' },
  { id: 'S4', label: '4ª Hora', time: '12:15 - 13:10' },
  { id: 'S5', label: '5ª Hora', time: '13:10 - 14:05' }
];

// Days of the week
const DAYS = [
  { id: 'LUN', name: 'Lunes', short: 'Lun' },
  { id: 'MAR', name: 'Martes', short: 'Mar' },
  { id: 'MIE', name: 'Miércoles', short: 'Mié' },
  { id: 'JUE', name: 'Jueves', short: 'Jue' },
  { id: 'VIE', name: 'Viernes', short: 'Vie' }
];

// Distribuciones de agrupamiento disponibles para el Plano de Aula
const SEATING_LAYOUTS = {
  individual: { label: 'Individual', size: 1 },
  parejas: { label: 'Parejas', size: 2 },
  trios: { label: 'Tríos', size: 3 },
  grupos4: { label: 'Grupos de 4', size: 4 },
  grupos5: { label: 'Grupos de 5', size: 5 },
  grupos6: { label: 'Grupos de 6', size: 6 }
};

// Biblioteca de comunicaciones a familias: empieza con 5 modelos de ejemplo
// reutilizables (no son datos de alumnado, son plantillas de texto), y a
// partir de aquí se pueden editar, borrar o añadir nuevas — todas persisten.
const DEFAULT_MESSAGE_TEMPLATES = [
  {
    id: 'TPL-1',
    category: 'Tutoría & Reuniones',
    title: 'Convocatoria de Tutoría Presencial',
    text: 'Estimada familia de {nombre_alumno}:\n\nMe pongo en contacto con ustedes para convocarles a una reunión de tutoría el próximo [Fecha/Hora] en el aula de [Grupo]. Nos gustaría tratar la evolución académica y adaptación en este trimestre.\n\nLes ruego me confirmen asistencia.\n\nUn cordial saludo,\n[Nombre del Tutor/a]'
  },
  {
    id: 'TPL-2',
    category: 'Seguimiento Académico',
    title: 'Aviso por Tareas Pendientes',
    text: 'Estimada familia:\n\nLes informo de que {nombre_alumno} no ha entregado la tarea asignada para hoy en la asignatura de {asignatura}. Para evitar acumular retrasos en la materia, es importante completar los ejercicios en casa antes de la siguiente clase.\n\nGracias por su colaboración.\n\nAtentamente,\n[Profesor/a]'
  },
  {
    id: 'TPL-3',
    category: 'Reconocimiento y Felicitación',
    title: 'Felicitación por Excelente Progreso',
    text: 'Estimada familia de {nombre_alumno}:\n\nQuería escribirles brevemente para felicitarles por la magnífica actitud, esfuerzo y excelente progreso que está demostrando {nombre_alumno} esta semana en el aula. ¡Es una alegría contar con su participación!\n\n¡Enhorabuena!\n\nUn saludo muy afectuoso,'
  },
  {
    id: 'TPL-4',
    category: 'Exámenes y Evaluación',
    title: 'Recordatorio de Prueba Evaluativa',
    text: 'Estimada familia:\n\nLes recordamos que el próximo [Día de la semana] realizaremos la prueba evaluativa de la Unidad [Número] de {asignatura}. En el cuaderno y en el aula virtual disponen de la guía de repaso recomendada.\n\nSaludos cordiales,'
  },
  {
    id: 'TPL-5',
    category: 'Atención a la Diversidad / NEAE',
    title: 'Seguimiento de Adaptaciones NEAE',
    text: 'Estimada familia:\n\nLes escribo para informarles de que las pautas de adaptación metodológica de {nombre_alumno} están dando resultados muy positivos. Hemos ajustado los tiempos en las actividades escritas y su confianza en el aula ha aumentado notablemente.\n\nSeguimos en contacto constante.\n\nUn saludo,'
  }
];

// Estado inicial: SIN datos de ejemplo de personas. Todo empieza vacío, como un formulario en blanco.
const DEFAULT_STATE = {
  startDate: '2026-09-07',
  currentWeekIndex: 0,
  currentRole: 'docente',
  zoomScale: 1.0,
  gridMode: 'normal',
  darkMode: false,
  selectedClassId: null,
  classes: [],
  // Las clases se guardan POR SEMANA del curso: weeklyLessons[0] = semana 1, weeklyLessons[1] = semana 2...
  weeklyLessons: {},
  students: [],
  // Asientos guardados por cada clase/grupo: { [classId]: { layout: 'individual', seats: [{id, studentId}] } }
  seatingByClass: {},
  holidays: [],
  annualGoals: [],
  schoolContacts: [],
  absences: [],
  messageTemplates: DEFAULT_MESSAGE_TEMPLATES,
  // Días concretos que hay que dejar preparados para sustitución, y notas
  // generales para quien cubra la ausencia (llaves, incidencias, etc.)
  substitutionRange: { start: null, end: null },
  substitutionNotes: ''
};

class AppStore {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migración desde versiones antiguas: "lessons" plano -> semana 0
        if (parsed.lessons && !parsed.weeklyLessons) {
          parsed.weeklyLessons = { 0: parsed.lessons };
          delete parsed.lessons;
        }
        // Migración: "seating" global antiguo ya no se usa (ahora es por clase)
        if (parsed.seating && !parsed.seatingByClass) {
          delete parsed.seating;
        }
        return {
          ...DEFAULT_STATE,
          ...parsed,
          weeklyLessons: parsed.weeklyLessons || DEFAULT_STATE.weeklyLessons,
          seatingByClass: parsed.seatingByClass || DEFAULT_STATE.seatingByClass,
          messageTemplates: parsed.messageTemplates || DEFAULT_STATE.messageTemplates,
        };
      }
    } catch (e) {
      console.warn('Error loading from LocalStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving to LocalStorage:', e);
    }
  }

  // Devuelve (y crea si hace falta) el objeto de clases de una semana concreta.
  getWeekLessons(weekIndex) {
    const wi = weekIndex ?? (this.state.currentWeekIndex || 0);
    if (!this.state.weeklyLessons[wi]) {
      this.state.weeklyLessons[wi] = {};
    }
    return this.state.weeklyLessons[wi];
  }

  getLesson(dayId, slotId, weekIndex) {
    const key = `${dayId}_${slotId}`;
    return this.getWeekLessons(weekIndex)[key] || null;
  }

  updateLesson(dayId, slotId, updateObj, weekIndex) {
    const key = `${dayId}_${slotId}`;
    const weekLessons = this.getWeekLessons(weekIndex);
    if (!weekLessons[key]) {
      weekLessons[key] = { id: key, day: dayId, slot: slotId };
    }
    weekLessons[key] = { ...weekLessons[key], ...updateObj };
    this.saveState();
  }

  toggleGoal(goalId) {
    const goal = this.state.annualGoals.find(g => g.id === goalId);
    if (goal) {
      goal.done = !goal.done;
      this.saveState();
    }
  }
}

window.store = new AppStore();
window.DEFAULT_SUBJECTS = DEFAULT_SUBJECTS;
window.DEFAULT_SLOTS = DEFAULT_SLOTS;
window.DAYS = DAYS;
window.SEATING_LAYOUTS = SEATING_LAYOUTS;
