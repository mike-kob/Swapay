
export const EDIT_PRIVATE_PROFILE_MUTATION = `
mutation (
    $phone: String,
    $photo: String,
    $photoFile: String,
    $username: String,
    $firstName: String,
    $lastName: String,
    $city: UserCityInput
  )
  {
    updateUser(data: {
      photo: $photo,
      photoFile: $photoFile,
      username: $username,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      city: $city,
    }) {
      ok
      errors
      errorsJson
      user {
        avatar
        username
        email
        firstName
        lastName
        phone
        city {
          id
          name
        }
      }
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = `
mutation (
    $oldPassword: String!
    $password1: String!,
    $password2: String!
  )
  {
    changePassword(
      oldPassword: $oldPassword,
      password1: $password1,
      password2: $password2
    ) {
      ok
      errors
    }
  }
`;

export const GET_PRIVATE_PROFILE_QUERY = `
query {
    user {
      id
      avatar
      username
      firstName
      lastName
      email
      phone
      items {
        id
      }
      city {
        id
        name
      }
      telegram
      social
      notifications {
        type
        swap {
          id
          owner {
            id
            username
          }
          client {
            id
            username
          }
          item {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_NOTIFICATIONS_QUERY = `
query {
    user {
      notifications {
        type
        swap {
          id
          owner {
            id
            username
          }
          client {
            id
            username
          }
          item {
            id
            title
          }
        }
        customTitle
        customText
        customLink
        customIcon
      }
    }
  }
`;
