import { ChatService } from 'src/app/services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.page.html',
  styleUrls: ['./convo.page.scss'],
})
export class ConvoPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';
  friendId: string;
  userImage: string;
  userName: string;
  userId: string;

  constructor(private chatService: ChatService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) { }

  ngOnInit() {

    this.getUserDetails();

    this.friendId = this.activatedRoute.snapshot.paramMap.get('id');

    this.messages = this.chatService.getChatMessages();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg, this.userName, this.userImage).then(() =>{
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  getUserDetails(){
    let user = firebase.auth().currentUser;
    this.userId = `${user.uid}`;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( details => {
      this.userName = details['name'];
      this.userImage = details['userImage'];
    })
  }

}
