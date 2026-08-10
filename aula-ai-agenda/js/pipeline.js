/* ==========================================================================
   AulaAI - Pipeline Engine & Smart Ripple Shift Algorithm (With Undo Stack)
   ========================================================================== */

class PipelineEngine {
  constructor() {
    this.draggedCellId = null;
    this.historyStack = [];
  }

  // Get all valid lesson slots in chronological order throughout the week
  getOrderedSlots() {
    const slots = [];
    window.DAYS.forEach(day => {
      window.DEFAULT_SLOTS.forEach(slot => {
        if (!slot.isBreak) {
          slots.push({ key: `${day.id}_${slot.id}`, day: day.id, slot: slot.id });
        }
      });
    });
    return slots;
  }

  // Save current lessons state snapshot to history stack before mutating
  saveSnapshot() {
    this.historyStack.push({
      weekIndex: window.store.state.currentWeekIndex || 0,
      lessons: JSON.parse(JSON.stringify(window.store.getWeekLessons())),
    });
    if (this.historyStack.length > 20) {
      this.historyStack.shift(); // Limit stack size to 20
    }
  }

  /**
   * SMART RIPPLE SHIFT (Desplazamiento Inteligente en Cascada)
   * Shifts lesson content of sourceKey to the next occurrence of the SAME subject in the week,
   * pushing subsequent lessons down the pipeline chain.
   */
  shiftSubjectPipeline(sourceKey) {
    const weekLessons = window.store.getWeekLessons();
    const sourceLesson = weekLessons[sourceKey];
    if (!sourceLesson || !sourceLesson.subjectId) {
      this.showToast('La celda seleccionada no tiene una asignatura asignada.', 'warning');
      return;
    }

    const targetSubjectId = sourceLesson.subjectId;
    const orderedSlots = this.getOrderedSlots();

    // Find all slots in the week belonging to this subject
    const subjectSlots = orderedSlots.filter(slot => {
      const lesson = weekLessons[slot.key];
      return lesson && lesson.subjectId === targetSubjectId;
    });

    const startIndex = subjectSlots.findIndex(s => s.key === sourceKey);
    if (startIndex === -1) return;

    if (startIndex === subjectSlots.length - 1) {
      this.showToast(`Esta es la última sesión de ${window.DEFAULT_SUBJECTS[targetSubjectId].name} de la semana.`, 'info');
      return;
    }

    // Save snapshot before shifting
    this.saveSnapshot();

    // Capture original lesson contents of the subject pipeline chain
    const chainLessons = subjectSlots.slice(startIndex).map(s => {
      const les = weekLessons[s.key];
      return { ...les };
    });

    // Shift contents down by 1 position
    const affectedKeys = [];

    for (let i = subjectSlots.length - 1; i > startIndex; i--) {
      const targetKey = subjectSlots[i].key;
      const prevLessonContent = chainLessons[i - 1 - startIndex];

      window.store.updateLesson(subjectSlots[i].day, subjectSlots[i].slot, {
        title: prevLessonContent.title,
        notes: prevLessonContent.notes,
        targetNEAE: prevLessonContent.targetNEAE,
        status: 'shifted'
      });
      affectedKeys.push(targetKey);
    }

    // Reset the source cell with a clean pending slot
    window.store.updateLesson(sourceLesson.day, sourceLesson.slot, {
      title: `[Sesión reprogramada]`,
      notes: `Clase desplazada el ${new Date().toLocaleDateString('es-ES')}`,
      targetNEAE: '',
      status: 'pending'
    });
    affectedKeys.push(sourceKey);

    // Re-render and trigger visual ripple animations
    window.app.renderPlannerGrid();
    this.animateRippleShift(affectedKeys);

    this.showToast(`¡Secuencia de ${window.DEFAULT_SUBJECTS[targetSubjectId].name} reprogramada en cascada!`, 'success');
  }

  /**
   * UNDO LAST SHIFT (Dar marcha atrás al desplazamiento)
   */
  undoLastShift() {
    if (this.historyStack.length === 0) {
      this.showToast('No hay desplazamietos previos para deshacer.', 'warning');
      return;
    }

    const previous = this.historyStack.pop();
    window.store.state.weeklyLessons[previous.weekIndex] = previous.lessons;
    window.store.saveState();

    window.app.renderPlannerGrid();
    this.showToast('¡Desplazamiento deshecho correctamente! Se ha restaurado la secuencia.', 'info');
  }

  // Visual Ripple Animation for shifted elements
  animateRippleShift(cellKeys) {
    cellKeys.forEach(key => {
      const cardEl = document.querySelector(`[data-cell-id="${key}"]`);
      if (cardEl) {
        cardEl.classList.add('ripple-shifted');
        setTimeout(() => {
          cardEl.classList.remove('ripple-shifted');
        }, 1000);
      }
    });
  }

  // Setup HTML5 Drag & Drop handlers on card grid
  setupDragAndDrop() {
    document.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.class-card');
      if (card) {
        this.draggedCellId = card.dataset.cellId;
        card.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', this.draggedCellId);
      }
    });

    document.addEventListener('dragend', (e) => {
      const card = e.target.closest('.class-card');
      if (card) {
        card.classList.remove('is-dragging');
      }
      document.querySelectorAll('.planner-table td').forEach(td => td.classList.remove('drag-over'));
    });

    document.addEventListener('dragover', (e) => {
      const td = e.target.closest('.planner-table td');
      if (td && !td.classList.contains('recreo-cell')) {
        e.preventDefault();
        td.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      const td = e.target.closest('.planner-table td');
      if (td) {
        td.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', (e) => {
      const td = e.target.closest('.planner-table td');
      if (!td || !this.draggedCellId) return;

      e.preventDefault();
      td.classList.remove('drag-over');

      const targetCellId = td.dataset.targetKey;
      if (targetCellId && targetCellId !== this.draggedCellId) {
        this.swapLessons(this.draggedCellId, targetCellId);
      }
    });
  }

  // Swap two lessons directly via Drag & Drop
  swapLessons(keyA, keyB) {
    const weekLessons = window.store.getWeekLessons();
    const lessonA = { ...weekLessons[keyA] };
    const lessonB = { ...weekLessons[keyB] };

    if (!lessonA || !lessonB) return;

    this.saveSnapshot();

    window.store.updateLesson(lessonA.day, lessonA.slot, {
      title: lessonB.title,
      notes: lessonB.notes,
      targetNEAE: lessonB.targetNEAE,
      status: lessonB.status
    });

    window.store.updateLesson(lessonB.day, lessonB.slot, {
      title: lessonA.title,
      notes: lessonA.notes,
      targetNEAE: lessonA.targetNEAE,
      status: lessonA.status
    });

    window.app.renderPlannerGrid();
    this.animateRippleShift([keyA, keyB]);
    this.showToast('Clases intercambiadas correctamente.', 'info');
  }

  showToast(message, type = 'info') {
    if (window.app && window.app.showToast) {
      window.app.showToast(message, type);
    }
  }
}

window.pipelineEngine = new PipelineEngine();
