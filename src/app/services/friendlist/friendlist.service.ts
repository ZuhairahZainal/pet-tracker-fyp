import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddFriend, ChatOnline } from 'src/app/models/friendlist/friendlist';

@Injectable({
  providedIn: 'root'
})

export class FriendlistService {

  constructor(public firestore: AngularFirestore,
              private router: Router) {}

// friend for buddy
getAddPost(userId): Observable<AddFriend[]> {
  return this.firestore.collection('users').doc(userId).collection<AddFriend>(`friendlist`, ref => ref.orderBy('time')).valueChanges();
}

// chat for buddy
getChatPost(): Observable<ChatOnline[]> {
  return this.firestore.collection<ChatOnline>(`chatOnline`, ref => ref.orderBy('time')).valueChanges();
}


  // // update add friend
  // updateAddPost(userId, friendId) {
  //   this.firestore.collection('newAddPost').doc(friendId);

  //   this.firestore.collection('buddylist').doc(userId).collection('addPost').doc(friendId)
  //   .then(() => {
  //     this.router.navigate(['tab/online-chat/friendlist/', friendId]);
  //   }).catch(error => console.log(error));
  // }

  // // update online chat
  // updateChatPost(userId, chatId) {
  //   this.firestore.collection('newChatPost').doc(chatId);

  //   this.firestore.collection('buddylist').doc(userId).collection('chatPost').doc(chatId)
  //   .then(() => {
  //     this.router.navigate(['tab/online-chat/convo/', chatId]);
  //   }).catch(error => console.log(error));
  // }
  }
