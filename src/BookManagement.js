import React, { useState, useEffect } from "react";

const baseURL = "https://script.google.com/macros/s/AKfycbyXnHzYR2Ab6EaQkIqO-DJTgnY2zg3Enx3K31RCHKnn-gAR8edenjgfioUH5XYtoOYL/exec";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_at: "",
  });
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}?action=get_books`);
      const data = await response.json();
      setBooks(data.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    const payload = {
      action: "add",
      book: newBook,
    };

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Book added successfully");
        fetchBooks();
        setNewBook({ title: "", author: "", published_at: "" });
      } else {
        alert("Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    if (!editBook) return;

    const payload = {
      action: "update",
      book_id: editBook.id,
      updated_book: {
        title: editBook.title,
        author: editBook.author,
        published_at: editBook.published_at,
      },
    };

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Book updated successfully");
        fetchBooks();
        setEditBook(null);
      } else {
        alert("Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const payload = {
        action: "delete",
        book_id: id,
      };

      try {
        const response = await fetch(baseURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Book deleted successfully");
          fetchBooks();
        } else {
          alert("Failed to delete book");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Book Management</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h5>Add New Book</h5>
          <form onSubmit={addBook}>
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  name="title"
                  value={newBook.title}
                  onChange={(e) => handleInputChange(e, setNewBook)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Author"
                  name="author"
                  value={newBook.author}
                  onChange={(e) => handleInputChange(e, setNewBook)}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  name="published_at"
                  value={newBook.published_at}
                  onChange={(e) => handleInputChange(e, setNewBook)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add Book
            </button>
          </form>
        </div>
      </div>
      {loading ? (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.published_at}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => setEditBook(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editBook && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditBook(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateBook}>
                  <div className="mb-3">
                    <label htmlFor="edit-title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-title"
                      name="title"
                      value={editBook.title}
                      onChange={(e) => handleInputChange(e, setEditBook)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-author"
                      name="author"
                      value={editBook.author}
                      onChange={(e) => handleInputChange(e, setEditBook)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-published_at" className="form-label">
                      Published Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="edit-published_at"
                      name="published_at"
                      value={editBook.published_at}
                      onChange={(e) => handleInputChange(e, setEditBook)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Book
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditBook(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
