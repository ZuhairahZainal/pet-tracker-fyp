import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';

@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.page.html',
  styleUrls: ['./manage-device.page.scss'],
})
export class ManageDevicePage implements OnInit {

  deviceDetails = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    deviceId: '',
    deviceName: '',
    userId: '',
    userName: ''
  }

  userId: string;

  constructor(private alertCtrl: AlertController,
              private firestore: AngularFirestore) { }

  ngOnInit() {
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.deviceDetails.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
      this.deviceDetails.userName = userDetail['name'];
    })
  }

  async addDevice(){
    let alert = await this.alertCtrl.create({
      header: 'Add New Device',
      subHeader: 'Please Enter Your Device Name',
      message: 'Enter your favorate place',
      inputs: [
        {
          name: 'deviceName',
          placeholder: 'Enter the device name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Add',
          handler: data => this.saveDevice(data.deviceName)
        }
      ]
    })
    alert.present();
  }

  saveDevice(deviceName: string){
    this.deviceDetails.deviceId =  this.firestore.createId();
    this.deviceDetails.deviceName = deviceName;

    this.firestore.collection('users').doc(this.userId).collection('devices').doc(this.deviceDetails.deviceId).set(this.deviceDetails)

    .then( async success => {
      let alert = await this.alertCtrl.create({
        header: 'Device Added',
        message: `Your device (${deviceName}) is added.`,
        buttons: [{
          text: 'OK'
        }]
      });
      alert.present();
    })
  }


}


