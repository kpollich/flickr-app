class Lightbox {
  constructor(photos, onPrevClick = () => {}, onNextClick = () => {}) {
    this.photos = photos;
    this.onPrevClick = onPrevClick;
    this.onNextClick = onNextClick;

    this.content = document.querySelector(".lightbox-content");
    this.container = document.querySelector(".lightbox");

    this.bindClose();
    this.bindKeyboardEvents();
  }

  openForPhoto(photoIndex) {
    this.close();

    const currentImageContainer = document.createElement("div");
    currentImageContainer.className = "lightbox-current-image";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "lightbox-previous";
    prevButton.innerHTML = "&larr;";
    prevButton.disabled = photoIndex === 0;
    prevButton.addEventListener("click", this.onPrevClick);

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "lightbox-next";
    nextButton.innerHTML = "&rarr;";
    nextButton.disabled = photoIndex === this.photos.length - 1;
    nextButton.addEventListener("click", this.onNextClick);

    const photo = this.photos[photoIndex];
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.title;

    currentImageContainer.appendChild(prevButton);
    currentImageContainer.appendChild(img);
    currentImageContainer.appendChild(nextButton);

    this.content.appendChild(currentImageContainer);

    this.show();
  }

  bindClose() {
    const close = document.querySelector(".lightbox-close");

    close.addEventListener("click", () => {
      this.close();
    });
  }

  bindKeyboardEvents() {
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") {
        this.onPrevClick();
      } else if (e.key === "ArrowRight") {
        this.onNextClick();
      } else if (e.key === "Escape") {
        this.close();
      }
    });
  }

  show() {
    this.container.classList.remove("hidden");
  }

  hide() {
    this.container.classList.add("hidden");
  }

  close() {
    this.hide();
    this.content.innerHTML = "";
  }
}
