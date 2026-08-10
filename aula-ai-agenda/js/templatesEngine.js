/* ==========================================================================
   AulaAI - Templates Engine (Banco de Mensajes a Familias & Carpeta de Sustitución)
   ========================================================================== */

const FAMILY_MESSAGE_TEMPLATES = [
  {
    id: 'TPL-1',
    category: 'Tutoría & Reuniones',
    title: 'Convocatoria de Tutoría Presencial',
    text: 'Estimada familia de {nombre_alumno}:\n\nMe pongo en contacto con ustedes para convocarles a una reunión de tutoría el próximo [Fecha/Hora] en el aula de 5ºA. Nos gustaría tratar la evolución académica y adaptación en este trimestre.\n\nLes ruego me confirmen asistencia.\n\nUn cordial saludo,\n[Nombre del Tutor/a]'
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

class TemplatesEngine {
  constructor() {}

  renderTemplatesGrid() {
    const container = document.getElementById('templates-grid-container');
    if (!container) return;

    container.innerHTML = FAMILY_MESSAGE_TEMPLATES.map(tpl => `
      <div class="template-card">
        <div>
          <div class="template-title">
            <i class="fa-regular fa-comment-dots" style="color: var(--accent-primary);"></i>
            ${tpl.title}
          </div>
          <span style="font-size: 0.72rem; background: var(--accent-light); color: var(--accent-primary); padding: 2px 6px; border-radius: var(--radius-sm); font-weight: 600;">
            ${tpl.category}
          </span>
          <div class="template-preview" style="margin-top: 0.75rem;">${tpl.text}</div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: auto;">
          <button class="btn btn-primary" style="flex:1;" onclick="window.templatesEngine.copyTemplateText('${tpl.id}')">
            <i class="fa-regular fa-copy"></i> Copiar Mensaje
          </button>
        </div>
      </div>
    `).join('');
  }

  copyTemplateText(templateId) {
    const tpl = FAMILY_MESSAGE_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;

    navigator.clipboard.writeText(tpl.text).then(() => {
      window.app.showToast('¡Plantilla copiada al portapapeles! Lista para personalizar.', 'success');
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  }

  // Generador de Carpeta de Sustitución (Vista de Guardia / Relevo)
  renderSubstitutionFolder() {
    const container = document.getElementById('substitution-content');
    if (!container) return;

    const todayDayId = window.dateEngine.getTodayDayId();
    const realWeekIndex = window.dateEngine.getRealCurrentWeekIndex();

    if (!todayDayId) {
      container.innerHTML = `
        <div class="substitution-sheet">
          <div class="substitution-header">
            <div class="sub-title-group">
              <h2>📁 Carpeta de Sustitución y Plan de Clase</h2>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Hoy es fin de semana, no hay sesiones programadas.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const weekLessons = window.store.getWeekLessons(realWeekIndex);
    const dayLessons = [];

    window.DEFAULT_SLOTS.forEach(slot => {
      if (slot.isBreak) {
        dayLessons.push({ time: slot.time, label: 'RECREO / DESCANSO EN PATIO', isBreak: true });
      } else {
        const les = weekLessons[`${todayDayId}_${slot.id}`];
        if (les) {
          const subj = window.DEFAULT_SUBJECTS[les.subjectId] || {};
          dayLessons.push({
            time: slot.time,
            label: `${slot.label} - ${subj.name} (${les.group})`,
            title: les.title,
            notes: les.notes,
            targetNEAE: les.targetNEAE,
            isBreak: false
          });
        }
      }
    });

    const neaeStudents = window.store.state.students.filter(s => s.neae);
    const todayLabel = (window.DAYS.find(d => d.id === todayDayId) || {}).name || todayDayId;
    const todayDateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    container.innerHTML = `
      <div class="substitution-sheet">
        <div class="substitution-header">
          <div class="sub-title-group">
            <h2>📁 Carpeta de Sustitución y Plan de Clase</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              Guía rápida para el profesor/a de guardia o sustituto/a — Grupo 5ºA · Hoy es ${todayLabel}, ${todayDateStr}
            </p>
          </div>
          <button class="btn btn-secondary" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Imprimir / Exportar PDF
          </button>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.75rem;">
            📌 Horario y Programación Prevista del Día
          </h3>
          <div class="sub-schedule-list">
            ${dayLessons.map(item => `
              <div class="sub-schedule-item" style="${item.isBreak ? 'border-left-color: #64748b; opacity: 0.8;' : ''}">
                <div class="sub-time">${item.time}</div>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
                    ${item.label}
                  </div>
                  ${!item.isBreak ? `
                    <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
                      <strong>Actividad programada:</strong> ${item.title}
                    </div>
                    <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                      <strong>Notas / Materiales:</strong> ${item.notes}
                    </div>
                    ${item.targetNEAE ? `
                      <div style="font-size: 0.8rem; color: #dc2626; font-weight: 600; margin-top: 4px;">
                        ⚠️ Adaptación NEAE: ${item.targetNEAE}
                      </div>
                    ` : ''}
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 2rem; background: #fff1f2; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #fecdd3;">
          <h3 style="font-family: var(--font-display); font-size: 1.05rem; color: #9f1239; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> Avisos Importantes de Alumnado (Atención NEAE)
          </h3>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #881337; display: flex; flex-direction: column; gap: 0.4rem;">
            ${neaeStudents.map(s => `
              <li><strong>${s.name} (${s.neaeType}):</strong> ${s.notes}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}

window.templatesEngine = new TemplatesEngine();
