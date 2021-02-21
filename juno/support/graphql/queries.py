import graphene

from support.graphql.types import BlogCategoryType, BlogPostType
from support.models import BlogCategory, BlogPost


class BlogCategories:
    blog_categories = graphene.List(graphene.NonNull(BlogCategoryType))

    blog_category = graphene.Field(
        BlogCategoryType,
        language=graphene.NonNull(graphene.String),
        slug=graphene.NonNull(graphene.String),
    )

    def resolve_blog_categories(self, info, **kwargs):
        return BlogCategory.objects.filter(posts__isnull=False).distinct()

    def resolve_blog_category(self, info, language, slug, **kwargs):
        return BlogCategory.objects.filter(language=language, slug=slug).first()


class BlogPosts:
    blog_posts = graphene.List(graphene.NonNull(BlogPostType))

    blog_post = graphene.Field(
        BlogPostType, language=graphene.NonNull(graphene.String), slug=graphene.NonNull(graphene.String)
    )

    def resolve_blog_posts(self, info, **kwargs):
        return BlogPost.objects.filter(published=True).select_related("category")

    def resolve_blog_post(self, info, slug, language, **kwargs):
        return BlogPost.objects.filter(language=language, slug=slug, published=True).first()
