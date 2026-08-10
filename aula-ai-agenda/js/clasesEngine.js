/* ==========================================================================
   AulaAI - Clases Engine (Mis Clases, Plano de Aula / Asientos & Conducta)
   ========================================================================== */

class ClasesEngine {
  constructor() {
    this.activeTabModal = 'academico';
  }

  renderClasesView() {
    const container = document.getElementById('clases-view-container');
    if (!container) return;

    const classes = window.store.state.classes || [];
    const selectedClassId = window.store.state.selectedClassId || '2A-CIENCIAS';
    const students = window.store.state.students || [];
    const seating = window.store.state.seating || [];

    const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

    container.innerHTML = `
      <!-- TOP: TARJETAS DE MIS CLASES / GRUPOS -->
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem;">
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-primary);">
            <i class="fa-solid fa-chalkboard" style="color: var(--accent-primary);"></i> Mis Clases y Grupos
          </h3>
          <button class="btn btn-secondary" onclick="window.app.showToast('Función para crear nuevo grupo añadida', 'info')">
            <i class="fa-solid fa-plus"></i> Añadir Clase
          </button>
        </div>

        <div class="classes-cards-grid">
          ${classes.map(cls => `
            <div class="class-group-card ${cls.id === selectedClassId ? 'active-group' : ''}" onclick="window.clasesEngine.selectGroup('${cls.id}')">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; color: var(--text-primary);">
                ${cls.name.split(' - ')[0]}
              </div>
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
                ${cls.subject}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                <i class="fa-solid fa-users"></i> ${cls.count} alumnos
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- MAIN DUAL SECTION: PLANO DE AULA (ASIENTOS) & TABLA DE ALUMNADO CON CONDUCTA -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" class="clases-main-grid">
        
        <!-- PLANO DE AULA INTERACTIVO (MAPA DE ASIENTOS) -->
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-vector-square" style="color: var(--accent-primary);"></i> Plano de Aula ${activeClass ? activeClass.name : ''}
            </h4>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Haz clic en un pupitre para cambiar de asiento</span>
          </div>

          <!-- BLACKBOARD / PIZARRA HEADER -->
          <div class="blackboard-header">
            <i class="fa-solid fa-chalkboard-user"></i> PIZARRA DEL AULA
          </div>

          <!-- DESKS GRID (LAYOUT DE ASIENTOS DE ALUMNOS) -->
          <div class="seating-desks-grid">
            ${seating.map(seat => {
              const student = students.find(s => s.id === seat.studentId) || { name: seat.studentName, neae: false };
              return `
                <div class="seat-desk-card ${student.neae ? 'seat-neae' : ''}" onclick="window.clasesEngine.openStudentDetailModal('${seat.studentId}')">
                  <div class="seat-avatar">${student.name[0]}</div>
                  <div class="seat-name">${student.name.split(' ')[0]}</div>
                  ${student.neae ? '<span class="seat-neae-tag">NEAE</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- LISTA DE ALUMNADO Y CONDUCTA -->
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-primary);">
                Lista ${activeClass ? activeClass.name : ''}
              </h4>
            </div>

            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); text-align: left;">
                  <th style="padding: 6px 0;">Nº</th>
                  <th style="padding: 6px 0;">Nombre</th>
                  <th style="padding: 6px 0;">NEAE</th>
                  <th style="padding: 6px 0;">Cumpleaños</th>
                  <th style="padding: 6px 0;">Conducta</th>
                </tr>
              </thead>
              <tbody>
                ${students.slice(0, 7).map((s, idx) => `
                  <tr style="border-bottom: 1px dashed var(--border-color); cursor: pointer;" onclick="window.clasesEngine.openStudentDetailModal('${s.id}')">
                    <td style="padding: 8px 0; font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
                    <td style="padding: 8px 0; font-weight: 600; color: var(--text-primary);">${s.name}</td>
                    <td style="padding: 8px 0;">${s.neae ? `<span class="neae-badge" style="font-size: 0.68rem;">NEAE</span>` : '—'}</td>
                    <td style="padding: 8px 0; color: var(--text-secondary);">${s.birthday || '12/04'}</td>
                    <td style="padding: 8px 0;">
                      <span class="behavior-pill behavior-${(s.behavior || 'Excelente').toLowerCase().replace(' ', '-')}">
                        ${s.behavior || 'Excelente'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- WIDGETS INFERIORES: CUMPLEAÑOS Y NOTAS DE CONDUCTA -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            
            <!-- CUMPLEAÑOS -->
            <div style="background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.3rem;">
                <i class="fa-solid fa-cake-candles" style="color: var(--accent-primary);"></i> Próximos Cumpleaños
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 2px;">
                <div>🎂 <strong>Ana García:</strong> 12 Abril</div>
                <div>🎂 <strong>Carla Torres:</strong> 21 Febrero</div>
              </div>
            </div>

            <!-- ESCALA DE CONDUCTA -->
            <div style="background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-md);">
              <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.3rem;">
                <i class="fa-solid fa-face-smile" style="color: #10b981;"></i> Escala de Conducta
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; font-size: 0.7rem;">
                <span class="behavior-pill behavior-excelente">Excelente</span>
                <span class="behavior-pill behavior-bueno">Bueno</span>
                <span class="behavior-pill behavior-correcta">Correcta</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  selectGroup(classId) {
    window.store.state.selectedClassId = classId;
    window.store.saveState();
    this.renderClasesView();
  }

  openStudentDetailModal(studentId) {
    const student = window.store.state.students.find(s => s.id === studentId) || window.store.state.students[0];
    if (!student) return;

    document.getElementById('full-student-name').innerText = student.name;
    document.getElementById('full-student-group').innerText = `Grupo ${student.group}`;
    document.getElementById('full-student-avatar-letter').innerText = student.name[0];
    document.getElementById('full-student-birthday').innerText = student.birthday || '12/04/2015';
    document.getElementById('full-student-parent').innerText = student.parentName || 'Laura Martín';
    document.getElementById('full-student-phone').innerText = student.parentPhone || '652 123 456';
    document.getElementById('full-student-email').innerText = student.parentEmail || 'familia.garcia@email.com';
    document.getElementById('full-student-notes').innerText = student.notes || 'Alumna responsable y participativa.';

    window.app.openModal('modal-student-full');
  }
}

window.clasesEngine = new ClasesEngine();
