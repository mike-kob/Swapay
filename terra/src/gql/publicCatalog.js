export const SEARCH_QUERY = `
query (
  $k: String,
  $p: Int!,
  $swapType: String,
  $lowRentPrice: Decimal,
  $highRentPrice: Decimal,
  $lowSellPrice: Decimal,
  $highSellPrice: Decimal,
  $city: String,
  $tags: [ID],
) {
  search(
    k: $k,
    swapType: $swapType,
    lowRentPrice: $lowRentPrice,
    highRentPrice: $highRentPrice,
    lowSellPrice: $lowSellPrice,
    highSellPrice: $highSellPrice,
    city: $city,
    page: $p,
    tags: $tags
  ) {
    total
    pages
    page
    stats {
      maxRentPrice
      minRentPrice
      maxSellPrice
      minSellPrice
    }
    results {
      id
      rentPrice
      sellPrice
      exchangeDescription
      description
      title
      types
      owner {
        city {
          name
        }
      }
      photos {
        id
        main
        publicId
      }
      tags {
        id
        alias
        ukName
        enName
      }
    }
  }
}
`;

export const RECOMMENDED_QUERY = `
query (
  $source: String!,
  $num: Int
) {
  recommendedGames (source: $source, num: $num) {
    id
    rentPrice
    sellPrice
    exchangeDescription
    title
    enTitle
    types
    photos {
      id
      main
      publicId
    }
    reviews {
      id
    }
    tags {
      id
      ukName
      enName
    }
  }
}
`;

export const CITY_QUERY = `
query {
  city {
    id
    name
  }
}
`;
