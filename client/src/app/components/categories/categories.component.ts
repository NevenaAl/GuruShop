import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import * as query from '../../../strings/queries'
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  @Input() subcategories: Array<any>;
  categories: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if(this.subcategories){
      this.categories = this.subcategories;
      this.loading=false;
      this.error = null;
    }else{
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
