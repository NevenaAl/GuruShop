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
      }
      errors{
        message
        path
      }
    }
  }
`;

export const CreateCategoryMutation = gql`
mutation CreateCategoryMutation($name: String!, $image: FileUpload!){
 
 createCategory(data:{
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


export const CreateSubcategoryMutation = gql`
mutation CreateSubcategoryMutation($name: String!, $image: FileUpload!, $category_id: String!){
 
 createSubcategory(data:{
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

export const CreateProductMutation = gql`
mutation CreateProductMutation($name: String!, $image: [FileUpload!], $subcategory_id: String!){
 
 createProduct(data:{
   name: $name
   image: $image
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
