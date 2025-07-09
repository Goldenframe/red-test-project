import React from "react";
import BookItem from "../components/BookItem";

export default function Favourites({ favourites, setFavourites }) {
  if (!favourites || favourites.length === 0) {
    return <p>No favourites yet</p>;
  }

  return (
    <div className="books-container">
      {favourites && Array.isArray(favourites) ? (
        favourites.map((book) => {
          return (
            <BookItem
              book={book}
              key={book.id}
              setFavourites={setFavourites}
              favourites={favourites}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
