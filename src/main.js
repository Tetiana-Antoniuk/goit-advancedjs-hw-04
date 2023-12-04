import { fetchImages } from './js/api-service';
import { createMarkup } from './js/create-markup';
import { smoothScroll } from './js/smooth-scroll';
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
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
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

  const searchInput = evt.currentTarget.elements.searchQuery.value.trim();

  if (!searchInput) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

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
  } catch (error) {
    console.error('error', error);
  }
}

const lightbox = new SimpleLightbox('.gallery a');
