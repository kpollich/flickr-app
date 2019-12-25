const FLICKR_API_URL = "https://www.flickr.com/services/rest/";

class Flickr {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getFlickrPhotos(page) {
    const endpoint = `${FLICKR_API_URL}?method=flickr.photos.search&api_key=${this.apiKey}&tags=scenery,space,mountains&per_page=8&page=${page}&format=json`;

    const res = await fetch(endpoint);
    const text = await res.text();

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
        src: this.getFlickrUrl({
          farmId: photo.farm,
          serverId: photo.server,
          id: photo.id,
          secret: photo.secret
        }),
        title: photo.title || "Untitled"
      };
    });
  }

  // See https://www.flickr.com/services/api/misc.urls.html
  getFlickrUrl({ farmId, serverId, id, secret }) {
    return `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`;
  }
}
