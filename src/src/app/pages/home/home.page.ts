
import { Component, inject } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { Alert } from '../services/alert';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private alertService = inject(Alert);

  public task: string = '';

  public tasks: string[] = [
    'Comprar leche',
    'Dormir',
    'Descansar',
    'Estudiar',
    'Ver la novela',
  ];

  constructor() {
    addIcons({
      addOutline,
      trashOutline,
    });

    this.loadTasks();
  }

  async addTask(): Promise<void> {
    const newTask = this.task.trim();

    if (!newTask) {
      await this.alertService.alertMessage(
        'Error',
        'Registro de tareas',
        'Escribe una tarea antes de agregarla.'
      );
      return;
    }

    if (this.ifExistTask(newTask)) {
      await this.alertService.alertMessage(
        'Error',
        'Registro de tareas',
        'La tarea ya existe.'
      );
      return;
    }

    this.tasks.push(newTask);
    this.saveTasks();
    this.task = '';

    await this.alertService.alertMessage(
      'Éxito',
      'Registro de tareas',
      'La tarea se agregó correctamente.'
    );
  }

  async confirmDeleteTask(task: string): Promise<void> {
    const index = this.tasks.indexOf(task);

    if (index === -1) {
      return;
    }

    this.tasks.splice(index, 1);
    this.saveTasks();

    await this.alertService.alertMessage(
      'Éxito',
      'Registro de tareas',
      'La tarea se eliminó correctamente.'
    );
  }

  handleReorder(event: CustomEvent<ItemReorderEventDetail>): void {
    this.tasks = event.detail.complete(this.tasks);
    this.saveTasks();
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private loadTasks(): void {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks !== null) {
      try {
        const parsedTasks: unknown = JSON.parse(savedTasks);

        if (
          Array.isArray(parsedTasks) &&
          parsedTasks.every((item) => typeof item === 'string')
        ) {
          this.tasks = parsedTasks;
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    }
  }

  private ifExistTask(task: string): boolean {
    return this.tasks.some(
      (item) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );
  }
}
