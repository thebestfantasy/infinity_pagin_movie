const BASE_URL = 'https://api.themoviedb.org/3';
const ENDPOINT = '/trending/movie/week'
const API_KEY = '345007f9ab440e5b86cef51be6397df1'; 
const list = document.querySelector('.js-list');
const loadMore = document.querySelector('.js-load-more');
let page = 1;

loadMore.addEventListener('click', pagination);

function pagination() {
    page += 1;
    serviceMovie(page)
        .then(data => {
            list.insertAdjacentHTML('beforeend', createMarkup(data.results))  ///results это с бекэнда
            if (data.total_pages <= data.page) {
                loadMore.hidden = true;
            }
        })
        .catch(err => console.log(err));
}
// const options = {
//     method: 'GET',
//     headers: {
//         Authorization: `Bearer ${TOKEN}`
//     }
// }

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
            loadMore.hidden = false;          /////кнопка будет показана до последней страницы, на последней аттрибут hidden из html возвращается
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