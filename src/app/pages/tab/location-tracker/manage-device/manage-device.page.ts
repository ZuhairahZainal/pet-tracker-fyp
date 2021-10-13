import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from 'src/app/models/pet/pet';
import { PetService } from 'src/app/services/pet/pet.service';
import firebase from 'firebase'

@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.page.html',
  styleUrls: ['./manage-device.page.scss'],
})
export class ManageDevicePage implements OnInit {

  device: Observable<Device[]>;
  userId: any;

  constructor(
    private petService: PetService) {
    }

  ngOnInit() {
    this.getUserId();

    this.device = this.petService.getDevices(this.userId);

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  deleteDevice(id){
    this.petService.deleteDevice(this.userId, id);
  }

}


