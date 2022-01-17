/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
  const id = nanoid(10);
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }
  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const newBook = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};


  books.push(newBook);

  const successfullyAdded = books.filter((item) => item.id === id).length > 0;

  if (successfullyAdded) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {bookId: id},
    });
    res.code(201);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);
  return res;
};

const getBooksList = (req, h) => {
  const params = req.query;
  const {name, finished, reading} = params;

  if (finished > 1 || reading > 1) {
    const simpleBookList = [];
    books.forEach((item) => simpleBookList.push({id: item.id, name: item.name, publisher: item.publisher}));
    const res = h.response({
      status: 'success',
      data: {books: simpleBookList.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))},
    });
    res.code(200);
    return res;
  }

  if (finished) {
    let bookList = [];
    bookList = books.filter((item) => Number(item.finished) === Number(finished));
    const res = h.response({
      status: 'success',
      data: {books: bookList.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }))},
    });
    res.code(200);
    return res;
  }

  if (reading) {
    let bookList = [];
    bookList = books.filter((item) => Number(item.reading) === Number(reading));
    const res = h.response({
      status: 'success',
      data: {books: bookList.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }))},
    });
    res.code(200);
    return res;
  }

  if (name) {
    let bookList = [];
    bookList = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    const res = h.response({
      status: 'success',
      data: {books: bookList.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }))},
    });
    res.code(200);
    return res;
  }

  if (!name || !finished || !reading) {
    const simpleBookList = [];
    books.forEach((item) => simpleBookList.push({id: item.id, name: item.name, publisher: item.publisher}));
    const res = h.response({
      status: 'success',
      data: {books: simpleBookList.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))},
    });
    res.code(200);
    return res;
  }
};

const getBooksById = (req, h) => {
  const {bookId} = req.params;
  const book = books.find((item) => item.id === bookId);
  if (book !== undefined) {
    const res = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    res.code(200);
    return res;
  } else {
    const res = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    res.code(404);
    return res;
  };
};

const editBookById = (req, h) => {
  const {bookId} = req.params;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;
  const finished = false;
  const updatedAt = new Date().toISOString();

  const book = books.find((item) => item.id === bookId);
  if (book == undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    res.code(404);
    return res;
  }

  if (pageCount === readPage) {
    finished = true;
  }

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);
    return res;
  }
};

const deleteBookById = (req, h) => {
  const {bookId} = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {addBook, getBooksList, getBooksById, editBookById, deleteBookById};
