import { Component } from 'react';

export default class MoviesApi extends Component {
  constructor() {
    super();
    this.guestSessionId = this.createGuestSessionId();
  }

  _baseUrl = 'https://api.themoviedb.org/3/';
  _apiKey = 'ab04a5a7f235f3e71e241c55e1bcf198';

  createGuestSessionId = async () => {
    const url = `${this._baseUrl}authentication/guest_session/new?api_key=${this._apiKey}`;
    const body = await this.getData(url);
    return body.guest_session_id;
  };

  getGuestSessionId = async () => {
    return await this.guestSessionId;
  };

  setGuestSessionId = (id) => {
    this.guestSessionId = id;
  };

  getData = async (url, rate = false) => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const res = await fetch(url);
      if (!res.ok && rate) return { results: [] };
      if (!res.ok && !rate) throw new Error(`Could not fetch ${this._BaseUrl} ${res.status}`);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  postData = async (url, value) => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(`Could not fetch ${url} ${res.status}`);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getMovieList = async (page) => {
    try {
      const pageUrl = page ? `&page=${page}` : '';
      const url = `${this._baseUrl}discover/movie?api_key=${this._apiKey}${pageUrl}`;
      return await this.getData(url);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getFindedMovieList = async (page, keyWords) => {
    try {
      const pageUrl = page ? `&page=${page}` : '';
      const keyWordsUrl = `&query=${keyWords}`;
      const url = `${this._baseUrl}search/movie?api_key=${this._apiKey}${keyWordsUrl}${pageUrl}`;
      return await this.getData(url);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getMovieGanresList = async () => {
    try {
      const url = `${this._baseUrl}genre/movie/list?api_key=${this._apiKey}`;
      return await this.getData(url);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getRatedMoviesList = async (page = 1) => {
    try {
      const url = `${this._baseUrl}guest_session/${await this.guestSessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`;
      const rate = true;
      return await this.getData(url, rate);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  sendRateMovie = async (id, rate) => {
    try {
      const url = `${this._baseUrl}movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${await this.guestSessionId}`;
      return await this.postData(url, rate);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

// const movie = new MoviesApi();
// console.log(movie.guestSessionId);
// movie.getRatedMoviesList(1).then((body) => {
//   console.log('Жанры:', body);
// });
