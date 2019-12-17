const FLICKR_API_KEY = "087954ad3025dcf19bdb41e0b02e22d4";
const FLICKR_API_URL = "https://www.flickr.com/services/rest/";

let flickrPage = 1;
let galleryPhotos = [];
let currentPhotoIndex = 0;

getFlickrPhotos(flickrPage).then(photos => {
  galleryPhotos = photos;
  renderPhotos();

  const loadMore = document.querySelector("button.load-more");

  loadMore.classList.remove("hidden");
  loadMore.addEventListener("click", () => {
    flickrPage = flickrPage + 1;

    getFlickrPhotos().then(photos => {
      galleryPhotos = [...galleryPhotos, ...photos];
      renderPhotos();
    });
  });

  const lightbox = document.querySelector(".lightbox");

  lightbox.addEventListener("click", e => {
    if (!e.target) {
      return;
    }

    if (e.target.classList.contains("lightbox-close")) {
      lightbox.classList.add("hidden");
    } else if (e.target.classList.contains("lightbox-previous")) {
      goToPreviousImage();
    } else if (e.target.classList.contains("lightbox-next")) {
      goToNextImage();
    }
  });

  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("hidden")) {
      return;
    }

    if (e.keyCode === 37) {
      goToPreviousImage();
    }

    if (e.keyCode === 39) {
      goToNextImage();
    }

    if (e.keyCode === 27) {
      lightbox.classList.add("hidden");
    }
  });
});

function getFlickrPhotos() {
  const endpoint = `${FLICKR_API_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=scenery,space,mountains&per_page=8&page=${flickrPage}&format=json`;

  return fetch(endpoint)
    .then(res => res.text())
    .then(text => {
      // Flickr's API is somewhat antiquated, and they return a function body for JSON
      // responses. So we do some less-than-ideal regex massaging here to get a plain
      // old JSON object back instead.
      const responseRegex = /^jsonFlickrApi\((.*)\)$/;

      const match = text.match(responseRegex);

      if (!match.length) {
        console.error("Error mapping Flickr API response", error);
        return null;
      }

      const data = JSON.parse(match[1]);

      return data.photos.photo.map(photo => {
        return {
          src: getFlickrUrl({
            farmId: photo.farm,
            serverId: photo.server,
            id: photo.id,
            secret: photo.secret
          }),
          title: photo.title || "Untitled"
        };
      });
    });
}

function getFlickrUrl({ farmId, serverId, id, secret }) {
  return `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`;
}

function renderPhotos() {
  const gallery = document.querySelector(".gallery");
  const lightbox = document.querySelector(".lightbox");

  gallery.innerHTML = "";

  galleryPhotos.forEach(({ src, title }, index) => {
    const buttonNode = document.createElement("button");
    const imgNode = document.createElement("img");

    imgNode.alt = title;
    imgNode.src = src;

    buttonNode.classList.add("gallery-button");

    buttonNode.addEventListener("click", () => {
      currentPhotoIndex = index;
      renderLightbox();

      lightbox.classList.remove("hidden");
    });

    buttonNode.appendChild(imgNode);
    gallery.appendChild(buttonNode);
  });
}

function renderLightbox() {
  const photo = galleryPhotos[currentPhotoIndex];
  const lightbox = document.querySelector(".lightbox");

  const lightboxTemplate = `
    <div class="lightbox-current-image">
      <button class="lightbox-previous" type="button">&larr;</button>
      <img src="${photo.src}" alt="${photo.title}" />
      <button class="lightbox-next" type="button">&rarr;</button>
    </div>

    <div class="lightbox-strip">
      ${galleryPhotos
        .map(
          ({ src, title }, i) =>
            `<img src="${src}" alt="${title}" class=${
              i === currentPhotoIndex ? "current" : ""
            } />`
        )
        .join("\n")}
    </div>
  `;

  lightbox.classList.remove("hidden");
  document.querySelector(".lightbox-content").innerHTML = lightboxTemplate;

  if (currentPhotoIndex === 0) {
    document.querySelector(".lightbox-previous").disabled = true;
  }

  if (currentPhotoIndex === galleryPhotos.length - 1) {
    document.querySelector(".lightbox-next").disabled = true;
  }
}

function goToPreviousImage() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    renderLightbox();
  }
}

function goToNextImage() {
  if (currentPhotoIndex < galleryPhotos.length) {
    currentPhotoIndex++;
    renderLightbox();
  }
}
