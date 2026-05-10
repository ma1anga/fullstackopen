import { Link } from 'react-router-dom'
import Blog from './Blog'
import useBlogStore from '../stores/blogStore'

const Blogs = () => {
  const { blogs } = useBlogStore()

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Blogs
