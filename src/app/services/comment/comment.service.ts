import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UrlSegment } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export class User {
  uid: string;
  email: string;
}

export class Comment {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  cmt: string;
  fromName: string;
  myCmt: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  currentUser: User = null;
  userId: any;
  userName: string;
  userImage: string;
  commentId: string;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {

                this.afAuth.onAuthStateChanged(user => {
                  console.log('Changed: ', user);
                  this.currentUser = user;
                });

                this.getUserDetails();
    }

    addComment(cmt, postId){
      this.commentId = this.afs.createId();
      return this.afs.collection('timeline-comments').doc(postId).collection('comments').doc(this.commentId).set({
        cmt,
        from: this.currentUser.uid,
        postId: postId,
        username: this.userName,
        userImage: this.userImage,
        commentId: this.commentId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    getComments(postId){
      let users = [];

      return this.getUsers().pipe(
        switchMap(res => {
          users = res;
          console.log('all users: ', users);
          return this.afs.collection('timeline-comments').doc(postId).collection('comments', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Comment[]>;
        }),
        map(comments => {
          for (const c of comments){
            c.fromName = this.getUserForCmt(c.from, users);
            c.myCmt = this.currentUser.uid === c.from;
          }
          console.log('all comments: ', comments);
          return comments;
        })
      );
    }

    getUsers(){
      return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
    }

    getUserDetails(){
      let user = firebase.auth().currentUser;
      this.userId = user.uid;

      this.afs.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
        this.userName = userDetails['name'];

        this.userImage = userDetails['userImage'];

      })
    }

    getUserForCmt(cmtFromId, users: User[]): string {
      for (const usr of users){
        if (usr.uid === cmtFromId){
          return usr.email;
        }
      }
      return 'Deleted';
    }

}
