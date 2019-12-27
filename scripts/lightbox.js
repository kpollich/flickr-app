class Lightbox {
  constructor(photos, onPrevClick = () => {}, onNextClick = () => {}) {
    this.photos = photos;
    this.onPrevClick = onPrevClick;
    this.onNextClick = onNextClick;
    this.isOpen = false;

    this.content = document.querySelector(".lightbox-content");
    this.container = document.querySelector(".lightbox");

    this.bindClose();
    this.bindKeyboardEvents();
  }

  openForPhoto(photoIndex) {
    this.close();

    const currentImageContainer = document.createElement("div");
    currentImageContainer.className = "lightbox-current-image";

    // Prevent closing the lightbox when the image area is clicked
    currentImageContainer.addEventListener("click", e => e.stopPropagation());

    const prevButton = this.createPrevButton(photoIndex);
    const nextButton = this.createNextButton(photoIndex);

    const photo = this.photos[photoIndex];
    const img = this.createImg(photo);

    currentImageContainer.appendChild(prevButton);
    currentImageContainer.appendChild(img);
    currentImageContainer.appendChild(nextButton);

    this.content.appendChild(currentImageContainer);

    this.show();
  }

  createImg(photo) {
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.title;
    return img;
  }

  createNextButton(photoIndex) {
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "lightbox-next";
    nextButton.innerHTML = "&rarr;";
    nextButton.disabled = photoIndex === this.photos.length - 1;
    nextButton.addEventListener("click", this.onNextClick);
    return nextButton;
  }

  createPrevButton(photoIndex) {
    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "lightbox-previous";
    prevButton.innerHTML = "&larr;";
    prevButton.disabled = photoIndex === 0;
    prevButton.addEventListener("click", this.onPrevClick);
    return prevButton;
  }

  bindClose() {
    const close = document.querySelector(".lightbox-close");

    close.addEventListener("click", () => this.close());
    this.container.addEventListener("click", () => this.close());
  }

  bindKeyboardEvents() {
    document.addEventListener("keydown", e => {
      if (!this.isOpen) {
        return;
      }

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
    this.isOpen = true;
  }

  close() {
    this.container.classList.add("hidden");
    this.content.innerHTML = "";
    this.isOpen = false;
  }
}
