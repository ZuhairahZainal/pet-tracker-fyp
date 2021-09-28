import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastController,
    private loadingCtrl: LoadingController

  ) { }

  ngOnInit() {
  }

  register()
  {
    this.router.navigate(['/auth/register']);
  } //end of register

  forgot()
  {
    this.router.navigate(['/auth/forgot-password']);
  } //end of forgot-password

  guideline()
  {
    this.router.navigate(['/auth/guideline']);
  } //end of guideline

  async login()
  {
    if(this.email && this.password)
    {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in..',
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();

      this.auth.login(this.email, this.password)
      .then(()=> {
        loading.dismiss();
        this.router.navigate(['/tab/timeline']);
      })
      .catch((error)=> {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
    } else {
      this.toast('Please enter your email and password!', 'danger');
    }
  } //end of login

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
  } //end of toast

}
