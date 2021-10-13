import { CommentService } from 'src/app/services/comment/comment.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  reportDetails = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    reportType: 'Report Comments',
    reportStatus: 'Pending',
    reportDescription: '',
    reportId: '',
    userId: '',
    userName: '',
    userEmail: '',
    userImage: '',
    postId: '',
  }

  @ViewChild(IonContent) content: IonContent;

  comments: Observable<any[]>;
  newCmt = '';
  postId: string;
  currentUser: string;

  constructor(private commentService: CommentService,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore,
              private alertCtrl: AlertController) {
                this.checkUser();
               }

  ngOnInit() {
    this.checkUser();
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.comments = this.commentService.getComments(this.postId);
  }

  sendComment(){
    this.commentService.addComment(this.newCmt, this.postId).then(() =>{
      this.newCmt = '';
      this.content.scrollToBottom();
    });
  }

  checkUser(){
    let user = firebase.auth().currentUser;
    this.currentUser = `${user.uid}`;
    this.reportDetails.userId = this.currentUser;

    this.firestore.collection('users').doc(this.currentUser).valueChanges().subscribe( userDetail => {
      this.reportDetails.userName = userDetail['name'];
      this.reportDetails.userEmail = userDetail['email'];
      this.reportDetails.userImage = userDetail['userImage'];
    })
  }

  deleteCommentDB( postId, commentId){
      this.firestore.collection('timeline-comments').doc(postId).collection('comments').doc(commentId).delete()
      .then( async success => {
        let alert = await this.alertCtrl.create({
          header: 'Comment Deleted',
          message: 'Your comment has been deleted.',
          buttons: [{
            text: 'OK'
          }]
        });
        alert.present();
      })

  }

  sendReport( postId: string, description: string){
    this.reportDetails.reportId =  this.firestore.createId();
    this.reportDetails.postId = postId;
    this.reportDetails.reportDescription = description;

    this.firestore.collection('report').doc(this.reportDetails.reportId).set(this.reportDetails);
    this.firestore.collection('admin-notif').doc(this.reportDetails.reportId).set(this.reportDetails)

    .then( async success => {
      let alert = await this.alertCtrl.create({
        header: 'Report Submitted',
        message: 'Thank you for helping us reporting unappropriate comment. We, Pet Tracker, will be notfied upon this report.',
        buttons: [{
          text: 'DONE'
        }]
      });
      alert.present();
    })
  }

  async deleteComment(userId, postId, commentId){
    if (userId === this.currentUser){
    let alert = await this.alertCtrl.create({
      header: 'Delete Comment',
      subHeader: 'Are you sure you want to delete this comment?',
      buttons: [{
        text: 'No',
        role: 'cancel',
      },
      {
        text: 'Yes',
        handler: data => this.deleteCommentDB( postId, commentId)
      }]
    })
    alert.present();
  }else if(userId !== this.currentUser){
    let alert = await this.alertCtrl.create({
      header: 'Report Post',
      subHeader: 'Please state the reason why you want to report this post?',
      inputs: [
        {
          name:'reportReason',
          placeholder: 'Enter your reason here',
          type: 'textarea'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Submit report',
        handler: data => this.sendReport(postId, data.reportReason)
      }]
    })
    alert.present();
    }
  }
}
