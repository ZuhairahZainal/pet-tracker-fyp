import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from 'src/app/models/pet/pet';
import { PetService } from 'src/app/services/pet/pet.service';
import firebase from 'firebase'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.page.html',
  styleUrls: ['./manage-device.page.scss'],
})
export class ManageDevicePage implements OnInit {

  device: Observable<Device[]>;
  userId: any;

  userScanDetails = {
    userPhone: null,
    scanId: '',
    userName: '',
  }

  scanId: string;
  scanDetailForm: FormGroup;

  constructor(private petService: PetService,
              private firestore: AngularFirestore,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private router: Router) {
    }

  ngOnInit() {
    this.getUserId();

    this.device = this.petService.getDevices(this.userId);

    this.scanDetailForm = new FormGroup({
      name: new FormControl(this.userScanDetails.userName,[
        Validators.required,
        Validators.minLength(2),
      ]),
      phone: new FormControl(this.userScanDetails.userPhone,[
        Validators.required,
        Validators.pattern('[- +()0-9]+')
      ]),
    })

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;

  }

  deleteDevice(id){
    this.petService.deleteDevice(this.userId, id);
  }


  async getScanDetail(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.userScanDetails.scanId = this.firestore.createId();
    this.userScanDetails.userName = this.scanDetailForm.get('name').value;
    this.userScanDetails.userPhone = Number(this.scanDetailForm.get('phone').value);

    this.firestore.collection('QR-code').doc(this.userScanDetails.scanId)
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
          });
        },
        error => {
         loading.dismiss().then(() => {
           console.error();
         });
      });
  }

}


