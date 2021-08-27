import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {

firstName: string;
lastName: string;
creditCardNumber: number;
cvv: number;
expiration: Date;

public cardDetailsForm: FormGroup;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formbuilder: FormBuilder,
    private router: Router
  ) {
    this.cardDetailsForm = formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      creditCardNumber: ['', Validators.required],
      cvv:['', Validators.required],
      expiration: ['', Validators.required],
   });
  }
  async newCard(){
    const loading = await this.loadingCtrl.create();
    const firstName = this.cardDetailsForm.value.num;
    const lastName = this.cardDetailsForm.value.simpang;
    const creditCardNumber = this.cardDetailsForm.value.kampung;
    const cvv = this.cardDetailsForm.value.postCode;
    const expiration = this.cardDetailsForm.value.cityName;
    return await loading.present();

  }

  ngOnInit() {
  }

}
