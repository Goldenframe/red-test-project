import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import BookDetails from './pages/BookDetails';
import { ToastContainer } from 'react-toastify';
function App() {

  const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favouriteBooks')) || []);

  useEffect(() => {
    localStorage.setItem('favouriteBooks', JSON.stringify(favourites))
  }, [favourites])

  return (
    <BrowserRouter>
      <div className='App'>
        <nav>
          <Link to={'/'}>Home</Link>
          <Link to={'/favorites'}>Favorites</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home favourites={favourites} setFavourites={setFavourites} />} />
        <Route path="/favorites" element={<Favourites favourites={favourites} setFavourites={setFavourites} />} />
        <Route path="/book/:bookId" element={<BookDetails favourites={favourites} setFavourites={setFavourites} />} />
      </Routes>
      <ToastContainer
        position="top-right" 
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>

  );
}

export default App;
