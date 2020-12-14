import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/entities/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  @Input() product: Product;

  constructor() { }

  ngOnInit(): void {
  }

}
