
export const GET_PUBLIC_ITEM_INFO_QUERY = `
query (
    $id: Int!
  ) {
    publicItem (id: $id) {
      id
      rentPrice
      sellPrice
      exchangeDescription
      enDescription
      ukDescription
      enTitle
      ukTitle
      enPreview
      ukPreview
      owner {
        id
        username
        fullName
        avatar
      }
      types
      photos {
        id
        main
        publicId
      }
      tags {
        id
        alias
        translatedName
        published
        ukSlug
        enSlug
        ukName
        enName
      }
      reviews {
        id
        comments
        created
        userFrom {
          username
          id
        }
      }
      avgGameTime
      age
      language
      deposit
    }
  }
`;

export const WRITE_PUBLIC_ITEM_REVIEW_MUTATION = `
mutation(
    $item: ID!,
    $stars: Int!,
    $comment: String,
  ) {
    writeItemReview(data: {
      item: $item,
      stars: $stars,
      comment: $comment
    }) {
      ok
      errors
      itemReview {
        id
        item {
          id
        }
        reviewer {
          id
          username
          fullName
        }
        stars
        comment
        created
      }
    }
  }
`;
