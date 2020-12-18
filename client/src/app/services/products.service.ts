import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as mutation from '../../strings/mutations';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private apollo:Apollo) { }
  
  createProduct(name: String,image: any[],subcategory_id: String){
    return this.apollo.mutate({
      mutation: mutation.CreateProductMutation,
      variables: {
        name,
        image,
        subcategory_id
      },
      context:{
        useMultipart: true
      }
    });
  }

  editProduct(_id: String,name: String,image: any[],subcategory_id: String){
    return this.apollo.mutate({
      mutation: mutation.EditProductMutation,
      variables: {
        _id,
        name,
        image,
        subcategory_id
      },
      context:{
        useMultipart: true
      }
    });
  }

  deleteProduct(_id: String){
    return this.apollo.mutate({
      mutation: mutation.DeleteProductMutation,
      variables:{
        _id
      }
    })
  }

}
