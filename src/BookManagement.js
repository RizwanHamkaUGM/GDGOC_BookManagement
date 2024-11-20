import React, { useState, useEffect } from "react";

const baseURL = "https://flask-hello-world-gules-gamma-94.vercel.app/api/books";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_at: "",
  });
  const [editBook, setEditBook] = useState(null);

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseURL);
      const data = await response.json();
      setBooks(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add book
  const addBook = async (e) => {
    e.preventDefault();
    const newBookData = {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      published_at: newBook.published_at.trim(),
    };

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBookData),
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

  // Update book
  const updateBook = async (e) => {
    e.preventDefault();
    if (!editBook) return;

    const updatedBookData = {
      title: editBook.title.trim(),
      author: editBook.author.trim(),
      published_at: editBook.published_at.trim(),
    };

    try {
      const response = await fetch(`${baseURL}/${editBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookData),
      });

      if (response.ok) {
        alert("Book updated successfully");
        fetchBooks();
        setEditBook(null); // Clear the form
      } else {
        alert("Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`${baseURL}/${id}`, {
          method: "DELETE",
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

  // Handle form changes
  const handleNewBookChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleEditBookChange = (e) => {
    setEditBook({ ...editBook, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Book Management</h1>

      {/* Add Book Form */}
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
                  onChange={handleNewBookChange}
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
                  onChange={handleNewBookChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  name="published_at"
                  value={newBook.published_at}
                  onChange={handleNewBookChange}
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

      {/* Book Table */}
      {loading ? (
        <div className="d-flex justify-content-center my-3">
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

      {/* Edit Book Modal */}
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
                      onChange={handleEditBookChange}
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
                      onChange={handleEditBookChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-published-at" className="form-label">
                      Published Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="edit-published-at"
                      name="published_at"
                      value={editBook.published_at}
                      onChange={handleEditBookChange}
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
