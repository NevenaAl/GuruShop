import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Category } from 'src/app/entities/Category';
import { Subcategory } from 'src/app/entities/Subcategory';
import * as query from '../../../strings/queries'
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  @Input() categoriesInput: Array<any>;
  @Input() type: String;
  categories: Array<any>;
  subcategories: Array<any>;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if(this.categoriesInput){
      this.subcategories = this.categoriesInput;
    }else{
      this.loadCategories();
      this.loadSubcategories();
    }
   }

   loadCategories() {
    this.apollo
      .watchQuery({
        query: query.CategoriesQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.categories = result.data.categories;
      });
  }

  loadSubcategories() {
    this.apollo
      .watchQuery({
        query: query.SubcategoriesQuery,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.subcategories = result.data.subcategories;
      });

  }
}
