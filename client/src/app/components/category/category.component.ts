import { Component, Input, OnInit } from '@angular/core';
import { Subcategory } from 'src/app/entities/Subcategory';
import {Category} from '../../entities/Category'
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  @Input() category : any;
  @Input() type: string;

  constructor() { }

  ngOnInit(): void {
  }

}
