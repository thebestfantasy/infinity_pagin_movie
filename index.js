// intersectionObserver

const BASE_URL = 'https://api.themoviedb.org/3';
const ENDPOINT = '/trending/movie/week'
const API_KEY = '345007f9ab440e5b86cef51be6397df1'; 
const list = document.querySelector('.js-list');
const guard = document.querySelector('.js-guard');
let page = 1;

let options = {
    root: null,  //null - весь viewportwidth, если null можно не указывать
    rootMargin: '400px', //срабатывание за 300px до конца
    treshold: 0, //если 0 можно не указывать, переход границы вьюпорта 1=100%
}

let observer = new IntersectionObserver(handlerPagination, options);

function handlerPagination(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            page += 1;
            serviceMovie(page)
            .then(data => {
                list.insertAdjacentHTML('beforeend', createMarkup(data.results))
                if (data.total_pages <= data.page) {
                    observer.unobserve(guard)   //снимаем обсервер по достижении посл страниці
                }
             })
        }
    });
};

function serviceMovie(page = 1) {
    return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        }) 
};

serviceMovie()
    .then(data => {
        list.insertAdjacentHTML('beforeend', createMarkup(data.results))  ///results это с бекэнда
        if (data.total_pages > data.page) {
            observer.observe(guard)
        }
    })
    .catch(err => console.log(err));

function createMarkup(arr) {
    return arr.map(({ original_title, poster_path, vote_average }) => `<li>
    <img src="https://image.tmdb.org/t/p/w400/${poster_path}" alt="${original_title}" />
    <h2>${original_title}</h2>
    <p>${vote_average}</p>
    </li>`).join('')
}