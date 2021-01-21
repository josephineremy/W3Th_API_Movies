// GENERAL JAVASCRIPT

let selector = document.getElementById("movies");

const inputElement = document.querySelector('input[type="text"]');
document.querySelector('.searchMovie').addEventListener('submit', (event) => {
  event.preventDefault();
  const keywordInputValue = inputElement.value;
  console.log(keywordInputValue)
  fetchMovies(keywordInputValue);
});

const fetchMovies = async (keywordInputValue) => {

fetch ('http://www.omdbapi.com/?s='+ keywordInputValue +'&apikey=4f5b8e69&r=json')
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    return response;
  })
  .then((response) => {
    selector.innerHTML = "";
    response.Search.forEach((film) => {
    showSelectedMovies(
        selector,
        film.Title,
        film.Year,
        film.imdbID,
        film.Poster
      );
    });
    document.querySelectorAll("#movies input").forEach((readmoreButton) => {
      readmoreButton.addEventListener("click", function() {
        readmoreOption(readmoreButton.id)});
    });
  })
  .catch((error) => console.error(error));
}

const showSelectedMovies = (selector, title, year, imdbID, poster) => {
  selector.innerHTML += `
      <div class="film row">
        <div class="col-lg-4 col-md-4 col-sm-10 text-center">
          <img src="${poster}">
        </div> 
        <div class="col-lg-8 col-md-8 col-10">
          <h3>${title}</h3>
          <p>Année de sortie du film: ${year}</p>
          <input type="submit" id="${imdbID}" value="Read more" class="btn btn-info">
        </div>
      </div> 

        <div class="modal" id="myPopup_${imdbID}" style="display:none">
          <div id="page-mask"></div>
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark">
              <div class="modal-header">
                <h4 class="modal-title text-white">${title}</h4>
                <button type="button" class="close text-light" data-dismiss="modal">&times;</button>
              </div>
              <div class="row">
              <div class="col-lg-5 col-md-5 col-sm-5 text-center">
                <img src="${poster}">
              </div> 
              <div class="modal-body col-lg-6 col-md-6 col-sm-5">
                <p class="moviePlot text-white"></p>
              </div>
            </div>
          </div>
        </div> 
  `;
  var observer = new IntersectionObserver(function(observables) {
    observables.forEach(function (observable) {
      if (observable.intersectionRatio > 0.5) {
        observable.target.classList.remove('not-visible')
      }
    })
  }, 
  {
    threshold: [0.5]
  })
 
  let films = document.querySelectorAll('.film')
  films.forEach(function (film) {
    film.classList.add('not-visible')
    observer.observe(film)
  })
};

readmoreOption = (movieID) => {
  console.log(movieID)
  fetch(`http://www.omdbapi.com/?i=${movieID}&apikey=4f5b8e69`)
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    return response;
  })
  .then((response) => {
    showPlot(movieID, response.Plot);
  })
  .catch((error) => console.error(error));
};

showPlot = (movieID, plot) => {
  let bootstrapModal = document.getElementById(`myPopup_${movieID}`)
  console.log(bootstrapModal);
  document.querySelector(`#myPopup_${movieID} .moviePlot`).innerHTML = plot;
  bootstrapModal.style.display = "block";
  let closing = document.querySelector(`#myPopup_${movieID} .close`);
  closing.addEventListener("click", () => {
    bootstrapModal.style.display = "none";
  });
}




