import { FriendlistService } from 'src/app/services/friendlist/friendlist.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddFriend, ChatOnline } from 'src/app/models/friendlist/friendlist';

@Component({
  selector: 'app-online-chat',
  templateUrl: './online-chat.page.html',
  styleUrls: ['./online-chat.page.scss'],
})
export class OnlineChatPage implements OnInit {


  public addPost: Observable<AddFriend[]>;
  public chatPost: Observable<ChatOnline[]>;

  public segment = 'friendlist';
  filter: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string;
  buddyPostId: string;

  constructor(private friendlistService: FriendlistService,
              private firestore: AngularFirestore,
              private router: Router,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    this.getUserId();

    this.addPost = this.friendlistService.getAddPost(this.userId);

    this.chatPost = this.friendlistService.getChatPost();

  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.userId = user.uid;
  }

  addfriendToDB(category: string,
                friendId: string,
                userId: string,
                userImage: string,
                userName: string,
                ){

    this.buddyPostId = this.firestore.createId();

    this.firestore.collection('users').doc(this.userId).collection('buddy-posts').doc(this.buddyPostId).set({
      buddyId: this.buddyPostId,
      friendId,
      category,
      userId,
      userImage,
      userName,
    }).then( success => {
      this.router.navigate(['tab/online-chat/friendlist/']);
    });
  }

  chatToDB(
           chatId: string,
           category: string,
           userId: string,
           userImage: string,
           userName: string,
           ){

      this.buddyPostId = this.firestore.createId();

      this.firestore.collection('users').doc(this.userId).collection('buddy-posts').doc(this.buddyPostId).set({
        buddyId: this.buddyPostId,
        chatId,
        category,
        userId,
        userImage,
        userName,
      }).then( success => {
        this.router.navigate(['tab/online-chat/convo']);
      });
  }
}
