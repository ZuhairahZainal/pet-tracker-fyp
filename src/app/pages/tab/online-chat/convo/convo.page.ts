/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.page.html',
  styleUrls: ['./convo.page.scss'],
})
export class ConvoPage implements OnInit {

  //other's data
  name;
  o_uid;

  //my uid
  uid;

  //chats array
  chats = [];
  chat;
  textMsg;

  constructor() {
    this.name = sessionStorage.getItem('name');
    this.o_uid = sessionStorage.getItem('uid');

    this.uid = sessionStorage.getItem('uid');

    firebase.firestore().collection('chats').doc(this.uid).collection(this.o_uid).orderBy('time').onSnapshot(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.data());
      });
    });
  }


  ngOnInit() {

  }

  send(){
    //my chats collection
    firebase.firestore().collection('chats').doc(this.uid).collection(this.o_uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg
    });

    //other users chats collection
    firebase.firestore().collection('chats').doc(this.o_uid).collection(this.uid).add({
      time: Date.now(),
      uid: this.uid,
      msg: this.textMsg
    }).then(() => {
      this.textMsg='';
    });
  }

}
