import { Component, Input, OnInit } from '@angular/core';
import {Category} from '../../entities/Category'
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  @Input() category : any;
  constructor() { }

  ngOnInit(): void {
  }

}
