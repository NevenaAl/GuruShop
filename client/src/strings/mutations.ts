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
