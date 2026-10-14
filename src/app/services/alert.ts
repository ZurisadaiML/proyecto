import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private alertController = inject(AlertController);

  // Alerta simple de mensajes (para éxito o error)
  async alertMessage(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Alerta de confirmación (la que usa el botón de borrar)
  async alertConfirm(
    header: string,
    subHeader: string,
    message: string,
    callback: () => void
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            // Ejecuta la función que le pasamos (en este caso, deleteTask)
            callback();
          },
        },
      ],
    });

    await alert.present();
  }
}