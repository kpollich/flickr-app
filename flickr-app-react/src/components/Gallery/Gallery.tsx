import React from "react";

import { Photo } from "../../data/flickr-api";
import { useLightboxContext } from "../../context/LightboxContext";

import "./Gallery.css";

interface Props {
  photos: Photo[];
}

const Gallery: React.FunctionComponent<Props> = ({ photos }) => {
  const { dispatch } = useLightboxContext();

  return (
    <div className="gallery">
      {photos.map((photo, index) => (
        <button
          key={index}
          onClick={() => dispatch({ type: "setPhoto", payload: { index } })}
        >
          <img src={photo.src} alt={photo.title} />
        </button>
      ))}
    </div>
  );
};

export default Gallery;
