import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/entities/Category';
import { Apollo } from 'apollo-angular';
import * as query from '../../../strings/queries'

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html'
})
export class CategoryDetailsComponent implements OnInit {
  category: Category;
  categoryId : string;
  loading : boolean;
  error : any;

  constructor(private apollo: Apollo,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.categoryId = params['categoryId'];
        this.apollo
        .watchQuery({
         query: query.CategoryQuery,
         variables:{
          _id:this.categoryId,
           },
        })
        .valueChanges.subscribe(result => {
          //@ts-ignore
          this.category = result.data.category.categoryPayload;
          this.loading = result.loading;
          this.error = result.error;
        });
      }
    ); 
  }

}
