import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from 'src/app/services/pet/pet.service';
import firebase from 'firebase'
import { Device } from 'src/app/models/pet/pet';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.page.html',
  styleUrls: ['./edit-device.page.scss'],
})
export class EditDevicePage implements OnInit {

  id: string;
  deviceForm: FormGroup;
  userId: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private deviceService: PetService) {

      this.deviceForm = this.formBuilder.group({
        deviceName: new FormControl('', Validators.required),
        deviceDescription: new FormControl('', Validators.required)
      });
     }

  ngOnInit() {
    this.getUserId();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

      //Display the existing device on form
    this.deviceService.getDevice(this.userId, this.id)
    .subscribe(data => {
      this.deviceForm = this.formBuilder.group({
        deviceName: new FormControl (data.deviceName,
          Validators.required),
        deviceDescription: new FormControl(data.deviceDescription,
          Validators.required)
      });
    });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = `${user.uid}`;
  }

  //Save the changes function. Unfortunately it unable to activate due to error.
  onSubmit(){
    const device: Device = Object.assign({}, this.deviceForm.value);
    this.deviceService.updateDevice(this.userId, this.id, device)
    .then(() =>{
      this.router.navigate(['/tab/location-tracker/manage-device']);
    });
  }
}
