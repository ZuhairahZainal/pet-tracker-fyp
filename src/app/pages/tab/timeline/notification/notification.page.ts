import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestResult } from 'src/app/models/notification/request-result';
import { NotificationService } from 'src/app/services/notification/notification.service';
import firebase from 'firebase/app';
import { RequestRequest } from 'src/app/models/notification/request-request';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  public adoptionResults: Observable<RequestResult[]>
  userId: any;
  public adoptionRequests: Observable<RequestRequest[]>;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getUserId();
    this.adoptionResults = this.notificationService.getAdoptionResults(this.userId);

    this.adoptionRequests = this.notificationService.getAdoptionRequest(this.userId);

  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }
}
