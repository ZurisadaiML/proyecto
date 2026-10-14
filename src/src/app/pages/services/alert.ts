import { Injectable, inject } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class Alert {
  private alertController = inject(AlertController);

  async alertMessage(
    header: string,
    subHeader: string,
    message: string
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message
    });

    await alert.present();
  }

  async alertConfirm(
    header: string,
    subHeader: string,
    message: string,
    functionOk: (value: any) => boolean | void | Promise<boolean | void>,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Aceptar'
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel'
        },
        {
          text: confirmText,
          handler: functionOk
        }
      ]
    });

    await alert.present();
  }
  }