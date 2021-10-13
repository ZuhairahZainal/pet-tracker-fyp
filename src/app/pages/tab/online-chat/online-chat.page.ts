import { ChatService } from 'src/app/services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-online-chat',
  templateUrl: './online-chat.page.html',
  styleUrls: ['./online-chat.page.scss'],
})
export class OnlineChatPage implements OnInit {

  uid;
  name;
  username;
  dp;
  users = [];

  constructor(public nav: NavController) {
    this.uid = localStorage.getItem('uid');

    firebase.firestore().collection('chatUsers').doc(this.uid).get().then(userData => {
      this.name = userData.data().name;
      this.username = userData.data().username;
      this.dp = userData.data().dp;
    });

    firebase.firestore().collection('chatUsers').get().then(userData => {
      userData.forEach(childData =>{
        if(childData.data().uid !== this.uid){
          this.users.push(childData.data());
        }
      });
    });
   }

  ngOnInit() {

  }

  gotoChat(uid,name){
    sessionStorage.setItem('uid',uid);
    sessionStorage.setItem('name',name);

    this.nav.navigateForward('/convo');
  }

}
