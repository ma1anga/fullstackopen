import { useState } from "react";

const Blog = ({ blog, onLike, onDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    margin: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails ? 
      <div>
        {blog.url} <br/>
        likes: {blog.likes} <button onClick={() => onLike(blog.id)}>like</button> <br/>
        {blog.author} <br/>
        <button onClick={() => onDelete(blog.id)}>remove</button>
      </div>
      : null}
    </div>
  )
}

export default Blog