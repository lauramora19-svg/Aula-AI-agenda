/* ==========================================================================
   AulaAI - Anual Engine (Vista Anual, Calendario 12 Meses, Festivos, Objetivos)
   ========================================================================== */

class AnualEngine {
  constructor() {}

  renderAnualView() {
    const container = document.getElementById('anual-view-container');
    if (!container) return;

    const holidays = window.store.state.holidays || [];
    const goals = window.store.state.annualGoals || [];
    const contacts = window.store.state.schoolContacts || [];
    const absences = window.store.state.absences || [];

    const completedGoals = goals.filter(g => g.done).length;
    const progressPercent = Math.round((completedGoals / (goals.length || 1)) * 100);

    container.innerHTML = `
      <!-- TOP BANNER KPI SUMMARY -->
      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-primary);">
              Año Escolar <span style="color: var(--accent-primary);">2026 - 2027</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">El año completo, de un vistazo</p>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <div class="stat-card" style="min-width: 140px; padding: 0.85rem 1.1rem;">
              <div>
                <div class="stat-label">Inicio del Curso</div>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">7 SEP 2026</div>
              </div>
            </div>

            <div class="stat-card" style="min-width: 140px; padding: 0.85rem 1.1rem;">
              <div>
                <div class="stat-label">Fin del Curso</div>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">22 JUN 2027</div>
              </div>
            </div>

            <div class="stat-card" style="min-width: 110px; padding: 0.85rem 1.1rem;">
              <div>
                <div class="stat-label">Semanas</div>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; color: var(--accent-primary);">53</div>
              </div>
            </div>

            <div class="stat-card" style="min-width: 110px; padding: 0.85rem 1.1rem;">
              <div>
                <div class="stat-label">Días Lectivos</div>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; color: #10b981;">176</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GRID LAYOUT: CALENDARIO 12 MESES & LATERAL -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;" class="anual-grid-layout">
        
        <!-- COLUMNA IZQUIERDA: CALENDARIO ANUAL DE 12 MESES -->
        <div>
          <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-calendar-days" style="color: var(--accent-primary);"></i> Calendario Anual (12 Meses)
            </h3>
            
            <div class="months-mini-grid">
              ${this.render12MonthsGrid()}
            </div>
          </div>

          <!-- TABLA CONTACTOS DEL CENTRO Y FECHAS IMPORTANTES -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            
            <!-- CONTACTOS DEL CENTRO -->
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm);">
              <h4 style="font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-address-book" style="color: var(--accent-primary);"></i> Contactos del Centro
              </h4>
              <table style="width: 100%; font-size: 0.84rem; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); text-align: left;">
                    <th style="padding: 4px 0;">Cargo</th>
                    <th style="padding: 4px 0;">Nombre</th>
                    <th style="padding: 4px 0;">Email</th>
                  </tr>
                </thead>
                <tbody>
                  ${contacts.map(c => `
                    <tr style="border-bottom: 1px dashed var(--border-color);">
                      <td style="padding: 8px 0; font-weight: 600; color: var(--text-primary);">${c.role}</td>
                      <td style="padding: 8px 0; color: var(--text-secondary);">${c.name}</td>
                      <td style="padding: 8px 0; color: var(--accent-primary); font-size: 0.78rem;">${c.email}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- SUSTITUCIONES Y AUSENCIAS -->
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm);">
              <h4 style="font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-user-clock" style="color: var(--accent-primary);"></i> Sustituciones y Ausencias
              </h4>
              <table style="width: 100%; font-size: 0.84rem; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); text-align: left;">
                    <th style="padding: 4px 0;">Fecha</th>
                    <th style="padding: 4px 0;">Tipo</th>
                    <th style="padding: 4px 0;">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${absences.map(a => `
                    <tr style="border-bottom: 1px dashed var(--border-color);">
                      <td style="padding: 8px 0; font-weight: 600; color: var(--text-primary);">${a.date}</td>
                      <td style="padding: 8px 0;"><span style="background: var(--accent-light); color: var(--accent-primary); padding: 2px 6px; border-radius: var(--radius-sm); font-size: 0.72rem; font-weight: 700;">${a.type}</span></td>
                      <td style="padding: 8px 0; color: var(--text-secondary); font-size: 0.78rem;">${a.notes}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        <!-- COLUMNA DERECHA: VACACIONES Y OBJETIVOS -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <!-- VACACIONES Y FESTIVOS -->
          <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm);">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fa-solid fa-umbrella-beach" style="color: #f59e0b;"></i> Vacaciones y Festivos
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${holidays.map(h => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-tertiary); padding: 0.65rem 0.85rem; border-radius: var(--radius-md);">
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${h.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${h.date}</div>
                  </div>
                  <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); ${h.type === 'Festivo' ? 'background: #d1fae5; color: #047857;' : 'background: #ffedd5; color: #c2410c;'}">
                    ${h.type}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- OBJETIVOS DEL AÑO -->
          <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h4 style="font-family: var(--font-display); font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="fa-solid fa-bullseye" style="color: var(--accent-primary);"></i> Objetivos del Año
              </h4>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${completedGoals}/${goals.length} (${progressPercent}%)</span>
            </div>

            <!-- BARRA DE PROGRESO -->
            <div style="height: 8px; background: var(--bg-tertiary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 1rem;">
              <div style="height: 100%; width: ${progressPercent}%; background: linear-gradient(90deg, #f97316, #fb923c); transition: width 0.4s ease;"></div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              ${goals.map((g, idx) => `
                <div style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.85rem; color: var(--text-primary); cursor: pointer;" onclick="window.anualEngine.toggleGoal('${g.id}')">
                  <span style="width: 22px; height: 22px; border-radius: var(--radius-sm); background: ${g.done ? 'var(--accent-primary)' : 'var(--bg-tertiary)'}; color: ${g.done ? 'white' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; transition: all 0.2s;">
                    ${idx + 1}
                  </span>
                  <span style="${g.done ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${g.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // Render 12 months mini calendars
  render12MonthsGrid() {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return monthNames.map((month, idx) => `
      <div class="month-card" onclick="window.anualEngine.jumpToMonth(${idx})">
        <div class="month-title">${month}</div>
        <div class="month-days-grid">
          <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span class="weekend">6</span><span class="weekend">7</span>
          <span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span class="weekend">13</span><span class="weekend">14</span>
          <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span class="weekend">20</span><span class="weekend">21</span>
          <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span class="weekend">27</span><span class="weekend">28</span>
        </div>
      </div>
    `).join('');
  }

  toggleGoal(goalId) {
    window.store.toggleGoal(goalId);
    this.renderAnualView();
  }

  jumpToMonth(monthIndex) {
    // Jump to corresponding week index approx
    const targetWeek = Math.min(Math.max(monthIndex * 4, 0), 51);
    window.store.state.currentWeekIndex = targetWeek;
    window.store.saveState();

    window.app.switchView('horario');
    window.app.updateDateMotorUI();
    window.app.renderPlannerGrid();
    window.app.showToast(`Navegando al mes seleccionado (Semana ${targetWeek + 1})...`, 'info');
  }
}

window.anualEngine = new AnualEngine();
