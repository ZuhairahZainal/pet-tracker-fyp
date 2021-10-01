import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.page.html',
  styleUrls: ['./adoption.page.scss'],
})
export class AdoptionPage implements OnInit {

  adoptionList;
  filter: string;

  constructor() {}

  ngOnInit() {
  }

}
