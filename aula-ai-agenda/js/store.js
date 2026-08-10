/* ==========================================================================
   AulaAI - Store & Local Storage Management (Updated with Annual & Seating)
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

// Default Schedule Slots (6 periods + Recreo)
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

// Seed data for Classes / Groups
const INITIAL_CLASSES_SEED = [
  { id: '2A-CIENCIAS', name: '2ºA - Ciencias', subject: 'Ciencias Naturales', count: 25, color: '#10b981' },
  { id: '1A-MATES', name: '1ºA - Matemáticas', subject: 'Matemáticas', count: 24, color: '#ef4444' },
  { id: '1B-LENGUA', name: '1ºB - Lengua', subject: 'Lengua Castellana', count: 23, color: '#f97316' },
  { id: '2B-INGLES', name: '2ºB - Inglés', subject: 'Inglés', count: 22, color: '#f59e0b' },
  { id: '3A-HISTORIA', name: '3ºA - Historia', subject: 'Sociales / Historia', count: 21, color: '#8b5cf6' },
  { id: '3B-EF', name: '3ºB - Ed. Física', subject: 'Educación Física', count: 24, color: '#06b6d4' }
];

// Sample Lesson Data Seed for Week 1
const INITIAL_LESSONS_SEED = {
  'LUN_S1': { id: 'LUN_S1', day: 'LUN', slot: 'S1', subjectId: 'MATES', group: '5ºA', title: 'Unidad 4: Fracciones y Decimales', notes: 'Explicación del concepto de fracción equivalente. Ejercicios 1 al 4 de pág 62.', status: 'pending', targetNEAE: 'Simplificar enunciados para Lucas M.' },
  'LUN_S2': { id: 'LUN_S2', day: 'LUN', slot: 'S2', subjectId: 'LENGUA', group: '5ºA', title: 'Comprensión Lectora: El Dragón Azul', notes: 'Lectura compartida en voz alta y análisis de vocabulario clave.', status: 'done', targetNEAE: '' },
  'LUN_S3': { id: 'LUN_S3', day: 'LUN', slot: 'S3', subjectId: 'CIENCIAS', group: '5ºA', title: 'El Ecosistema Terrestre', notes: 'Presentación con proyector sobre los biomas. Trabajo en grupos de 4.', status: 'pending', targetNEAE: '' },
  'LUN_S4': { id: 'LUN_S4', day: 'LUN', slot: 'S4', subjectId: 'INGLES', group: '5ºA', title: 'Unit 3: Daily Routines (Present Simple)', notes: 'Listening CD track 14 and speaking pairs activity.', status: 'pending', targetNEAE: '' },
  'LUN_S5': { id: 'LUN_S5', day: 'LUN', slot: 'S5', subjectId: 'EF', group: '5ºA', title: 'Juegos Motores y Cooperativos', notes: 'Calentamiento dinámico y circuito de agilidad en pabellón.', status: 'pending', targetNEAE: 'Control de fatiga para Sofía R.' },

  'MAR_S1': { id: 'MAR_S1', day: 'MAR', slot: 'S1', subjectId: 'LENGUA', group: '5ºA', title: 'Los Sustantivos y sus Clases', notes: 'Esquema en la pizarra: comunes, propios, individuales y colectivos.', status: 'pending', targetNEAE: '' },
  'MAR_S2': { id: 'MAR_S2', day: 'MAR', slot: 'S2', subjectId: 'MATES', group: '5ºA', title: 'Suma y Resta de Fracciones', notes: 'Mismo denominador. Ficha de refuerzo práctica.', status: 'pending', targetNEAE: 'Permitir uso de recta numérica.' },
  'MAR_S3': { id: 'MAR_S3', day: 'MAR', slot: 'S3', subjectId: 'MUSICA', group: '5ºA', title: 'Ritmo y Percusión Corporal', notes: 'Práctica de la partitura "Sonidos de Otoño" con flauta dulce.', status: 'pending', targetNEAE: '' },
  'MAR_S4': { id: 'MAR_S4', day: 'MAR', slot: 'S4', subjectId: 'CIENCIAS', group: '5ºA', title: 'Cadena Trófica y Cadena Alimentaria', notes: 'Ficha interactiva sobre productores, consumidores y descomponedores.', status: 'pending', targetNEAE: '' },
  'MAR_S5': { id: 'MAR_S5', day: 'MAR', slot: 'S5', subjectId: 'TUTORIA', group: '5ºA', title: 'Asamblea: Convivencia y Normas de Aula', notes: 'Debate sobre el respeto en los juegos de recreo.', status: 'pending', targetNEAE: '' }
};

// Initial Students Roster Seed (Enriched with Birthdays, Behavior & Parent Info)
const INITIAL_STUDENTS_SEED = [
  { id: 'STU-1', name: 'Ana García López', group: '2ºA', neae: true, neaeType: 'TDAH', notes: 'Instrucciones claras y breves. Tiempos estructurados y refuerzo positivo.', behavior: 'Excelente', birthday: '12/04', gradeAvg: 9.2, parentName: 'Laura Martín', parentPhone: '652 123 456', parentEmail: 'familia.garcia@email.com' },
  { id: 'STU-2', name: 'Bruno Martínez Ruiz', group: '2ºA', neae: false, neaeType: '', notes: 'Muy buen ritmo de trabajo. Participativo.', behavior: 'Bueno', birthday: '03/07', gradeAvg: 8.4, parentName: 'Carlos Martínez', parentPhone: '655 987 654', parentEmail: 'bmartinez@email.com' },
  { id: 'STU-3', name: 'Carla Torres Navas', group: '2ºA', neae: true, neaeType: 'Dislexia', notes: 'Adaptación de fuentes y tiempo extendido en pruebas escritas.', behavior: 'Excelente', birthday: '21/02', gradeAvg: 7.9, parentName: 'Marta Navas', parentPhone: '611 223 344', parentEmail: 'torres.navas@email.com' },
  { id: 'STU-4', name: 'Diego López Sánchez', group: '2ºA', neae: false, neaeType: '', notes: 'Creativo en trabajos en equipo.', behavior: 'Bueno', birthday: '15/09', gradeAvg: 8.8, parentName: 'Javier López', parentPhone: '622 334 455', parentEmail: 'lopez.sanchez@email.com' },
  { id: 'STU-5', name: 'Elena Ruiz Gómez', group: '2ºA', neae: true, neaeType: 'TDAH', notes: 'Primera fila cerca de la pizarra. Descansos fraccionados.', behavior: 'Correcta', birthday: '28/11', gradeAvg: 7.3, parentName: 'Rosa Gómez', parentPhone: '633 445 566', parentEmail: 'ruiz.gomez@email.com' },
  { id: 'STU-6', name: 'Jorge Benítez Silva', group: '2ºA', neae: false, neaeType: '', notes: 'Gran afinidad por experimentos de Ciencias.', behavior: 'Excelente', birthday: '05/01', gradeAvg: 9.0, parentName: 'Pedro Benítez', parentPhone: '644 556 677', parentEmail: 'benitez@email.com' },
  { id: 'STU-7', name: 'Javier Castro Vela', group: '2ºA', neae: false, neaeType: '', notes: 'Evolución constante.', behavior: 'Bueno', birthday: '18/03', gradeAvg: 8.1, parentName: 'Isabel Vela', parentPhone: '655 667 788', parentEmail: 'castro.vela@email.com' },
  { id: 'STU-8', name: 'Nico Ortiz Bravo', group: '2ºA', neae: false, neaeType: '', notes: 'Responsable.', behavior: 'Correcta', birthday: '30/08', gradeAvg: 7.7, parentName: 'Fernando Ortiz', parentPhone: '666 778 899', parentEmail: 'ortiz@email.com' },
  { id: 'STU-9', name: 'Pablo Morales Santos', group: '2ºA', neae: false, neaeType: '', notes: 'Habilidades lógicas.', behavior: 'Excelente', birthday: '14/10', gradeAvg: 9.5, parentName: 'Carmen Santos', parentPhone: '677 889 900', parentEmail: 'morales@email.com' },
  { id: 'STU-10', name: 'Sara Vidal Ramos', group: '2ºA', neae: false, neaeType: '', notes: 'Muy colaboradora.', behavior: 'Excelente', birthday: '22/05', gradeAvg: 9.1, parentName: 'Alberto Vidal', parentPhone: '688 990 011', parentEmail: 'vidal.ramos@email.com' },
  { id: 'STU-11', name: 'Valeria Merino Delgado', group: '2ºA', neae: false, neaeType: '', notes: 'Muy ordenada.', behavior: 'Bueno', birthday: '09/06', gradeAvg: 8.6, parentName: 'Lucía Delgado', parentPhone: '699 001 122', parentEmail: 'merino@email.com' }
];

// Initial Seating Layout Grid for Group 2ºA (Desks)
const INITIAL_SEATING_SEED = [
  { seatIndex: 0, studentId: 'STU-1', studentName: 'Ana' },
  { seatIndex: 1, studentId: 'STU-2', studentName: 'Bruno' },
  { seatIndex: 2, studentId: 'STU-3', studentName: 'Carla' },
  { seatIndex: 3, studentId: 'STU-4', studentName: 'Diego' },
  { seatIndex: 4, studentId: 'STU-6', studentName: 'Jorge' },
  { seatIndex: 5, studentId: 'STU-7', studentName: 'Javier' },
  { seatIndex: 6, studentId: 'STU-8', studentName: 'Nico' },
  { seatIndex: 7, studentId: 'STU-9', studentName: 'Pablo' },
  { seatIndex: 8, studentId: 'STU-10', studentName: 'Sara' },
  { seatIndex: 9, studentId: 'STU-11', studentName: 'Valeria' }
];

// Initial Annual Overview Seed Data
const INITIAL_HOLIDAYS_SEED = [
  { id: 'HOL-1', date: '12 OCT 2026', name: 'Fiesta Nacional de España', type: 'Festivo' },
  { id: 'HOL-2', date: '01 NOV 2026', name: 'Día de Todos los Santos', type: 'Festivo' },
  { id: 'HOL-3', date: '06 DIC 2026', name: 'Día de la Constitución', type: 'Festivo' },
  { id: 'HOL-4', date: '20 DIC 2026 - 07 ENE 2027', name: 'Vacaciones de Navidad', type: 'Vacaciones' },
  { id: 'HOL-5', date: '22 MAR 2027 - 29 MAR 2027', name: 'Semana Santa', type: 'Vacaciones' },
  { id: 'HOL-6', date: '01 MAY 2027', name: 'Día del Trabajo', type: 'Festivo' }
];

const INITIAL_GOALS_SEED = [
  { id: 'G-1', text: 'Mejorar la planificación y organización didáctica', done: true },
  { id: 'G-2', text: 'Fomentar la participación activa del alumnado en aula', done: true },
  { id: 'G-3', text: 'Mejorar los resultados académicos en competencias clave', done: false },
  { id: 'G-4', text: 'Desarrollar la competencia digital con herramientas AULA', done: true },
  { id: 'G-5', text: 'Promover aprendizajes significativos y bienestar en clase', done: false },
  { id: 'G-6', text: 'Formación continua y desarrollo profesional docente', done: true }
];

const INITIAL_CONTACTS_SEED = [
  { id: 'C-1', role: 'Dirección', name: 'Ana López', email: 'direccion@centro.es' },
  { id: 'C-2', role: 'Jefatura de estudios', name: 'Carlos Ruiz', email: 'jefatura@centro.es' },
  { id: 'C-3', role: 'Secretaría', name: 'Marta Pérez', email: 'secretaria@centro.es' },
  { id: 'C-4', role: 'Orientación', name: 'Laura Gómez', email: 'orientacion@centro.es' }
];

const INITIAL_ABSENCES_SEED = [
  { id: 'ABS-1', date: '15 OCT 2026', type: 'Ausencia', notes: 'Baja médica común (1 día)' },
  { id: 'ABS-2', date: '23 NOV 2026', type: 'Sustitución', notes: 'Reunión de Coordinación Externa' },
  { id: 'ABS-3', date: '10 FEB 2027', type: 'Ausencia', notes: 'Asistencia a Curso de Formación CPR' }
];

const DEFAULT_STATE = {
  startDate: '2026-09-07',
  currentWeekIndex: 0,
  currentRole: 'docente',
  zoomScale: 1.0,
  gridMode: 'normal',
  darkMode: false,
  selectedClassId: '2A-CIENCIAS',
  classes: INITIAL_CLASSES_SEED,
  // Las clases se guardan POR SEMANA del curso: weeklyLessons[0] = semana 1, weeklyLessons[1] = semana 2...
  // Así cada semana tiene su propia programación, en vez de repetir siempre lo mismo.
  weeklyLessons: { 0: INITIAL_LESSONS_SEED },
  students: INITIAL_STUDENTS_SEED,
  seating: INITIAL_SEATING_SEED,
  holidays: INITIAL_HOLIDAYS_SEED,
  annualGoals: INITIAL_GOALS_SEED,
  schoolContacts: INITIAL_CONTACTS_SEED,
  absences: INITIAL_ABSENCES_SEED
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
        // Migración desde la versión antigua: si existía un único "lessons" plano,
        // se convierte en la semana 0 para no perder lo que ya se había escrito.
        if (parsed.lessons && !parsed.weeklyLessons) {
          parsed.weeklyLessons = { 0: parsed.lessons };
          delete parsed.lessons;
        }
        return {
          ...DEFAULT_STATE,
          ...parsed,
          weeklyLessons: parsed.weeklyLessons || DEFAULT_STATE.weeklyLessons,
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
  // Sin argumento, usa la semana que se está viendo ahora mismo.
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
