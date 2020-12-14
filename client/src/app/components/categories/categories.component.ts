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
  @Input() subcategories: Array<any>;
  categories: Array<any>;
  loading = true;
  error: any;
  type: String;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if(this.subcategories){
      this.type = "subcategory";
      this.categories = this.subcategories;
      this.loading=false;
      this.error = null;
    }else{
      this.type = "category";
      this.apollo
      .watchQuery({
        query: query.CategoriesQuery
      })
      .valueChanges.subscribe(result => {
        //@ts-ignore
        this.categories = result.data.categories;
        this.loading = result.loading;
        this.error = result.error;
      });
  
    }
   
  }

}
