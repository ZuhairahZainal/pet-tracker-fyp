import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

num: number;
simpang: number;
kampung: string;
postCode: string;
cityName: string;
countryName: string;


public changeAddressForm: FormGroup;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formbuilder: FormBuilder,
    private router: Router
  // eslint-disable-next-line no-trailing-spaces
  ) {
    this.changeAddressForm = formbuilder.group({
      num: ['', Validators.required],
      simpang: ['', Validators.required],
      kampung: ['', Validators.required],
      postCode:['', Validators.required],
      cityName: ['', Validators.required],
      countryName: ['', Validators.required]
    });

  }
  async newAddress(){
    const loading = await this.loadingCtrl.create();
    const num = this.changeAddressForm.value.num;
    const simpang = this.changeAddressForm.value.simpang;
    const kampung = this.changeAddressForm.value.kampung;
    const postCode = this.changeAddressForm.value.postCode;
    const cityName = this.changeAddressForm.value.cityName;
    const countryName = this.changeAddressForm.value.countryName;

    return await loading.present();

  }

  ngOnInit() {
  }

}
