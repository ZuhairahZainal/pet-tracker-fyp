import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  sub: number;
  tax: number;
  total: number;
  address: string;
  card: number;
  num: number;
  simpang: number;
  kampung: string;
  postCode: string;
  cityName: string;
  countryName: string;
  firstName: string;
  lastName: string;
  creditCardNumber: number;
  cvv: number;
  expiration: Date;

  constructor() { }

  ngOnInit() {
  }

}
