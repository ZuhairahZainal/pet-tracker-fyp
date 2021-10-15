import { ChatService } from 'src/app/services/chat/chat.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {  IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { file } from 'src/app/models/file/file';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

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
  imageUpload: any;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<file[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<file>;

  constructor(private chatService: ChatService,
              private storage: AngularFireStorage,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) {
                this.isImgUploading = false;
                this.isImgUploaded = false;

                this.ngFirestoreCollection = firestore.collection<file>('chatPic');
                this.files = this.ngFirestoreCollection.valueChanges();

               }

  ngOnInit() {

    this.getUserDetails();

    this.friendId = this.activatedRoute.snapshot.paramMap.get('id');

    this.messages = this.chatService.getChatMessages();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg, this.userName, this.userImage, this.imageUpload).then(() =>{
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

  uploadPicture(event: Event) {

    let file = (event.target as HTMLInputElement).files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `onlinechat/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.imageUpload = resp;

          this.isImgUploading = false;
          this.isImgUploaded = true;
        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;
      })
    )
  }

}
