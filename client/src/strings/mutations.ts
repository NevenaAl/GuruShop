import gql from 'graphql-tag';

export const LogInUserMutation= gql`
  mutation LogInUserMutation ($email: String!, $password: String!){
    logInUser(data:{
      email: $email
      password: $password
    }){
      userPayload{
        _id
        name
        surrname
        email
        password
        isMailConfirmed
        role
      }
      errors{
        message
        path
      }
      token
    }
  }
`;

export const SignUpUserMutation= gql`
  mutation SignUpUserMutation ($name: String!, $surrname: String!, $email: String!, $password: String!){
    createUser(data:{
      name: $name
      surrname: $surrname
      email: $email
      password: $password
    }){
      userPayload{
        _id
        name
        surrname
        email
        password
        isMailConfirmed
        role
      }
      errors{
        message
        path
      }
    }
  }
`;

export const CreateCategoryMutation = gql`
mutation CreateCategoryMutation($name: String!, $image: FileUpload!,$inputs: JSON){
 
 createCategory(data:{
   name: $name
   image: $image
   inputs: $inputs
 }){
   categoryPayload{
     _id
     name
     image
   }
   errors{
     message
   }
 }
}
`;


export const CreateSubcategoryMutation = gql`
mutation CreateSubcategoryMutation($name: String!, $image: FileUpload!, $category_id: String!,$inputs: JSON){
 
 createSubcategory(data:{
   name: $name
   image: $image
   category_id: $category_id
   inputs: $inputs
 }){
   subcategoryPayload{
     _id
     name
     image
   }
   errors{
     message
   }
 }
}
`;

export const CreateProductMutation = gql`
mutation CreateProductMutation($name: String!, $image: [FileUpload!], $description: String!, $price: Float!, $discount: Float, $amount:Int!, $additionalInfo: JSON, $subcategory_id: String!){
 
 createProduct(data:{
   name: $name
   image: $image
   description: $description
   price: $price
   discount: $discount
   amount: $amount
   additionalInfo: $additionalInfo
   subcategory_id: $subcategory_id
 }){
   productPayload{
     _id
     name
     image
     description
     amount
     discount
     additionalInfo
     price
   }
   errors{
     message
   }
 }
}
`;
export const  EditCategoryMutation = gql`
mutation EditCategoryMutation($_id: String!, $name: String, $image: FileUpload){
 
 updateCategory(data:{
   _id: $_id
   name: $name
   image: $image
 }){
   categoryPayload{
     _id
     name
     image
   }
   errors{
     message
   }
 }
}
`;


export const EditSubcategoryMutation = gql`
mutation EditSubcategoryMutation($_id: String!, $name: String, $image: FileUpload, $category_id: String){
 
 updateSubcategory(data:{
   _id: $_id
   name: $name
   image: $image
   category_id: $category_id
 }){
   subcategoryPayload{
     _id
     name
     image
   }
   errors{
     message
   }
 }
}
`;

export const EditProductMutation = gql`
mutation EditProductMutation($_id:String!, $name: String, $newImages: [FileUpload], $deletedImages: String, $description: String, $price: Float, $discount: Float, $amount:Int, $additionalInfo: JSON, $subcategory_id: String){
 
 updateProduct(data:{
   _id: $_id
   name: $name
   newImages: $newImages
   deletedImages: $deletedImages
   description: $description
   price: $price
   discount: $discount
   amount: $amount
   additionalInfo: $additionalInfo
   subcategory_id: $subcategory_id
 }){
   productPayload{
     _id
     name
     image
   }
   errors{
     message
   }
 }
}
`;

export const EditUserMutation = gql`
mutation EditUserMutation($_id:String!, $name: String, $surrname: String, $email: String, $role: String){
 
 updateUser(data:{
   _id: $_id
   name: $name
   surrname: $surrname
   email: $email
   role: $role
 }){
   userPayload{
     _id
     name
     email
   }
   errors{
     message
   }
 }
}
`;

export const DeleteSubcategoryMutation = gql`
mutation DeleteSubcategoryMutation($_id: String!){
 
  deleteSubcategory(_id:$_id){
    subcategoryPayload{
      name
    }
    errors{
      message
    }
  }
}
`;

export const DeleteCategoryMutation = gql`
mutation DeleteCategoryMutation($_id: String!){
 
  deleteCategory(_id:$_id){
    categoryPayload{
      name
    }
    errors{
      message
    }
  }
}
`;


export const DeleteProductMutation = gql`
mutation DeleteProductMutation($_id: String!){
 
  deleteProduct(_id:$_id){
    productPayload{
      name
    }
    errors{
      message
    }
  }
}
`;

export const DeleteUserMutation = gql`
mutation DeleteUserMutation($_id: String!){
 
  deleteUser(_id:$_id){
    userPayload{
      name
    }
    errors{
      message
    }
  }
}
`;