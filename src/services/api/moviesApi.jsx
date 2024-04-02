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

  getData = async (url) => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not fetch ${this._BaseUrl} ${res.status}`);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getMovieList = async (page) => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const pageUrl = page ? `&page=${page}` : '';
      const url = `${this._baseUrl}discover/movie?api_key=${this._apiKey}${pageUrl}`;
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getFindedMovieList = async (page, keyWords) => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const pageUrl = page ? `&page=${page}` : '';
      const keyWordsUrl = `&query=${keyWords}`;
      const url = `${this._baseUrl}search/movie?api_key=${this._apiKey}${keyWordsUrl}${pageUrl}`;
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getMovieGanresList = async () => {
    try {
      if (!window.navigator.onLine) throw new Error('You are Offline');
      const url = `${this._baseUrl}genre/movie/list?api_key=${this._apiKey}`;
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

// const movie = new MoviesApi();
// console.log(movie.guestSessionId);
// movie.getMovieGanresList('823464').then((body) => {
//   console.log('Жанры:', body);
// });
