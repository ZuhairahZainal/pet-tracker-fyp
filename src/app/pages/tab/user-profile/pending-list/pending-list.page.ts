import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import firebase from 'firebase/app';
import { AdoptionsRequest } from 'src/app/models/adoption/adoptions-request';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.page.html',
  styleUrls: ['./pending-list.page.scss'],
})
export class PendingListPage implements OnInit {


  public pendingList: Observable<AdoptionsRequest[]>
  userUsername: any;
  PetName: any;
  userId: any;
  petId: any;

  constructor(private adoptionService: AdoptionService) {
  }

  ngOnInit() {
    this.getUserId();
    this.pendingList = this.adoptionService.getPendingList(this.userId);
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }
}
