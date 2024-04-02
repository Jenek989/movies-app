import { Component } from 'react';
import { Input, Tabs, Pagination, message } from 'antd';
import debounce from 'lodash.debounce';

import './App.css';

import MovieList from '../MovieList/MovieList';
import MoviesApi from '../../services/api/moviesApi';

export default class App extends Component {
  moviesApi = new MoviesApi();

  state = {
    moviesList: [],
    genresList: [],
    currentPage: 1,
    loading: true,
    isFinded: false,
    isResultsEmpty: false,
    label: '',
  };

  componentDidMount() {
    this.getMoviesListFromApi();
    this.getMovieGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, isFinded, label, isResultsEmpty } = this.state;
    if (prevState.currentPage !== currentPage && !isFinded) {
      console.log('Запрос на новую страницу', currentPage);
      this.setState({ loading: true }, this.getMoviesListFromApi(currentPage));
    }
    if (prevState.currentPage !== currentPage && isFinded) {
      this.setState({ loading: true }, this.getFindedMoviesListFromApi(currentPage, label));
    }
    if (isResultsEmpty === true) {
      console.log('isResultsEmpty');
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
    console.log('отправка запроса');
    this.moviesApi.getFindedMovieList(currentPage, keyWords).then((movies) => {
      const moviesLength = movies.results.length === 0;
      if (moviesLength) message.error('По вашему запросу ничего не найдено');
      this.setState({
        moviesList: movies.results,
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
        loading: false,
        isResultsEmpty: moviesLength,
        label: '',
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

  render() {
    const tabsItems = [
      {
        label: 'Search',
        key: '1',
      },
      {
        label: 'Rated',
        key: '2',
      },
    ];

    const { currentPage } = this.state;

    const { moviesList, genresList, loading } = this.state;
    return (
      <div className="App">
        <header className="header">
          <div className="menu">
            <Tabs className="tabs" defaultActiveKey="1" centered size="large" items={tabsItems} />
          </div>
          <Input
            className="searchBar"
            placeholder="Type to search..."
            onChange={debounce(this.onLabelChange, 600)}
            loading
            required
          />
        </header>
        <section className="main">
          <MovieList moviesApi={this.moviesApi} moviesList={moviesList} genresList={genresList} loading={loading} />
        </section>
        <footer className="footer">
          <Pagination
            className="pagination"
            current={currentPage}
            total={30}
            pageSize={6}
            showSizeChanger={false}
            onChange={this.handlePageChange}
          />
        </footer>
      </div>
    );
  }
}
