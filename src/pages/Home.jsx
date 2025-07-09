import { useEffect, useState } from "react";
import BookItem from "../components/BookItem";
import { toast } from "react-toastify";

export default function Home({ favourites, setFavourites }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("JavaScript");
  const [query, setQuery] = useState("JavaScript");
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("");
  const maxResult = 20;

  const fetchData = async (query, startIndex) => {
    if (loading) return;
    setLoading(true);
    try {
      let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResult}`;
      if (filter) url += `&filter=${filter}`;

      const fetchPromise = fetch(url).then((res) => res.json());
      toast.promise(fetchPromise, {
        pending: "Loading...",
        success: {
          render({ data }) {
            return data.items.length > 1
              ? `${data.items.length} books have been loaded`
              : `1 book has been loaded`;
          },
        },
        error: {
          render({ data }) {
            return data?.message || "Failed to load books. Please try again";
          },
        },
      });
      const data = await fetchPromise;

      if (!data.items || data.items.length < maxResult) setHasMore(false);
      setBooks((prev) => [...prev, ...(data.items || [])]);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(query, startIndex);
  }, [query, startIndex, filter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBooks([]);
    setStartIndex(0);
    setHasMore(true);
    if (searchInput !== query) {
      setQuery(searchInput);
    } else {
      fetchData(query, 0);
    }
  };

  const handleSelect = (e) => {
    setBooks([]);
    setStartIndex(0);
    setHasMore(true);
    setFilter(e.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setStartIndex((prev) => prev + maxResult);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button>Search</button>
      </form>
      <select onChange={handleSelect}>
        <option value="">all</option>
        <option value="ebooks">ebooks</option>
        <option value="free-ebooks">free-ebooks</option>
        <option value="full">full</option>
        <option value="paid-ebooks">paid-ebooks</option>
        <option value="partial">partial</option>
      </select>
      <div className="books-container">
        {books &&
          books.length > 0 &&
          books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              favourites={favourites}
              setFavourites={setFavourites}
            />
          ))}
        {!loading && books.length === 0 && <p>Книг нет</p>}{" "}
      </div>
    </div>
  );
}
