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
              <p class="info-item"><b>Likes</b> <span class="info-item__wrapper">${likes}</span></p>
              <p class="info-item"><b>Views</b> <span class="info-item__wrapper">${views}</span></p>
              <p class="info-item"><b>Comments</b> <span class="info-item__wrapper">${comments}</span></p>
              <p class="info-item"><b>Downloads</b> <span class="info-item__wrapper">${downloads}</span></p>
            </div>
          </a>
        </div>`
    )
    .join('');
}

export { createMarkup };
