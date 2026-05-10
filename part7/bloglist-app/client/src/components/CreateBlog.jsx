import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const CreateBlog = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <>
      <h2>Create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          handleCreate({ title, author, url })
          setTitle('')
          setAuthor('')
          setUrl('')
        }}
      >
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <div>
          <TextField
            label="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            margin="dense"
            size="small"
          />
        </div>
        <Button variant="contained" size="small" type="submit">
          create
        </Button>
      </form>
    </>
  )
}

export default CreateBlog
