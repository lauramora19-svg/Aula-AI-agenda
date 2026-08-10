/* ==========================================================================
   AulaAI - Student Engine (Fichas de Alumnado, NEAE & Observaciones)
   ========================================================================== */

class AlumnoEngine {
  constructor() {}

  renderStudentsList(filterNEAEOnly = false) {
    const container = document.getElementById('students-grid-container');
    if (!container) return;

    let students = window.store.state.students || [];
    if (filterNEAEOnly) {
      students = students.filter(s => s.neae);
    }

    if (students.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fa-solid fa-user-graduate" style="font-size: 2.5rem; margin-bottom: 0.75rem;">
          </i>
          <p>No se encontraron fichas de alumnado en este filtro.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = students.map(student => `
      <div class="student-card" data-student-id="${student.id}">
        <div class="student-header">
          <div class="student-avatar">
            ${student.name.split(' ').map(n => n[0]).slice(0,2).join('')}
          </div>
          <div style="flex:1;">
            <div class="student-info-name">${student.name}</div>
            <div class="student-info-course">${student.group ? `Grupo ${student.group}` : 'Sin grupo asignado'}</div>
          </div>
          ${student.neae ? `<span class="neae-badge"><i class="fa-solid fa-star"></i> NEAE</span>` : ''}
        </div>
        
        ${student.neae ? `
          <div style="font-size: 0.8rem; font-weight: 600; color: #dc2626; background: #fef2f2; padding: 4px 8px; border-radius: var(--radius-sm);">
            <i class="fa-solid fa-triangle-exclamation"></i> ${student.neaeType}
          </div>
        ` : ''}

        <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4;">
          <strong>Pautas / Adaptación:</strong> ${student.notes || 'Sin observaciones específicas.'}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Media: <strong>${student.gradeAvg ?? '—'}</strong></span>
          <button class="btn btn-outline btn-icon-only" onclick="window.alumnoEngine.openEditStudentModal('${student.id}')" title="Editar Ficha">
            <i class="fa-solid fa-pen"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  openEditStudentModal(studentId) {
    // Si no hay studentId, es un alumno NUEVO: abrimos el formulario en blanco
    // (antes esto cortaba en seco y el botón "Nuevo Alumno" no hacía nada)
    const student = studentId ? window.store.state.students.find(s => s.id === studentId) : null;

    document.getElementById('edit-student-id').value = student ? student.id : '';
    document.getElementById('edit-student-name').value = student ? student.name : '';
    document.getElementById('edit-student-group').value = student ? student.group : '';
    document.getElementById('edit-student-neae').checked = student ? !!student.neae : false;
    document.getElementById('edit-student-neaetype').value = student ? (student.neaeType || '') : '';
    document.getElementById('edit-student-notes').value = student ? (student.notes || '') : '';

    window.app.openModal('modal-student');
  }

  saveStudentFromModal() {
    const id = document.getElementById('edit-student-id').value;
    const name = document.getElementById('edit-student-name').value.trim();
    const group = document.getElementById('edit-student-group').value;
    const neae = document.getElementById('edit-student-neae').checked;
    const neaeType = document.getElementById('edit-student-neaetype').value.trim();
    const notes = document.getElementById('edit-student-notes').value.trim();

    if (!name) {
      window.app.showToast('Por favor introduce el nombre del alumno/a', 'warning');
      return;
    }

    const idx = window.store.state.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      window.store.state.students[idx] = {
        ...window.store.state.students[idx],
        name, group, neae, neaeType, notes
      };
    } else {
      window.store.state.students.push({
        id: `STU-${Date.now()}`,
        name, group, neae, neaeType, notes, behavior: '', gradeAvg: null
      });
    }

    window.store.saveState();
    this.renderStudentsList();
    window.app.closeModal('modal-student');
    window.app.showToast('Ficha de alumnado guardada con éxito.', 'success');
  }
}

window.alumnoEngine = new AlumnoEngine();
