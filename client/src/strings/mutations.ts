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
