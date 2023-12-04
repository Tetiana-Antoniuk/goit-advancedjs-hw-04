import axios from 'axios';

const API_KEY = '40948305-cf809bb8656872e1f12174930';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;

async function fetchImages(searchInput, page) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchInput}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);

  return {
    data: response.data.hits,
    totalPages: Math.ceil(response.data.totalHits / perPage),
  };
}

export { fetchImages };
