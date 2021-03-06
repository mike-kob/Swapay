export const BLOG_CATEGORY_SLUGS_QUERY = `
  query {
    blogCategories {
      slug
      language
    }
  }
`;

export const BLOG_CATEGORY_QUERY = `
  query ($slug: String!, $language: String!, $limit: Int) {
    blogCategory(language: $language, slug: $slug) {
      name
      image
      image350
      slug
      language
      title
      preview
      content
      metaDescription
      metaRobots
      openGraph
      created
      posts(limit: $limit) {
        slug
        title
        image
        image350
        preview
        author
        featured
        language
        category {
          slug
        }
      }
    }
  }
`;

export const BLOG_POST_SLUGS_QUERY = `
  query{
    blogPosts {
      slug
      language
      category {
        slug
      }
    }
  }
`;

export const BLOG_HOME_QUERY = `
query($limit: Int) {
  blogCategories {
    title
    slug
    language
    posts(limit: $limit, featured: true)  {
      slug
      title
      image
      image350
      preview
      author
      featured
      language
      category {
        slug
      }
    }
  }
}
`;

export const BLOG_POST_QUERY = `
  query($language: String!, $slug: String!) {
    blogPost(language: $language, slug: $slug) {
      slug
      language
      category {
        slug
        name
        title
      }
      title
      preview
      image
      image350
      content
      published
      featured
      metaDescription
      metaRobots
      openGraph
      created
    }
  }
`;

export const CATALOG_TAG_QUERY = `
query ($language: String!, $slug: String!) {
  gameTag(language: $language, slug: $slug) {
    id
    ukSlug
    enSlug
    ukName
    enName
    games {
      id
      ukTitle
      enTitle
      ukPreview
      enPreview
      types
      tags {
        id
        ukName
        enName
      }
      photos {
        id
        main
        publicId
      }
      preview
    }
    tagType
    ukMetaDescription
    enMetaDescription
    ukContent
    enContent
  }
}

`;
