import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as query from '../../strings/queries'
import { Category } from '../entities/Category';


@Injectable({
  providedIn: 'root'
})


export class CategoryService {
  
  constructor(private apollo: Apollo) { }

  getCategories() : any{
    this.apollo
    .watchQuery<any>({
      query: query.CategoriesQuery
    })
  }

  getCategory(id:String) : any{
    this.apollo
    .watchQuery({
      query: query.CategoryQuery,
      variables:{
        _id:id,
      },
    })
  }
}
