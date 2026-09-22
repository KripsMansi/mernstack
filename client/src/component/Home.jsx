import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosinstance';

const emptyForm = {
  bookName: '',
  bookTitle: '',
  author: '',
  sellingPrice: '',
  publishDate: '',
};

const toDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [bookFormData, setBookFormData] = useState(emptyForm);

  const handleBookFormData = (e) => {
    const { name, value } = e.target;
    setBookFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getBooks = async ({ silent } = { silent: false }) => {
    try {
      const response = await axiosInstance.get('/get-books');
      setBooks(response.data.books || []);
      setTotalBooks(response.data.total || 0);
      if (!silent) {
        toast.success('Catalog loaded');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks({ silent: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      bookFormData.bookName === '' ||
      bookFormData.bookTitle === '' ||
      bookFormData.author === '' ||
      bookFormData.sellingPrice === '' ||
      bookFormData.publishDate === ''
    ) {
      toast.error('All fields are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...bookFormData,
        sellingPrice: Number(bookFormData.sellingPrice),
      };

      if (editingId) {
        const response = await axiosInstance.put(`/update-book/${editingId}`, payload);
        if (response.status === 200) {
          toast.success('Book updated successfully');
          setEditingId(null);
          setBookFormData(emptyForm);
          await getBooks({ silent: true });
        }
      } else {
        const response = await axiosInstance.post('/create-book', payload);
        if (response.status === 201 || response.status === 200) {
          toast.success('Book created successfully');
          setBookFormData(emptyForm);
          await getBooks({ silent: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setBookFormData({
      bookName: book.bookName || '',
      bookTitle: book.bookTitle || '',
      author: book.author || '',
      sellingPrice: book.sellingPrice ?? '',
      publishDate: toDateInput(book.publishDate),
    });
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setBookFormData(emptyForm);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this book from the catalog?');
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(`/delete-book/${id}`);
      if (response.status === 200) {
        toast.success('Book deleted successfully');
        if (editingId === id) {
          cancelEdit();
        }
        await getBooks({ silent: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;
    return books.filter((book) =>
      [book.bookName, book.bookTitle, book.author]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [books, search]);

  return (
    <div>
      <section id="home" className="relative overflow-hidden border-b border-stone-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[#8b4513] uppercase">
              MERN showcase project
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight text-[#1c1917] md:text-6xl">
              A calm catalog for the books you keep.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-stone-600">
              Add titles, track authors and prices, and keep a living shelf in MongoDB. Built with
              Express APIs and a React frontend you can demo end to end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="rounded-full bg-[#1c1917] px-5 py-2.5 text-sm font-medium text-white no-underline hover:bg-stone-800"
              >
                Open catalog
              </a>
              <a
                href="#about"
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 no-underline hover:border-stone-500"
              >
                How it works
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-stone-500">Live collection</p>
            <p className="font-display mt-2 text-5xl text-[#1c1917]">{totalBooks}</p>
            <p className="mt-1 text-stone-600">books stored in MongoDB</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#f7f3eb] p-3">
                <p className="text-xs text-stone-500">Stack</p>
                <p className="mt-1 text-sm font-semibold">MERN</p>
              </div>
              <div className="rounded-2xl bg-[#f7f3eb] p-3">
                <p className="text-xs text-stone-500">API</p>
                <p className="mt-1 text-sm font-semibold">REST</p>
              </div>
              <div className="rounded-2xl bg-[#f7f3eb] p-3">
                <p className="text-xs text-stone-500">UI</p>
                <p className="mt-1 text-sm font-semibold">React</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[#1c1917]">Book catalog</h2>
            <p className="mt-1 text-stone-600">
              Create a record, then edit or remove it from the shelf.
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, title, or author"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-[#8b4513] md:w-72"
          />
        </div>

        <form
          className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="md:col-span-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit book' : 'Add a book'}
            </h3>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="text-sm text-stone-600 underline">
                Cancel edit
              </button>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Book name</label>
            <input
              type="text"
              name="bookName"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-[#8b4513]"
              placeholder="e.g. Atomic Habits"
              value={bookFormData.bookName}
              onChange={handleBookFormData}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Book title</label>
            <input
              type="text"
              name="bookTitle"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-[#8b4513]"
              placeholder="Subtitle or edition"
              value={bookFormData.bookTitle}
              onChange={handleBookFormData}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Author</label>
            <input
              type="text"
              name="author"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-[#8b4513]"
              placeholder="Author name"
              value={bookFormData.author}
              onChange={handleBookFormData}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Selling price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="sellingPrice"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-[#8b4513]"
              placeholder="499"
              value={bookFormData.sellingPrice}
              onChange={handleBookFormData}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Publish date</label>
            <input
              type="date"
              name="publishDate"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 outline-none focus:border-[#8b4513]"
              value={bookFormData.publishDate}
              onChange={handleBookFormData}
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#8b4513] px-6 py-2.5 font-medium text-white hover:bg-[#6f3610] disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId ? 'Update book' : 'Add to catalog'}
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-[#f7f3eb] text-sm text-stone-700">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Book</th>
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Published</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-8 text-stone-500" colSpan={6}>
                      Loading catalog…
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-stone-500" colSpan={6}>
                      No books yet. Add the first title above.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, index) => (
                    <tr key={book._id} className="border-t border-stone-100">
                      <td className="px-4 py-4 text-stone-500">{index + 1}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#1c1917]">{book.bookName}</p>
                        <p className="text-sm text-stone-500">{book.bookTitle}</p>
                      </td>
                      <td className="px-4 py-4">{book.author}</td>
                      <td className="px-4 py-4">
                        ₹{Number(book.sellingPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4">{formatDate(book.publishDate)}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-stone-800 px-3 py-1.5 text-sm text-white"
                            onClick={() => handleEdit(book)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-lg bg-red-700 px-3 py-1.5 text-sm text-white"
                            onClick={() => handleDelete(book._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-display text-3xl text-[#1c1917]">About this project</h2>
          </div>
          <div className="md:col-span-2 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-semibold">MongoDB</h3>
              <p className="mt-2 text-sm text-stone-600">
                Each book is stored as a document with name, title, author, price, and publish date.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Express API</h3>
              <p className="mt-2 text-sm text-stone-600">
                REST routes under /mysite create, list, update, and delete records.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">React + Axios</h3>
              <p className="mt-2 text-sm text-stone-600">
                The catalog talks to the API, refreshes after every change, and shows toast feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-3xl bg-[#1c1917] px-6 py-12 text-[#f7f3eb] md:px-12">
          <h2 className="font-display text-3xl">Want to walk through the demo?</h2>
          <p className="mt-3 max-w-2xl text-stone-300">
            Use the catalog above to add a book, edit a title, then delete it. That full loop is the
            project: a working MERN CRUD app with a public-facing layout.
          </p>
          <a
            href="#catalog"
            className="mt-6 inline-block rounded-full bg-[#c4a35a] px-5 py-2.5 text-sm font-semibold text-[#1c1917] no-underline"
          >
            Back to catalog
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
