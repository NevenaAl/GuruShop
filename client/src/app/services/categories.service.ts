import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations'

import * as Scalars from '../../strings/scalar';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private apollo:Apollo) { }
  
  createCategory(name: String,image: any,inputs: any){
    return this.apollo.mutate({
      mutation: mutation.CreateCategoryMutation,
      variables: {
        name,
        image,
        inputs
      },
      context:{
        useMultipart: true
      }
    });
  }
 
  editCategory(_id: String, name: String,image: any){
    return this.apollo.mutate({
      mutation: mutation.EditCategoryMutation,
      variables: {
        _id,
        name,
        image
      },
      context:{
        useMultipart: true
      }
    });
  }

  deleteCategory(_id: String){
    return this.apollo.mutate({
      mutation: mutation.DeleteCategoryMutation,
      variables:{
        _id
      }
    })
  }
}
