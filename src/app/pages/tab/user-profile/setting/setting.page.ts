import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private afauth: AngularFireAuth,
    private router: Router) { }

  ngOnInit() {
  }

  logout()
  {
    this.afauth.signOut().then(()=> {
      this.router.navigate(['/auth/login']);
    });
  }

}
