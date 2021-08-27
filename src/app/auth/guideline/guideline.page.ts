import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.page.html',
  styleUrls: ['./guideline.page.scss'],
})
export class GuidelinePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
  login()
  {
      this.router.navigate(['/login']);
  } //end of login
}
