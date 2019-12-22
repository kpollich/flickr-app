import React, { useState, useEffect } from "react";

import FlickrApi, { Photo } from "../../data/flickr-api";
import Gallery from "../Gallery/Gallery";
import Lightbox from "../Lightbox/Lightbox";

import "./App.css";

const App: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    setIsLoading(true);

    FlickrApi.getPhotos(page).then(newPhotos => {
      setPhotos(photos => [...photos, ...newPhotos]);
      setIsLoading(false);
    });
  }, [page]);

  function handleLoadMoreClick() {
    setPage(page + 1);
  }

  return (
    <main>
      <h1 className="title">Flickr Gallery</h1>

      <Lightbox photos={photos} />
      <Gallery photos={photos} />

      <button
        disabled={isLoading}
        className="load-more"
        onClick={handleLoadMoreClick}
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </main>
  );
};

export default App;
