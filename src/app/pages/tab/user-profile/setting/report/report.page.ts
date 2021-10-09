import { Component, OnInit } from '@angular/core';

// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';

// routing
import { ActivatedRoute, Router } from '@angular/router';

// taking picture
import { Camera, CameraResultType} from '@capacitor/camera';

// form validation
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})

export class ReportPage implements OnInit {

  report = {
    createdAt: new Date().toDateString(),
    reportId: '',
    reportType: '',
    reportDescription: '',
    reportProof: null,
    reportStatus: 'Pending',
    userId: '',
    userName: '',
    userEmail: '',
  }

  reportForm : FormGroup;
  userId: string;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage,
              public loadingCtrl: LoadingController,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserId();
    // this.getUserName();
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
    })
  }

  async submitReport(): Promise<void>{
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.report.reportId = this.firestore.createId();
    this.report.reportType = this.reportForm.get('reportType').value;
    this.report.reportDescription = this.reportForm.get('reportDescription').value;

    this.firestore.collection('admin-notification').doc(this.report.reportId)
    .set(this.report);

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

  async takePicture(): Promise<void>{
    try{
      const proof = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      const proofRef = this.storage.ref(
        `report/proof/${new Date().getTime()}/petImage.png`
      );

      proofRef.putString(proof.base64String, 'base64', {
        contentType: 'image/png',
      })
      .then(() =>{
        proofRef.getDownloadURL().subscribe(downloadURL => {
          this.report.reportProof = downloadURL;
        })

      })
    }catch(error){
      console.warn(error);
    }
  }


}
