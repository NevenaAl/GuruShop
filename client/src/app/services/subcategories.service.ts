import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations'

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  constructor(private apollo:Apollo) { }
  
  createSubcategory(name: String,image: any,category_id: String, inputs: any){
    return this.apollo.mutate({
      mutation: mutation.CreateSubcategoryMutation,
      variables: {
        name,
        image,
        category_id,
        inputs
      },
      context:{
        useMultipart: true
      }
    });
  }

  editSubcategory(_id: String, name: String,image: any,category_id: String){
    return this.apollo.mutate({
      mutation: mutation.EditSubcategoryMutation,
      variables: {
        _id,
        name,
        image,
        category_id
      },
      context:{
        useMultipart: true
      }
    });
  }
  
  deleteSubcategory(_id: String){
    return this.apollo.mutate({
      mutation: mutation.DeleteSubcategoryMutation,
      variables:{
        _id
      }
    })
  }
}
