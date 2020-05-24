import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  // fix "React Hook useEffect has a missing dependency" warning 
  // by memoizing the getImages function 
  const getImages = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    apiUrl += `&client_id=${accessKey}`;
    apiUrl += `&page=${page}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const imagesFromApi = data.results ?? data;
        (page === 1) ? setImages(imagesFromApi) : setImages((images) => [...images, ...imagesFromApi]);
      });
  }, [page, query]);

  useEffect(() => {
    getImages();
  }, [page, getImages]);

  function searchImages(e) {
    e.preventDefault();
    setPage(1);
    getImages();
  }

  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">Required: Get your Unsplash API KEY first!</a>
    )
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>
      <form onSubmit={searchImages}>
        <input type="text" placeholder="Search Unsplash..." value={query} onChange={e => setQuery(e.target.value)} />
        <button>Search</button>
      </form>
      <InfiniteScroll
        dataLength={images.length}
        next={() => setPage(page => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}>
        <div className="image-grid">
          {images.map((image, index) => (
            <a className="image" key={index} href={image.links.html} target="_blank" rel="noopener noreferrer">
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll >
    </div >
  );
}

export default App;
