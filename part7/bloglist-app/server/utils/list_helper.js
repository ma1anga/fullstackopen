const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((totalLikes, blog) => (totalLikes += blog.likes), 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  return blogs.reduce(
    (favoriteBlog, blog) =>
      favoriteBlog.likes >= blog.likes ? favoriteBlog : blog,
    blogs[0],
  )
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const authorToBlogCountMap = new Map()
  let authorWithMostBlogs = null
  let mostBlogsCount = 0

  blogs.forEach((blog) => {
    const { author } = blog
    const blogCount = authorToBlogCountMap.get(author) ?? 0

    const newBlogCount = blogCount + 1
    authorToBlogCountMap.set(author, newBlogCount)

    if (newBlogCount > mostBlogsCount) {
      mostBlogsCount = newBlogCount
      authorWithMostBlogs = author
    }
  })

  return {
    author: authorWithMostBlogs,
    blogs: authorToBlogCountMap.get(authorWithMostBlogs),
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const authorToLikesCountMap = new Map()
  let authorWithMostLikes = null
  let mostLikesCount = 0

  blogs.forEach((blog) => {
    const { author } = blog
    const likesCount = authorToLikesCountMap.get(author) ?? 0

    const newLikesCount = likesCount + blog.likes
    authorToLikesCountMap.set(author, newLikesCount)

    if (newLikesCount > mostLikesCount) {
      mostLikesCount = newLikesCount
      authorWithMostLikes = author
    }
  })

  return {
    author: authorWithMostLikes,
    likes: authorToLikesCountMap.get(authorWithMostLikes),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
