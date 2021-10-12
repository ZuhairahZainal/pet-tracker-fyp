import { Component, OnInit } from '@angular/core';

// firebase
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import firebase from 'firebase/app';

// routing
import { ActivatedRoute, Router } from '@angular/router';

// form validation
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { file } from 'src/app/models/file/file';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})

export class ReportPage implements OnInit {

  report = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    reportId: '',
    reportType: '',
    reportDescription: '',
    reportProof: null,
    reportStatus: 'Pending',
    userId: '',
    userName: '',
    userEmail: '',
    userImage: '',
  }

  reportForm : FormGroup;
  userId: string;

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

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              public loadingCtrl: LoadingController,
              private router: Router,
              private route: ActivatedRoute) {
                this.isImgUploading = false;
                this.isImgUploaded = false;

                this.ngFirestoreCollection = firestore.collection<file>('lostPetPost');
                this.files = this.ngFirestoreCollection.valueChanges();

               }

  ngOnInit() {
    this.getUserId();
    this.reportForm = new FormGroup({
      reportType: new FormControl(this.report.reportType,[
        Validators.required,
      ]),
      reportDescription: new FormControl(this.report.reportDescription,[
        Validators.required,
        Validators.minLength(3)
      ])
    })
  }

  getUserId(){
    let user = firebase.auth().currentUser;

    this.report.userId = `${user.uid}`;
    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetail => {
      this.report.userName = userDetail['name'];
      this.report.userEmail = userDetail['email'];
      this.report.userImage = userDetail['userImage'];
    })
  }

  async submitReport(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.report.reportId = this.firestore.createId();
    this.report.reportType = this.reportForm.get('reportType').value;
    this.report.reportDescription = this.reportForm.get('reportDescription').value;

    this.firestore.collection('admin-notif').doc(this.report.reportId).set(this.report);

    this.firestore.collection('report').doc(this.report.reportId).set(this.report).then(() => {
      loading.dismiss().then(() => {
        this.reportForm = null;
        this.router.navigateByUrl('tab/user-profile/setting');
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

    const fileStoragePath = `report/proof/${this.userId}}/${new Date().getTime()}_${file.name}`;

    const imageRef = this.storage.ref(fileStoragePath);

    this.ngFireUploadTask = this.storage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.report.reportProof = resp;

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
