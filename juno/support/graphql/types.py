import graphene
from graphene_django import DjangoObjectType

from support.models import BlogPost, BlogCategory


class BlogPostType(DjangoObjectType):
    class Meta:
        model = BlogPost
        fields = (
            "slug",
            "title",
            "image",
            "image350",
            "language",
            "preview",
            "content",
            "published",
            "featured",
            "category",
            "meta_description",
            "meta_robots",
            "open_graph",
            "author",
            "created",
        )


class BlogCategoryType(DjangoObjectType):
    posts = graphene.List(
        graphene.NonNull(BlogPostType),
        limit=graphene.Int(),
        featured=graphene.Boolean(),
    )

    class Meta:
        model = BlogCategory
        fields = (
            "name",
            "slug",
            "language",
            "title",
            "image",
            "image350",
            "preview",
            "content",
            "meta_description",
            "meta_robots",
            "open_graph",
            "created",
        )

    def resolve_posts(self: BlogCategory, info, limit=3, featured=False):
        posts = self.posts.filter(published=True)

        if featured:
            posts = posts.filter(featured=True)

        return posts.order_by("-published")[:limit]
