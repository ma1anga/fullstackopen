import { useState } from "react"

const CreateBlog = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={(e) => {
        e.preventDefault()

        handleCreate({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
      }}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default CreateBlog