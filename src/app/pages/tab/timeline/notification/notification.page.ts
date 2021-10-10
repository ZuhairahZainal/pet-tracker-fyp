import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  userId: any;
  notification;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getUserId();
    this.notificationService.getNotification(this.userId).subscribe( notif => {
      this.notification = notif;

    });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }
}
