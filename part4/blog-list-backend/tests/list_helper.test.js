const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])

    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)

    assert.strictEqual(result, 34)
  })
})

describe('favorite blog', () => {
  const favoriteBlogOne = {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 100,
    __v: 0
  }

  const favoriteBlogTwo = {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 100,
    __v: 0
  }

  const listWithFavoriteBlog = [
    ...listWithMultipleBlogs,
    favoriteBlogOne
  ]

  const listWithSeveralFavoriteBlogs = [
    ...listWithMultipleBlogs,
    favoriteBlogTwo,
    favoriteBlogOne
  ]

  test('of empty list returns null', () => {
    const result = listHelper.favoriteBlog([])

    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns it', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)

    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('when bigger list returns one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithFavoriteBlog)

    assert.deepStrictEqual(result, favoriteBlogOne)
  })

  test('when bigger list with several favorite returns the first one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithSeveralFavoriteBlogs)

    assert.deepStrictEqual(result, favoriteBlogTwo)
  })
})

describe('most blogs', () => {
  const listForMostBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422bd11b54a676234d17fd',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422be01b54a676234d17fe',
      title: 'Refactoring in depth',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/refactoring-2nd-ed.html',
      likes: 9,
      __v: 0
    },
    {
      _id: '5a422bf01b54a676234d17ff',
      title: 'Microservices',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/microservices.html',
      likes: 8,
      __v: 0
    }
  ]

  test('of empty list returns null', () => {
    const result = listHelper.mostBlogs([])

    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns its author', () => {
    const result = listHelper.mostBlogs([listForMostBlogs[0]])
    const expectedResult = {
      author: "Edsger W. Dijkstra",
      blogs: 1
    }

    assert.deepStrictEqual(result, expectedResult)
  })

  test('when multiple should return proper one', () => {
    const result = listHelper.mostBlogs(listForMostBlogs)
    const expectedResult = {
      author: "Robert C. Martin",
      blogs: 3
    }

    assert.deepStrictEqual(result, expectedResult)
  })
})

describe('most likes', () => {
  const listForMostLikes = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 20,
      __v: 0
    },
    {
      _id: '5a422bd11b54a676234d17fd',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422be01b54a676234d17fe',
      title: 'Refactoring in depth',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/refactoring-2nd-ed.html',
      likes: 9,
      __v: 0
    },
    {
      _id: '5a422bf01b54a676234d17ff',
      title: 'Microservices',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/microservices.html',
      likes: 8,
      __v: 0
    }
  ]

  test('of empty list returns null', () => {
    const result = listHelper.mostLikes([])

    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns its author', () => {
    const result = listHelper.mostLikes([listForMostLikes[0]])
    const expectedResult = {
      author: "Edsger W. Dijkstra",
      likes: 5
    }

    assert.deepStrictEqual(result, expectedResult)
  })

  test('when multiple should return proper one', () => {
    const result = listHelper.mostLikes(listForMostLikes)
    const expectedResult = {
      author: 'Robert C. Martin',
      likes: 33
    }

    assert.deepStrictEqual(result, expectedResult)
  })
})
