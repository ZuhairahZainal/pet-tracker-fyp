import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { file } from 'src/app/models/file/file';
import firebase from 'firebase/app';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-newpost-form',
  templateUrl: './newpost-form.page.html',
  styleUrls: ['./newpost-form.page.scss'],
})
export class NewpostFormPage implements OnInit {

  newPostDetail={
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    category: 'newsFeed',
    postId: '',
    postTitle: '',
    postDescription: '',
    postImage: null,
    userId: '',
    userImage: '',
    userName: '',
  }

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

  userId: string;
  newsFeedId: string;

  userName: string;
  userImage: string;

  newPostForm: FormGroup;

  constructor(private storage: AngularFireStorage,
              private firestore: AngularFirestore,
              public loadingCtrl: LoadingController,
              private router: Router,
              private route: ActivatedRoute,
              ) {
                this.isImgUploading = false;
                this.isImgUploaded = false;

                this.ngFirestoreCollection = firestore.collection<file>('lostPetPost');
                this.files = this.ngFirestoreCollection.valueChanges();
              }

  ngOnInit() {
    this.getUserId();

    this.newPostForm = new FormGroup({
      postTitle: new FormControl(this.newPostDetail.postTitle,[
        Validators.required,
        Validators.minLength(2)
      ]),

      postDescription: new FormControl(this.newPostDetail.postDescription,[
        Validators.required,
        Validators.minLength(2),
      ])
    });

    this.newsFeedId = this.route.snapshot.params.lostpetFormId || 'new';
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.newPostDetail.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newPostDetail.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newPostDetail.userImage = `${this.userImage}`;    })
  }

 async createNewsFeedPost(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.newPostDetail.postId = this.firestore.createId();
    this.newPostDetail.postTitle = this.newPostForm.get('postTitle').value;
    this.newPostDetail.postDescription = this.newPostForm.get('postDescription').value;

    this.firestore.collection('feed').doc(this.newPostDetail.userId).collection('newsFeed').doc(this.newPostDetail.postId)
    .set(this.newPostDetail);

    this.firestore.collection('newsFeedPost').doc(this.newPostDetail.postId)
    .set(this.newPostDetail).then(() => {
      loading.dismiss().then(() => {
        this.newPostForm = null;
        this.router.navigateByUrl('tab/timeline');
        });
      },
      error => {
       loading.dismiss().then(() => {
         console.error(error);
       });
    });
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

    const fileStoragePath = `timeline/newsFeed/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.newPostDetail.postImage = resp;

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
