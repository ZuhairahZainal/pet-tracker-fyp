import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from 'src/app/models/pet/pet';
import { PetService } from 'src/app/services/pet/pet.service';
import firebase from 'firebase'
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss'],
})
export class AddDevicePage implements OnInit {

  deviceForm: FormGroup;
  value: any;
  userId: string;
  deviceId: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private firestore: AngularFirestore,
              private petService: PetService) {

            this.deviceForm = this.formBuilder.group({
              deviceName: new FormControl('', Validators.required),
              deviceDescription: new FormControl('', Validators.required)
          });
        }

  ngOnInit() {
    this.getUserId();
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = `${user.uid}`;
  }

  onSubmit(){
    this.deviceId = this.firestore.createId();
    //use to fetch all the inputs from that deivce
    const device: Device = Object.assign({
      time: new Date().getTime(),
      date: new Date().toDateString(),
      deviceId: this.deviceId,
      userId: this.userId
    }, this.deviceForm.value);
    this.petService.addDevice(this.userId, this.deviceId, device)
    .then(()=>{
      this.router.navigateByUrl('/tab/location-tracker/manage-device');
      console.log('New Device Just Added!');
    });
  }
  //Clears all input from that form
  onReset(){
   this.deviceForm.reset();
  }


}
