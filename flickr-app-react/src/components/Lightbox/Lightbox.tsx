import React from "react";

import { useLightboxContext } from "../../context/LightboxContext";
import { Photo } from "../../data/flickr-api";

import "./Lightbox.css";
import useKey from "../../hooks/useKey";

interface Props {
  photos: Photo[];
}

const Lightbox: React.FunctionComponent<Props> = ({ photos }) => {
  const { currentPhotoIndex, isOpen, dispatch } = useLightboxContext();

  function goPrevious(e: any) {
    e.stopPropagation();

    if (currentPhotoIndex === 0) {
      return;
    }

    dispatch({ type: "previous" });
  }

  function goNext(e: any) {
    e.stopPropagation();

    if (currentPhotoIndex === photos.length - 1) {
      return;
    }

    dispatch({ type: "next" });
  }

  function close() {
    dispatch({ type: "close" });
  }

  useKey("ArrowLeft", goPrevious);
  useKey("ArrowRight", goNext);
  useKey("Escape", close);

  if (!isOpen) {
    return null;
  }

  const photo = photos[currentPhotoIndex];

  return (
    <div className="lightbox" onClick={close}>
      <div className="content">
        <button className="lightbox-button close" onClick={close}>
          &times;
        </button>

        <img src={photo.src} alt={photo.title} />

        <button
          className="lightbox-button previous"
          disabled={currentPhotoIndex === 0}
          onClick={goPrevious}
        >
          &larr;
        </button>

        <button
          className="lightbox-button next"
          disabled={currentPhotoIndex === photos.length - 1}
          onClick={goNext}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
