import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/app'

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {

  userScanDetails = {
    userPhone: null,
    scanId: '',
    userName: '',
  }

  userId: any;

  scanId: string;
  scanDetailForm: FormGroup;

  scanDetails;
  qrCode;

  constructor(private firestore: AngularFirestore,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private router: Router) {


              }

  ngOnInit() {
    this.getUserId();

    this.firestore.collection('users').doc(this.userId).collection('qr-details').valueChanges().subscribe( details => {
      this.scanDetails = details;

      this.qrCode = JSON.stringify(this.scanDetails);
    })

    this.scanDetailForm = new FormGroup({
      userName: new FormControl(this.userScanDetails.userName,[
        Validators.required,
        Validators.minLength(2),
      ]),
      userPhone: new FormControl(this.userScanDetails.userPhone,[
        Validators.required,
        Validators.pattern('[- +()0-9]+')
      ]),
    })
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;

  }

  async getScanDetail(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.userScanDetails.scanId = this.firestore.createId();
    this.userScanDetails.userName = this.scanDetailForm.get('userName').value;
    this.userScanDetails.userPhone = Number(this.scanDetailForm.get('userPhone').value);

    this.firestore.collection('users').doc(this.userId).collection('qr-details').doc(this.userScanDetails.scanId)
    .set(this.userScanDetails)
    .then( async success => {
        let alert = await this.alertCtrl.create({
          header: 'Scan Details added',
          message: 'Your QR code is generated.',
          buttons: [{
            text: 'OK'
          }]
        });
        alert.present();
        loading.dismiss().then(() => {
          this.scanDetailForm = null;
          this.router.navigateByUrl('/tab/location-tracker/manage-device/qr-code');
          });
        },
        error => {
         loading.dismiss().then(() => {
           console.error();
         });
      });
  }

  deleteQR(id: string){
    this.firestore.collection('users').doc(this.userId).collection('qr-details').doc(id).delete();
    this.router.navigateByUrl('/tab/location-tracker/manage-device');
  }

}
