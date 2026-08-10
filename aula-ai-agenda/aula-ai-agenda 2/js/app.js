/* ==========================================================================
   AulaAI - App Controller Main Script
   ========================================================================== */

class AppController {
  constructor() {
    this.activeCellKey = null;
    this.init();
  }

  init() {
    this.applyTheme();
    this.renderPlannerGrid();
    this.updateDateMotorUI();
    this.setupEventListeners();
    window.pipelineEngine.setupDragAndDrop();
    window.alumnoEngine.renderStudentsList();
    window.templatesEngine.renderTemplatesGrid();
    window.templatesEngine.renderSubstitutionFolder();
  }

  // Apply Light/Dark mode
  applyTheme() {
    if (window.store.state.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTheme() {
    window.store.state.darkMode = !window.store.state.darkMode;
    window.store.saveState();
    this.applyTheme();
    this.showToast(`Modo ${window.store.state.darkMode ? 'oscuro' : 'claro'} activado`, 'info');
  }

  // Date Motor UI Update
  updateDateMotorUI() {
    const weekIndex = window.store.state.currentWeekIndex || 0;
    const weekText = window.dateEngine.getWeekFormattedString(weekIndex);
    const trimesterText = window.dateEngine.getTrimester(weekIndex);

    const weekLabelEl = document.getElementById('current-week-label');
    if (weekLabelEl) weekLabelEl.innerText = `Semana ${weekIndex + 1}: ${weekText}`;

    const trimesterTagEl = document.getElementById('trimester-tag-label');
    if (trimesterTagEl) trimesterTagEl.innerText = trimesterText;

    // Update Th headers with calculated day dates
    const dayDates = window.dateEngine.getDayDates(weekIndex);
    window.DAYS.forEach(day => {
      const thSub = document.getElementById(`day-date-${day.id}`);
      if (thSub) {
        thSub.innerText = dayDates[day.id];
      }
    });
  }

  navigateWeek(direction) {
    // Navegación libre, sin límite inferior ni superior de semanas
    const newIndex = (window.store.state.currentWeekIndex || 0) + direction;

    window.store.state.currentWeekIndex = newIndex;
    window.store.saveState();
    this.updateDateMotorUI();
    this.renderPlannerGrid();
  }

  // Render Timetable Planner Grid
  renderPlannerGrid() {
    const tbody = document.getElementById('planner-tbody');
    if (!tbody) return;

    let html = '';

    window.DEFAULT_SLOTS.forEach(slot => {
      if (slot.isBreak) {
        // Recreo / Break Row
        html += `
          <tr class="recreo-row">
            <td class="time-slot-cell">
              <span class="time-slot-label">${slot.label}</span>
              <span class="time-slot-sub">${slot.time}</span>
            </td>
            <td colspan="5" class="recreo-cell">
              ☕ ${slot.label} — Tiempo de patio y descanso
            </td>
          </tr>
        `;
      } else {
        html += `
          <tr>
            <td class="time-slot-cell">
              <span class="time-slot-label">${slot.label}</span>
              <span class="time-slot-sub">${slot.time}</span>
            </td>
        `;

        window.DAYS.forEach(day => {
          const cellKey = `${day.id}_${slot.id}`;
          const lesson = window.store.getLesson(day.id, slot.id);
          const subj = lesson ? window.DEFAULT_SUBJECTS[lesson.subjectId] : null;

          if (lesson && subj) {
            let statusClass = 'status-pending';
            let statusText = 'Pendiente';
            if (lesson.status === 'done') { statusClass = 'status-done'; statusText = 'Impartida'; }
            if (lesson.status === 'shifted') { statusClass = 'status-shifted'; statusText = 'Reprogramada'; }

            html += `
              <td data-target-key="${cellKey}">
                <div class="class-card ${subj.colorClass}" data-cell-id="${cellKey}" draggable="true" onclick="window.app.openExpandedLessonModal('${cellKey}')">
                  <div class="card-header">
                    <span class="subject-badge">
                      <i class="fa-solid ${subj.icon}"></i> ${subj.name}
                    </span>
                    <span class="group-badge">${lesson.group || 'Sin grupo'}</span>
                  </div>

                  <div class="card-body">
                    <div class="lesson-title">${lesson.title || 'Práctica programada'}</div>
                    <div class="lesson-notes-snippet">${lesson.notes || ''}</div>
                  </div>

                  <div class="card-footer">
                    <span class="status-pill ${statusClass}">
                      <i class="fa-solid fa-circle" style="font-size: 0.45rem;"></i> ${statusText}
                    </span>
                    <div style="display: flex; gap: 4px;">
                      <button class="btn-undo-pipeline" title="Dar marcha atrás / Deshacer desplazamiento" onclick="event.stopPropagation(); window.pipelineEngine.undoLastShift()">
                        <i class="fa-solid fa-rotate-left"></i>
                      </button>
                      <button class="btn-shift-pipeline" title="Desplazar al siguiente día de ${subj.name} (Ripple Shift)" onclick="event.stopPropagation(); window.pipelineEngine.shiftSubjectPipeline('${cellKey}')">
                        <i class="fa-solid fa-forward-step"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            `;
          } else {
            // Empty Cell
            html += `
              <td data-target-key="${cellKey}">
                <div class="class-card" style="border: 1px dashed var(--border-color); justify-content: center; align-items: center; color: var(--text-muted);" onclick="window.app.openExpandedLessonModal('${cellKey}')">
                  <i class="fa-solid fa-plus" style="font-size: 1.2rem;"></i>
                  <span style="font-size: 0.78rem; font-weight: 600; margin-top: 4px;">Añadir clase</span>
                </div>
              </td>
            `;
          }
        });

        html += `</tr>`;
      }
    });

    tbody.innerHTML = html;
  }

  // Open Lesson Expanded Detail Modal
  openExpandedLessonModal(cellKey) {
    this.activeCellKey = cellKey;
    const lesson = window.store.getWeekLessons()[cellKey] || {
      day: cellKey.split('_')[0],
      slot: cellKey.split('_')[1],
      subjectId: 'MATES',
      group: '',
      title: '',
      notes: '',
      targetNEAE: '',
      status: 'pending'
    };

    const subj = window.DEFAULT_SUBJECTS[lesson.subjectId] || window.DEFAULT_SUBJECTS.MATES;

    document.getElementById('modal-lesson-title-display').innerText = `Detalle de Clase — ${subj.name}`;
    document.getElementById('modal-subject-select').value = lesson.subjectId || 'MATES';
    document.getElementById('modal-group-input').value = lesson.group || '';
    document.getElementById('modal-title-input').value = lesson.title || '';
    document.getElementById('modal-notes-input').value = lesson.notes || '';
    document.getElementById('modal-neae-input').value = lesson.targetNEAE || '';
    document.getElementById('modal-status-select').value = lesson.status || 'pending';

    this.openModal('modal-lesson');
  }

  saveLessonFromModal() {
    if (!this.activeCellKey) return;
    const [day, slot] = this.activeCellKey.split('_');

    const subjectId = document.getElementById('modal-subject-select').value;
    const group = document.getElementById('modal-group-input').value.trim();
    const title = document.getElementById('modal-title-input').value.trim();
    const notes = document.getElementById('modal-notes-input').value.trim();
    const targetNEAE = document.getElementById('modal-neae-input').value.trim();
    const status = document.getElementById('modal-status-select').value;

    window.store.updateLesson(day, slot, {
      subjectId, group, title, notes, targetNEAE, status
    });

    this.renderPlannerGrid();
    this.closeModal('modal-lesson');
    this.showToast('Programación de clase guardada correctamente.', 'success');
  }

  // View Navigation Tabs Switcher
  switchView(viewId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active-view'));

    const activeNav = document.querySelector(`[data-view-target="${viewId}"]`);
    if (activeNav) activeNav.classList.add('active');

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add('active-view');

    // Page Heading text
    const headings = {
      'horario': 'Programación Semanal & Pipeline',
      'anual': 'Vista Anual (12 Meses, Festivos y Objetivos)',
      'clases': 'Mis Clases & Plano de Aula',
      'alumnado': 'Fichas de Alumnado & Atención NEAE',
      'mensajes': 'Banco de Mensajes a Familias',
      'sustitucion': 'Carpeta de Sustitución'
    };
    const titleEl = document.getElementById('page-title-heading');
    if (titleEl) titleEl.innerText = headings[viewId] || 'AulaAI';

    if (viewId === 'anual') {
      window.anualEngine.renderAnualView();
    }
    if (viewId === 'clases') {
      window.clasesEngine.renderClasesView();
    }
    if (viewId === 'sustitucion') {
      window.templatesEngine.renderSubstitutionFolder();
    }
  }

  // Zoom & View Mode Controls
  setGridMode(mode) {
    const gridWrapper = document.getElementById('planner-grid-wrapper');
    if (!gridWrapper) return;

    gridWrapper.classList.remove('mode-compact', 'mode-expanded');
    if (mode === 'compact') gridWrapper.classList.add('mode-compact');
    if (mode === 'expanded') gridWrapper.classList.add('mode-expanded');

    document.querySelectorAll('.view-mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');
  }

  setZoomScale(val) {
    const gridWrapper = document.getElementById('planner-grid-wrapper');
    if (gridWrapper) {
      gridWrapper.style.transform = `scale(${val})`;
      gridWrapper.style.transformOrigin = 'top left';
    }
  }

  // Modal Dialog Utils
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // Toast System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  setupEventListeners() {
    // Zoom Slider Listener
    const zoomInput = document.getElementById('zoom-slider');
    if (zoomInput) {
      zoomInput.addEventListener('input', (e) => this.setZoomScale(e.target.value));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
