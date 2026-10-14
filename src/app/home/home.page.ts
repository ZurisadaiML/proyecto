import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonReorderGroup,
  IonReorder,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  ItemReorderEventDetail,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Alert } from '../services/alert';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonReorderGroup,
    IonReorder,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    FormsModule,
  ],
})
export class HomePage {
  private alertService: Alert = inject(Alert);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public task: string = '';
  public tasks: string[] = [];

  constructor() {
    addIcons({
      addOutline,
      trashOutline,
    });
  }

  // Carga usando .then() en lugar de async/await
  ionViewWillEnter() {
    Preferences.get({ key: 'tasks' }).then(({ value }) => {
      if (value) {
        this.tasks = JSON.parse(value);
        this.cdr.detectChanges();
      } else {
        this.tasks = [
          'Comprar Leche',
          'Dormir',
          'Descansar',
          'Estudiar',
          'Ver la Novela',
        ];
        this.saveTasksToPreferences();
      }
    });
  }

  // Método para guardar
  saveTasksToPreferences() {
    Preferences.set({
      key: 'tasks',
      value: JSON.stringify(this.tasks),
    });
  }

  // --- REORDER ---
  handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const itemMoved = this.tasks.splice(event.detail.from, 1)[0];
    this.tasks.splice(event.detail.to, 0, itemMoved);
    event.detail.complete();
    this.saveTasksToPreferences();
  }

  // --- MÉTODOS DE TAREAS ---
  ifExistTask(task: string): boolean {
    return this.tasks.some(
      (item) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );
  }

  addTask() {
    if (!this.task.trim()) return;

    if (!this.ifExistTask(this.task)) {
      this.tasks.push(this.task);
      this.saveTasksToPreferences();
      this.task = '';
      this.cdr.markForCheck();
      this.alertService.alertMessage(
        'Exito',
        'Registro de Tareas',
        'La tarea se ha agregado correctamente'
      );
    } else {
      this.alertService.alertMessage(
        'Error',
        'Registro de Tareas',
        'La tarea ya existe'
      );
    }
  }

  confirmDeleteTask(task: string) {
    this.alertService.alertConfirm(
      'Confirmar',
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      () => {
        this.deleteTask(task);
      }
    );
  }

  private deleteTask(task: string) {
    const index = this.tasks.findIndex(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );
    
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasksToPreferences();
      this.cdr.detectChanges();
    }
  }
}