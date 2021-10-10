import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private afauth: AngularFireAuth,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {}

  logout(){
    this.afauth.signOut().then(()=> {
      this.router.navigateByUrl('');
    });
  }

  async changePassword(){
    //Creating the promt alert with inputs
    let alert = await this.alertCtrl.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Enter your old password..',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'Enter your new password..',
          type: 'password'
        },
        {
          name: 'passwordConfirmation',
          placeholder: 'Re-enter your new password..',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
         {
          text: 'Change Password',
          handler: data => {
            //First you get the current logged in user
            const currentUser = firebase.auth().currentUser;

            const credentials = firebase.auth.EmailAuthProvider.credential(
              currentUser.email, data.oldPassword);

              //Reauthenticating here with the data above
              currentUser.reauthenticateWithCredential(credentials).then(
                async success => {
                  if(data.newPassword != data.passwordConfirmation){
                    let alert = await this.alertCtrl.create({
                      header: 'Change Password Failed',
                      message: 'You did not re-enter your new password correctly.',
                      buttons: ['Try Again']
                    });
                    alert.present();
                  } else if(data.newPassword.length < 6){
                    let alert = await this.alertCtrl.create({
                      header: 'Change Password Failed',
                      message: 'Your password should be at least 6 characters.',
                      buttons: ['Try Again']
                    });
                    alert.present();
                  } else {
                    let alert = await this.alertCtrl.create({
                      header: 'Change Password Success',
                      message: 'Your password has been updated!',
                      buttons: ['OK']
                    });
                    alert.present();

                    currentUser.updatePassword(data.newPassword).then(function(){
                    //Update Success
                    }).catch(function(error){
                      //Update Failed
                    });
                  }
                },
                async error => {
                  console.log(error);
                  if(error.code === "auth/wrong-password"){
                    let alert = await this.alertCtrl.create({
                      header: 'Change Password Failed',
                      message: 'Your old password is invalid.',
                      buttons: ['Try Again']
                    });
                    alert.present();
                  }
                }
              )}
            }
          ]
        });
    alert.present();
  }
}
