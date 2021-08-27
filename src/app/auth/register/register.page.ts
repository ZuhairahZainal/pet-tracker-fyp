import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit
{
  username: string;
  firstName: string;
  lastName: string;
  birthDate: number;
  phoneNumber: number;
  email: string;
  password: string;
  confirmPassword: string;

  passwordMatch: boolean;

  constructor(
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async register()
  {
    if(this.username && this.email && this.password)
    {
      const loading = await this.loadingCtrl.create({
        message: 'loading..',
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();

      this.afauth.createUserWithEmailAndPassword(this.email, this.password).then((data)=> {

        this.afs.collection('users').doc(data.user.uid).set({
          userId: data.user.uid,
          firstname: this.firstName,
          lastname: this.lastName,
          dob: this.birthDate,
          email: this.email,
          phone: this.phoneNumber,
          name: this.username
        });

        data.user.sendEmailVerification();

    })
    .then(()=> {
      loading.dismiss();
      this.toast('Registeration Success!', 'success');
      this.router.navigate(['/login']);
    })
    .catch((error)=> {
      loading.dismiss();
      this.toast(error.message, 'danger');
    });
  } else {
    this.toast('Please fill the form!', 'danger');
  }
} //end of register

  login()
  {
      this.router.navigate(['/login']);
  }

  checkPassword()
  {
    // eslint-disable-next-line eqeqeq
    if(this.password == this.confirmPassword)
    {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
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
