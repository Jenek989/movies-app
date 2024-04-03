import { Component } from 'react';
import { Input, Pagination, message } from 'antd';
import debounce from 'lodash.debounce';

import './App.css';

import MovieList from '../MovieList/MovieList';
import MoviesApi from '../../services/api/moviesApi';
import GenresContext from '../GenresContext/GenresContext';
import TabsItem from '../TabsItem/TabsItem';

export default class App extends Component {
  moviesApi = new MoviesApi();

  state = {
    moviesList: [],
    genresList: [],
    currentPage: 1,
    totalResults: 1,
    loading: true,
    isFinded: false,
    isResultsEmpty: false,
    tabRated: false,
    label: '',
  };

  componentDidMount() {
    this.getMoviesListFromApi();
    this.getMovieGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, isFinded, label, isResultsEmpty } = this.state;
    if (prevState.currentPage !== currentPage && !isFinded) {
      this.setState({ loading: true }, this.getMoviesListFromApi(currentPage));
    }
    if (prevState.currentPage !== currentPage && isFinded) {
      this.setState({ loading: true }, this.getFindedMoviesListFromApi(currentPage, label));
    }
    if (isResultsEmpty === true) {
      debounce(this.getMoviesListFromApi, 1500)();
    }
  }

  onLabelChange = (e) => {
    if (e.target.value) {
      const value = e.target.value.trim();
      this.setState({ loading: true, currentPage: 1, label: value }, () => {
        this.getFindedMoviesListFromApi(this.state.currentPage, this.state.label);
      });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getFindedMoviesListFromApi = (currentPage, keyWords) => {
    this.moviesApi.getFindedMovieList(currentPage, keyWords).then((movies) => {
      const moviesLength = movies.results.length === 0;
      if (moviesLength) message.error('По вашему запросу ничего не найдено');
      this.setState({
        moviesList: movies.results,
        totalResults: movies.total_results,
        loading: false,
        isFinded: true,
        isResultsEmpty: moviesLength,
      });
    });
  };

  getMoviesListFromApi = (currentPage, keyWords) => {
    this.moviesApi.getMovieList(currentPage, keyWords).then((movies) => {
      const moviesLength = movies.results.length === 0;
      if (moviesLength) message.error('Ничего не найдено');
      this.setState({
        moviesList: movies.results,
        totalResults: movies.total_results,
        loading: false,
        isResultsEmpty: moviesLength,
        tabRated: false,
        label: '',
      });
    });
  };

  getRatedMoviesListFromApi = (currentPage) => {
    this.moviesApi.getRatedMoviesList(currentPage).then((movies) => {
      const moviesLength = movies.results.length === 0;
      if (moviesLength) message.error('Ничего не найдено');
      this.setState({
        moviesList: movies.results,
        totalResults: movies.total_results,
        loading: false,
        isResultsEmpty: moviesLength,
      });
    });
  };

  getMovieGenres = () => {
    this.moviesApi.getMovieGanresList().then((res) => {
      this.setState({
        genresList: res.genres,
      });
    });
  };

  handleTabChange = (e) => {
    const { isFinded, currentPage, tabRated, label } = this.state;
    this.setState({ tabRated: !tabRated });
    if (e === '1') {
      if (isFinded) {
        this.setState({ loading: true }, this.getFindedMoviesListFromApi(currentPage, label));
      }
      if (!isFinded) {
        this.setState({ loading: true }, this.getMoviesListFromApi(currentPage));
      }
    }
    if (e === '2') {
      this.setState({ loading: true }, this.getRatedMoviesListFromApi(currentPage));
    }
  };

  render() {
    const { moviesList, genresList, loading, currentPage, totalResults, tabRated } = this.state;

    const tabKey = tabRated ? '2' : '1';

    return (
      <div className="App">
        <header className="header">
          <div className="menu">
            <TabsItem tabKey={tabKey} handleTabChange={this.handleTabChange} />
          </div>
          <div className={tabRated ? 'searchBarHide' : ''}>
            <Input
              className="searchBar"
              placeholder="Type to search..."
              onChange={debounce(this.onLabelChange, 600)}
              required
            />
          </div>
        </header>
        <section className="main">
          <GenresContext.Provider value={genresList}>
            <MovieList moviesApi={this.moviesApi} moviesList={moviesList} loading={loading} />
          </GenresContext.Provider>
        </section>
        <footer className="footer">
          <Pagination
            className="pagination"
            current={currentPage}
            total={totalResults}
            pageSize={20}
            showSizeChanger={false}
            onChange={this.handlePageChange}
          />
        </footer>
      </div>
    );
  }
}
