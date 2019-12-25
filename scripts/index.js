const FLICKR_API_KEY = "087954ad3025dcf19bdb41e0b02e22d4";
const flickrApi = new FlickrApi(FLICKR_API_KEY);

const gallery = new Gallery(flickrApi);
gallery.init();
