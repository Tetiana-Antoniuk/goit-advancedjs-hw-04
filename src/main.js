import axios from 'axios';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

let page = 1;

const inputForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.js-load');

inputForm.addEventListener('submit', handlerSubmit);
loadButton.addEventListener('click', handlerLoad);

async function handlerLoad() {
  page += 1;
  try {
    const data = await fetchImages(inputForm.elements.searchQuery.value, page);
    gallery.innerHTML += createMarkup(data);

    if (page >= data.totalPages) {
      loadButton.classList.replace('load-more', 'load-more-hidden');
    }
    lightbox.refresh();
    smoothScroll();
  } catch (error) {
    console.error('error', error);
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong! Try reloading the page!',
      position: 'topRight',
    });
  }
}

async function handlerSubmit(evt) {
  evt.preventDefault();

  page = 1;

  const searchInput = evt.currentTarget.elements.searchQuery.value;

  try {
    const data = await fetchImages(searchInput, page);

    if (data.data.length === 0) {
      gallery.innerHTML = '';
      loadButton.classList.replace('load-more', 'load-more-hidden');

      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
      });
    } else {
      gallery.innerHTML = createMarkup(data);

      if (page < data.totalPages) {
        loadButton.classList.replace('load-more-hidden', 'load-more');
      }
    }
    lightbox.refresh();
    smoothScroll();
  } catch (error) {
    console.error('error', error);
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong! Try reloading the page!',
      position: 'topRight',
    });
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function fetchImages(searchInput, page) {
  const API_KEY = '40948305-cf809bb8656872e1f12174930';
  const BASE_URL = 'https://pixabay.com/api/';
  const perPage = 40;

  const url = `${BASE_URL}?key=${API_KEY}&q=${searchInput}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.hits) {
      return {
        data: response.data.hits,
        totalPages: Math.ceil(response.data.totalHits / perPage),
      };
    } else {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong! Try reloading the page!',
      position: 'topRight',
    });
    throw error;
  }
}

function createMarkup(data) {
  const { data: images } = data;
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
          <a class="photo-card__link" href="${largeImageURL}">
            <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes ${likes}</b></p>
              <p class="info-item"><b>Views ${views}</b></p>
              <p class="info-item"><b>Comments ${comments}</b></p>
              <p class="info-item"><b>Downloads ${downloads}</b></p>
            </div>
          </a>
        </div>`
    )
    .join('');
}

const lightbox = new SimpleLightbox('.gallery a');
