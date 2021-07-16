/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');
// const notes = require('./notes');

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
      message: 'Gagal menambahkan buku. Mohon isi Nama buku ',
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
  const bookList = [];
  const params = req.query;
  console.log(params);
  const {name, finished, reading} = params;

  if (finished == 1) {
    bookList.push(books.filter((val) => val.finished == true));
  } else if (finished == 0) {
    bookList.push(books.filter((val) => val.finished == false));
  }


  if (reading == 1) {
    bookList.push(books.filter((val) => val.reading == true));
  } else if (reading == 0) {
    bookList.push(books.filter((val) => val.reading == false));
  }

  if (name) {
    bookList.push(books.filter((val) => val.name.toLowerCase().includes(name.toLowerCase())));
  }

  if (!name && !finished && !reading) {
    books.forEach((item) => bookList.push({id: item.id, name: item.name, publisher: item.publisher}));
  }
  const res = h.response({
    status: 'success',
    data: {books: bookList},
  });
  res.code(200);
  return res;
};

// const getBooksListByName = (req, h) => {
//   const params = req.query;
//   const name = params.name;
//   const bookList = books.filter((val) => val.name.toLowerCase().includes(toLowerCase(name)));
//   const res = h.response({
//     status: 'success',
//     data: {books: bookList},
//   });
//   res.code(200);
//   return res;
// };

const getBooksById = (req, h) => {
  const {bookId} = req.params;
  //   console.log(bookId);
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
  console.log(bookId);
  console.log(books);
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;
  const finished = false;
  const updatedAt = new Date().toISOString();

  const book = books.find((item) => item.id === bookId);
  console.log(book);
  if (book == undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. Id tidak ditemukan',
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
      message: 'Gagal memperbaharui buku. Mohon isi Nama buku ',
    });
    res.code(400);
    return res;
  }

  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const index = books.findIndex((book) => book.id === bookId);
  //   console.log(index);
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
    // console.log(notes[index]);
    res.code(200);
    return res;
  }
};

const deleteBookById = (req, h) => {
  const {bookId} = req.params;
  console.log(bookId);
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
