const FLICKR_API_KEY = "087954ad3025dcf19bdb41e0b02e22d4";
const FLICKR_API_URL = "https://www.flickr.com/services/rest/";

export interface Photo {
  src: string;
  title: string;
}

export interface FlickrFields {
  farmId: string;
  serverId: string;
  id: string;
  secret: string;
}

export default class FlickrApi {
  static async getPhotos(flickrPage: number = 1): Promise<Photo[]> {
    const endpoint = `${FLICKR_API_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=scenery,space,mountains&per_page=8&page=${flickrPage}&format=json`;

    const res = await fetch(endpoint);
    const text = await res.text();

    const responseRegex = /^jsonFlickrApi\((.*)\)$/;

    const match = text.match(responseRegex);

    if (!match || !match.length) {
      throw new Error("Error mapping Flickr API response");
    }

    const data = JSON.parse(match[1]);

    return data.photos.photo.map((photo: any) => {
      return {
        src: FlickrApi.getFlickrUrl({
          farmId: photo.farm,
          serverId: photo.server,
          id: photo.id,
          secret: photo.secret
        }),
        title: photo.title || "Untitled"
      } as Photo;
    });
  }

  static getFlickrUrl({ farmId, serverId, id, secret }: FlickrFields): string {
    return `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`;
  }
}
