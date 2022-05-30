// Form ichidagi elementlarni chaqirib olish
elForm = $(".form");
elFilmNameINput = $(".film_name-input", elForm);
elFilmCategory = $(".film_category", elForm);
elFilmRating = $(".film_rating", elForm);
elFilmSort = $(".film-sort", elForm);


let elH1111 = document.querySelector(".xek");
elResultBookmarkList = $(".bookmark_list");



// Modal content div 
elModalContent = $(".modal");

// Natija chiqadigan list ya'ni ul
let elResult = $(".js_result_list");

// Templateni chaqirib olish
let elTemplate = $(".template_movi").content;

// Bookmark templatini chaqirib olish

// Listni qirqib olish
movies.splice(100);


elBookmarkTemplate = $(".bookmark_template").content;

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

let bookMark = JSON.parse(localStorage.getItem("films")) || [];
bookMarkRender(bookMark)

elFilmCategory.addEventListener("click", (e) => {
  sortCategory(e.target.value);
})

function sortCategory(item) {
  let foundCategpory = normalizedMovi.filter(element => item ? element.categories.slice("|", 5) == item.slice(0, 5) : true)
  renderMovies(foundCategpory)
}



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
    elFilmCategory.append(elOptionsFragment);
  });
}
createGenreSelectOptions();


function renderMovies(searchResults) {
  elResult.innerHTML = "";

  let elResultFragment = document.createDocumentFragment();

  searchResults.forEach(function (movie) {
    let elMovie = elTemplate.cloneNode(true);
    $(".js_result_list_item", elMovie).dataset.imdbid = movie.imdbid;
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
renderMovies(normalizedMovi);


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

  sortCategory();

  sortSearchResults(searchResults, sorting);

  renderMovies(searchResults);

})

// modal ga normalizedMovi arrayidan ma'lumotlarni push qilisj
let updateModalContent = function (movie) {
  $(".modal_film_img").src = movie.imgurl;
  $(".js_film_title", elModalContent).textContent = movie.title;
  $(".js_film_full_title", elModalContent).textContent = movie.fulltitle;
  $(".js_film_rating", elModalContent).textContent = movie.year;
  $(".js_film_runtime", elModalContent).textContent = movie.runtime
  $(".js_film_language", elModalContent).textContent = movie.language;
  $(".js_film_categories", elModalContent).textContent = movie.categories;
  $(".js_film_summary", elModalContent).textContent = movie.summary;
}


// function bookmarkga push qiladigan 
function bookMarkRender(array) {
  elResultBookmarkList.innerHTML = "";
  let elResultFragment = document.createDocumentFragment();

  array.forEach(function (movie) {
    let elMovie = elBookmarkTemplate.cloneNode(true);
    $(".js_bookmark_film_title", elMovie).textContent = movie.title;
    $(".js_film_bookmark_rating", elMovie).textContent = movie.fulltitle;
    $(".js_film_year", elMovie).textContent = movie.Number;
    $(".delete_bookmark", elMovie).addEventListener("click", (e) => {
      let index = bookMark.findIndex(element => element.title == movie.title)
      bookMark.splice(index, 1);
      bookMarkRender(bookMark);
      localStorage.setItem("films", JSON.stringify(bookMark));
    })
    elResultFragment.appendChild(elMovie);

  })
  elResultBookmarkList.appendChild(elResultFragment);
}

// let elDeleteBookmarkBtn = doum

// elDeleteBookmarkBtn.addEventListener("click", (e) => {
//   console.log("sdf");
// })

//saqalangan kinolarni yig'ib boruvchi array  
elResult.addEventListener("click", function (e) {
  if (e.target.matches(".modal-open")) {
    let movieImdbid = e.target.closest(".js_result_list_item").dataset.imdbid;

    let foundMovi = normalizedMovi.find(function (movie) {
      return movie.imdbid === movieImdbid
    })

    updateModalContent(foundMovi)
  }

  if (e.target.matches(".bookmark_btn")) {
    let movieImdbid = e.target.closest(".js_result_list_item").dataset.imdbid;
    let findId = normalizedMovi.find(item => item.imdbid == movieImdbid)
    if (!bookMark.includes(findId)) {
      bookMark.push(findId);
      localStorage.setItem("films", JSON.stringify(bookMark))
    }
    bookMarkRender(bookMark)
  }
})