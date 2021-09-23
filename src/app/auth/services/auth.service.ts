import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()

export class AuthService
{
  [x: string]: any;
  user$: Observable<User>;
  user: User;

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController
  )
  {
    this.user$ = this.afauth.authState.pipe(
      switchMap(user=>
        {
          if(user)
          {
            return this.afs.doc(`users/$(user.uid)`).valueChanges();
          } else {
            return of(null);
          }
      })
    );
  }//end of constructor

  async login(email,pass)
  {
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.signInWithEmailAndPassword(email, pass).then((data)=> {
      if(!data.user.emailVerified)
      {
        loading.dismiss();
        this.toast('Please verified your email', 'danger');
        this.logout();
      } else {
        loading.dismiss();
        this.router.navigate(['/tab/timeline']);
      }
    });
  } //end of login

  logout()
  {
    this.afauth.signOut().then(()=> {
      this.router.navigate(['/auth/login']);
    });
  }

  async toast(message, status)
  {
    const toast = await this.toastr.create({
      // eslint-disable-next-line object-shorthand
      message:message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  } // end of toast

}

