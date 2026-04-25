import { useParams } from 'react-router-dom'

const Blog = ({ blogs, user, onLike, onDelete }) => {
  const { id } = useParams()

  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>Blog with id '{id}' was not found</div>
  }

  return (
    <div className='blog'>
      <h2>{blog.title}</h2>

      <div className='blog-details'>
        <a href={blog.url}>{blog.url}</a> <br />
        likes: {blog.likes}
        {
          user && <button disabled={!user} onClick={() => onLike(blog.id)}>like</button>
        } <br />
        Added by {blog.author} <br />
        {user && user.username === blog.user.username && (
          <button onClick={() => onDelete(blog.id)}>remove</button>
        )}
      </div>

    </div>
  )
}

export default Blog