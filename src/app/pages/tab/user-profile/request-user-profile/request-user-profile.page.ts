import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoption/adoption.service';
import firebase from 'firebase/app';
import { AdoptionsRequest } from 'src/app/models/adoption/adoptions-request';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-request-user-profile',
  templateUrl: './request-user-profile.page.html',
  styleUrls: ['./request-user-profile.page.scss'],
})
export class RequestUserProfilePage implements OnInit {

  accept = {
    createdAt: new Date().toDateString(),
    category: 'Request Accept',
    message: 'Congrats, I accept you as the future owner of this pet!'
  }

  reject = {
    createdAt: new Date().toDateString(),
    category: 'Request Reject',
    message: 'Thank you for request to take care of this pet. Unfortunately, I have to reject your request.'
  }

  userId: string;
  requestId: string;
  userRequest: string;
  petRequested: string;
  userDetails;
  adoptionPosts;
  petRequestedDetails;
  userBio: any;
  userImage: any;

  public adoptionRequest: AdoptionsRequest;


  public segment: string = "allpost";

  constructor(private firestore: AngularFirestore,
              private adoptionService: AdoptionService,
              private alertCtrl: AlertController,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getUserId();

    this.requestId = this.activatedRoute.snapshot.paramMap.get('requestId');

    this.adoptionService.getUserPending(this.userId, this.requestId).subscribe(adoptionDetail => {
      this.adoptionRequest = adoptionDetail;
      this.userRequest = adoptionDetail['userId'];
      this.petRequested = adoptionDetail['petId'];

      this.firestore.collection('users').doc(this.userRequest).valueChanges().subscribe( userDetail => {
        this.userDetails = userDetail;
      });

      this.firestore.collection('adoption').doc(this.userRequest).collection('adoptionDetail')
      .valueChanges().subscribe( adoptionPost => {
        this.adoptionPosts = adoptionPost;
      });

      this.firestore.collection('adoption').doc(this.userId).collection('adoptionDetail').doc(this.petRequested)
      .valueChanges().subscribe( petRequestedDetail => {
        this.petRequestedDetails = petRequestedDetail;
      });
    });
  }

  getUserId(){
    let user = firebase.auth().currentUser;
    this.userId = user.uid;
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  async acceptUser(requestId: string, userId: string){
    const alert = await this.alertCtrl.create({
      header: 'Accept Request',
      message: 'Are you sure you want to accept this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () =>  this.acceptRequest(requestId, userId),
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }

  acceptRequest(requestId: string, userId: string){
    this.firestore.collection('users').doc(userId).collection('notification').add(this.accept);
    this.firestore.collection('adoptionPost').doc(this.petRequested).delete();
    this.firestore.collection('adoption').doc(this.userId).collection('adoptionDetail').doc(this.petRequested).delete();
    this.firestore.collection('adoption').doc(this.userRequest).collection('adoptionApplication').doc(requestId).update({
      status: 'Accepted'
    });

    this.firestore.collection('adoption').doc(this.userId).collection('adoptionRequest').doc(requestId).update({
      status: 'Accepted'
    }).then(() => {
      this.router.navigate(['tab/user-profile/pending-list']);
    })
  }

  async rejectUser(requestId: string, userId: string){
    const alert = await this.alertCtrl.create({
      header: 'Reject Request',
      message: 'Are you sure you want to reject this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () =>  this.rejectRequest(requestId, userId),
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }

  rejectRequest(requestId: string, userId: string){
    this.firestore.collection('users').doc(userId).collection('notification').add(this.reject);
    this.firestore.collection('adoption').doc(this.userRequest).collection('adoptionApplication').doc(requestId).update({
      status: 'Rejected'
    });
    this.firestore.collection('adoption').doc(this.userId).collection('adoptionRequest').doc(requestId).update({
      status: 'Rejected'
    }).then(() => {
      this.router.navigate(['tab/user-profile/pending-list']);
    })
  }

}
