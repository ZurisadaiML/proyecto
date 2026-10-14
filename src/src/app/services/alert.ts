import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private alertController: AlertController = inject(AlertController);

  async alertMessage(
    header: string,
    subHeader: string,
    message: string
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async alertConfirm(
    header: string,
    subHeader: string,
    message: string,
    confirmText: string = 'Aceptar',
    functionOk?: () => void
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            if (functionOk) {
              functionOk();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}