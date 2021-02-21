export const LOGIN_MUTATION = `
mutation (
    $username: String!,  
    $password: String!
  ) {
    login (data: {
      username: $username,
      password: $password
    }) {
      ok
      errors
    }
  }
`;

export const G_LOGIN_MUTATION = `
mutation (
    $idToken: String!
  ) {
    googleLogin (idToken: $idToken) {
      ok
      errors
    }
  }
`;


export const LOGOUT_MUTATION = `
mutation {
    logout {
      ok
    }
  }
`;

export const SIGNUP_MUTATION = `
mutation(
    $username: String!,
    $email: String!,
    $password1: String!,
    $password2: String!
  ) {
    signup (data: {
      username: $username,
      email: $email,
      password1: $password1,
      password2: $password2
    }) {
      ok
      errors
      errorsJson
    }
  }
`;


export const G_SIGNUP_MUTATION = `
mutation (
    $idToken: String!
  ) {
    googleSignup (idToken: $idToken) {
      ok
      errors
    }
  }
`;

export const FORGOT_PASSWORD_REQUEST_MUTATION = `
mutation (
    $email: String!
  ) {
    forgotPasswordRequest (data: {
      email: $email
    }) {
      ok
    }
  }
`;

export const FORGOT_PASSWORD_CONFIRM_MUTATION = `
mutation (
    $token: String!,
    $password1: String!,
    $password2: String!,
  ) {
    forgotPasswordConfirm (data: {
      token: $token,
      password1: $password1,
      password2: $password2
    }) {
      ok
      errors
    }
  }
`;


export const CHANGE_EMAIL_REQUEST_MUTATION = `
mutation (
    $email: String!
  ) {
    changeEmailRequest (email: $email) {
      ok
      errors
    }
  }
`;

export const CHANGE_EMAIL_CONFIRM_MUTATION = `
mutation (
    $token: String!
  ) {
    changeEmailConfirm (token: $token) {
      ok
      errors
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = `
mutation (
    $oldPassword: String!
    $password1: String!,
    $password2: String!,
  ) {
    changePassword (data: {
      oldPassword: $oldPassword,
      password1: $password1,
      password2: $password2
    }) {
      ok
      errors
      errorsJson
    }
  }
`;
