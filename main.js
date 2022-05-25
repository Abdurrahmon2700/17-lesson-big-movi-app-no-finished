// Form ichidagi elementlarni chaqirib olish
elForm = $(".form");
elFilmNameINput = $(".film_name-input", elForm);
elFilmCategory = $(".film_category", elForm);
elFilmRating = $(".film_rating", elForm);
elFilmSort = $(".film-sort", elForm);


// Natija chiqadigan list ya'ni ul
let elResult = $(".js_result_list");

// Templateni chaqirib olish
let elTemplate = $(".template_movi").content;

// Listni qirqib olish
movies.splice(100);



// Katta arrayni xossalarini to'g'rilab chiqish
let normalizedMovi = movies.map(movie => {
  return {
    title: movie.Title.toString(),
    fulltitle: movie.fulltitle,
    year: movie.movie_year,
    categories: movie.Categories.split("|").join(", "),
    summary: movie.summary,
    imgurl: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    imdbid: movie.imdb_id,
    imdbrating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    youtubeid: `https://www.youtube.com/watch?v=${movie.ytid}`
  }
})


let createGenreSelectOptions = function () {
  let movieCategories = [];

  normalizedMovi.splice(50).forEach(function (movie) {
    movie.categories.split(", ").forEach(function (category) {
      if (!movieCategories.includes(category)) {
        movieCategories.push(category);
      }
    })
  });

  movieCategories.sort();

  let elOptionsFragment = document.createDocumentFragment();

  movieCategories.forEach(function (category) {
    let newElCategoryOption = elCreateElement("option", "", category);
    newElCategoryOption.value = category;

    elOptionsFragment.append(newElCategoryOption);
    elFilmCategory.append(elOptionsFragment)
  });
}
createGenreSelectOptions();


let renderMovies = function (searchResults) {
  elResult.innerHTML = "";

  let elResultFragment = document.createDocumentFragment();

  searchResults.forEach(function (movie) {
    let elMovie = elTemplate.cloneNode(true);

    $(".js_film_img", elMovie).src = movie.imgurl;
    $(".js_card_title", elMovie).textContent = movie.title;
    $(".js_card_year", elMovie).textContent = movie.year;
    $(".js_card_rating", elMovie).textContent = movie.imdbrating;
    $(".more_btn", elMovie).href = movie.youtubeid;
    $(".js_card_genre", elMovie).textContent = movie.categories;

    elResultFragment.appendChild(elMovie);
  })
  elResult.appendChild(elResultFragment);
}
renderMovies(normalizedMovi)


let sortObjectsAZ = function (array) {
  return array.sort(function (a, b) {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else {
      return 0;
    }
  })
}

let sortSearchResults = function (results, sortType) {
  if (sortType === "AZ") {
    sortObjectsAZ(results);
  } else if (sortType === "ZA") {
    sortObjectsAZ(results).reverse();
  }
}

let findMovies = function (title, rating) {
  return normalizedMovi.filter(function (movie) {
    return movie.title.match(title) && movie.imdbrating >= rating;
  })
}

elForm.addEventListener("change", function (e) {
  e.preventDefault();

  let searchTitle = elFilmNameINput.value.trim();
  let movieTitleRegex = new RegExp(searchTitle, "gi");

  let minimumRating = Number(elFilmRating.value);
  let sorting = elFilmSort.value;

  let searchResults = findMovies(movieTitleRegex, minimumRating);

  sortSearchResults(searchResults, sorting);

  renderMovies(searchResults);

})