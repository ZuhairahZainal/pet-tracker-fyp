import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  changeAddress ={
    addressId: '',
    userId: '',
    num: '',
    simpang: '',
    kampung: '',
    postCode: '',
    cityName: '',
    countryName: '',
  }

  addressDetailForm: FormGroup;
  userId: any;


  constructor(private firestore: AngularFirestore,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private router: Router) { }


  ngOnInit() {
      this.getUserId()
      this.addressDetailForm = new FormGroup({
      num: new FormControl(this.changeAddress.num,[Validators.required]),
      simpang: new FormControl(this.changeAddress.simpang,[Validators.required]),
      kampung: new FormControl(this.changeAddress.kampung,[ Validators.required]),
      postCode: new FormControl(this.changeAddress.postCode,[Validators.required]),
      cityName: new FormControl(this.changeAddress.cityName,[Validators.required]),
      countryName: new FormControl (this.changeAddress.countryName,[Validators.required]),
    });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.changeAddress.userId = `${user.uid}`;
    this.userId = user.uid;
  }

  async newAddress(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.changeAddress.addressId = this.firestore.createId();
    this.changeAddress.num = this.addressDetailForm.get('num').value;
    this.changeAddress.simpang = this.addressDetailForm.get('simpang').value;
    this.changeAddress.kampung = this.addressDetailForm.get('kampung').value;
    this.changeAddress.postCode = this.addressDetailForm.get('postCode').value;
    this.changeAddress.cityName = this.addressDetailForm.get('cityName').value;
    this.changeAddress.countryName = this.addressDetailForm.get('countryName').value;
  //this.firestore.collection('address').doc(this.changeAddress,userId)
  //.collection('address').doc(this.changeAddress.userId)
  // .set(this.changeAddress);

  this.firestore.collection('sale').doc(this.changeAddress.userId)
  .collection('newaddressDetails').doc(this.changeAddress.addressId)
  .set(this.changeAddress)

  .then(
    () => {
      loading.dismiss().then(() => {
        this.router.navigateByUrl('/tab/timeline/sales/cart/checkout');
      });
    },
    error => {
      loading.dismiss().then(() => {
        console.error(error);
      });
    }
  );

  }

}
