import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as query from '../../../strings/queries';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  
  @Input() productsInput: Array<any>;

  products: Array<any>;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if(this.productsInput){
      this.products = this.productsInput;
      console.log(this.products);
    }else{
      this.loadProducts();
    }
  }

  ngOnChanges(): void {
    if(this.productsInput){
      this.products = this.productsInput;
      console.log(this.products);
    }else{
      this.loadProducts();
    }
  }

  loadProducts() {
    this.apollo
      .watchQuery({
        query: query.ProductsQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.products = result.data.products;
      });
  }

}
