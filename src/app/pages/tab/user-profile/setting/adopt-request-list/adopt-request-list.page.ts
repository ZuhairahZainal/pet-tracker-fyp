import { Component, OnInit } from '@angular/core';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import firebase from 'firebase/app';
import { AdoptionsRequest } from 'src/app/models/adoption/adoptions-request';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-adopt-request-list',
  templateUrl: './adopt-request-list.page.html',
  styleUrls: ['./adopt-request-list.page.scss'],
})
export class AdoptRequestListPage implements OnInit {

  public applicationList: Observable<AdoptionsRequest[]>
  userUsername: any;
  ownerUsername: any;
  PetName: any;
  userId: any;
  petId: any;

  constructor(private adoptionService: AdoptionService) {}

  ngOnInit() {
    this.getUserId();
    this.applicationList = this.adoptionService.getApplicationList(this.userId);

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }
}
