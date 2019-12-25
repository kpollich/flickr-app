class Gallery {
  constructor(flickrApi) {
    this.flickrApi = flickrApi;
    this.flickrPage = 1;

    this.photos = [];
    this.currentPhotoIndex = 0;
    this.bindLoadMoreButton();
  }

  async init(photos) {
    if (!photos) {
      const initialPhotos = await this.flickrApi.getFlickrPhotos(
        this.flickrPage
      );

      this.photos = initialPhotos;
    } else {
      this.photos = [...this.photos, ...photos];
    }

    this.lightbox = new Lightbox(
      this.photos,
      this.goToPreviousPhoto.bind(this),
      this.goToNextPhoto.bind(this)
    );

    this.renderPhotos();
  }

  bindLoadMoreButton() {
    const loadMore = document.querySelector("button.load-more");

    loadMore.classList.remove("hidden");
    loadMore.addEventListener("click", () => {
      this.flickrPage++;

      flickrApi.getFlickrPhotos(this.flickrPage).then(photos => {
        this.init(photos);
      });
    });
  }

  renderPhotos() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    this.photos.forEach(({ src, title }, index) => {
      const buttonNode = document.createElement("button");
      buttonNode.classList.add("gallery-button");

      buttonNode.addEventListener("click", () => {
        this.currentPhotoIndex = index;
        this.lightbox.openForPhoto(this.currentPhotoIndex);
      });

      const imgNode = document.createElement("img");
      imgNode.alt = title;
      imgNode.src = src;

      buttonNode.appendChild(imgNode);
      gallery.appendChild(buttonNode);
    });
  }

  goToPreviousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
      this.lightbox.openForPhoto(this.currentPhotoIndex);
    }
  }

  goToNextPhoto() {
    if (this.currentPhotoIndex < this.photos.length - 1) {
      this.currentPhotoIndex++;
      this.lightbox.openForPhoto(this.currentPhotoIndex);
    }
  }
}
