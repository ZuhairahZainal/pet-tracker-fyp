import { Component, OnInit } from '@angular/core';
import { NewProduct } from '../shared/sales';
import { ProductService } from './../shared/product.service';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {

  Products: NewProduct[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.fetchProducts();
    let productRes = this.productService.getProductList();
    productRes.snapshotChanges().subscribe(res => {
      this.Products = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Products.push(a as NewProduct);
      })
    })
  }

  fetchProducts() {
    this.productService.getProductList().valueChanges().subscribe(res => {
      console.log(res)
    })
  }

  deleteProduct(productId) {
    console.log(productId)
    if (window.confirm('Do you really want to delete?')) {
      this.productService.deleteProduct(productId)
    }
  }

}
