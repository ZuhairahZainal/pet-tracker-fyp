import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { ProductService } from '../../../../../../services/sales/product.service';
import firebase from 'firebase/app';
import { Product } from 'src/app/models/sales/product';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  newProductList = {
    time: new Date().getTime(),
    date: new Date().toDateString(),
    adminApprove: 'Pending',
    userName: '',
    userImage: '',
    productName: '',
    productCategory: '',
    productPrice: '',
    productDescription: '',
  }

  updateProductForm: FormGroup;
  public productDetail: Product;

  productId: string;
  userId: string;
  userName: string;
  userImage: string;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private firestore: AngularFirestore) {}

  ngOnInit() {
    this.getUserId();
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');

    this.productService.getUserProduct(this.userId, this.productId).subscribe(productDetail => {
      this.productDetail = productDetail;
    });

    this.updateProductForm = new FormGroup({
      productName: new FormControl(this.newProductList.productName),
      productCategory: new FormControl(this.newProductList.productCategory),
      productPrice: new FormControl(this.newProductList.productPrice),
      productDescription: new FormControl(this.newProductList.productDescription)
    })
  }

  getUserId(){
    const user = firebase.auth().currentUser;

    this.userId = user.uid;

    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe( userDetails => {
      this.userName = userDetails['name'];
      this.newProductList.userName = `${this.userName}`;

      this.userImage = userDetails['userImage'];
      this.newProductList.userImage = `${this.userImage}`;
    })
  }

  //update form for changes
  updateForm() {
    this.newProductList.productName = this.updateProductForm.get('productName').value;
    this.newProductList.productPrice = this.updateProductForm.get('productPrice').value;
    this.newProductList.productCategory = this.updateProductForm.get('productCategory').value;
    this.newProductList.productDescription = this.updateProductForm.get('productDescription').value;

    this.productService.updateProduct(this.userId, this.productId, this.newProductList);
  }
}

