import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import DOMPurify from 'dompurify';

export default function BookDetails({ favourites, setFavourites }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [isFavourite, setIsFavourite] = useState(
    favourites.some((el) => el.id === bookId)
  );

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const fetchPromise = fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        ).then((res) => {
          if (!res.ok) throw new Error("Book not found");
          return res.json();
        });

        toast.promise(fetchPromise, {
          pending: "Loading book details...",
          success: "Book loaded successfully",
          error: {
            render({ data }) {
              return data.message || "Failed to load book details";
            },
          },
        });

        const data = await fetchPromise;
        setBookDetails(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!bookDetails) {
    return null;
  }

  const handleFavouriteClick = () => {
    const willBeFavourite = !isFavourite;
    if (willBeFavourite) {
      setFavourites((prev) => [...prev, bookDetails]);
      toast.success("Added to favourites");
    } else {
      setFavourites((prev) => prev.filter((el) => el.id !== bookDetails.id));
      toast.info("Removed from favourites");
    }
    setIsFavourite(willBeFavourite);
  };

  const book = bookDetails.volumeInfo;

  return (
    <div className="book-details">
      <div className="book-cover">
        {book.imageLinks ? (
          <img
            src={book.imageLinks.thumbnail?.replace("http://", "https://")}
            alt={book.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML = '<div class="no-image"><FaBookOpen size="48" /></div>';
            }}
          />
        ) : (
          <div className="no-image">
            <FaBookOpen size={48} />
          </div>
        )}
      </div>

      <div className="book-info">
        <h1 className="book-title">{book.title}</h1>

        {book.authors?.length > 0 && (
          <div className="book-authors">
            {book.authors.map((author, index) => (
              <span key={index} className="book-author">
                {author}
              </span>
            ))}
          </div>
        )}

        <div className="book-meta">
          {book.publishedDate && (
            <div className="book-meta-item">
              <FaCalendarAlt />
              <span>{book.publishedDate}</span>
            </div>
          )}

          {book.pageCount && (
            <div className="book-meta-item">
              <FaBookOpen />
              <span>{book.pageCount} pages</span>
            </div>
          )}

          {book.averageRating && (
            <div className="book-meta-item">
              <span>⭐ {book.averageRating}/5</span>
            </div>
          )}
        </div>

        {book.description ? (
          <div
            className="book-description"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(book.description),
            }}
          />
        ) : (
          <div className="book-description">No description available.</div>
        )}

        <div className="book-actions">
          <button
            className={`action-button like-button ${
              isFavourite ? "liked" : ""
            }`}
            onClick={handleFavouriteClick}
          >
            <FaHeart className="favourite-icon" />
            {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          </button>

          <button
            className="action-button back-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}