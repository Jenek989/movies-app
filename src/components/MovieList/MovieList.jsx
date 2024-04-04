import React, { Component } from 'react';
import { Col, Row } from 'antd';

import Movie from '../Movie/Movie.jsx';
import Spinner from '../Spinner/Spinner.jsx';

import './MovieList.css';

export default class MovieList extends Component {
  renderMoviesList = (arr) => {
    return arr.map((movie) => {
      return (
        <Col key={movie.id} className="movieListCard" lg={12} md={24} sm={24} xs={24}>
          <Movie moviesApi={this.props.moviesApi} movie={movie} loading={this.props.loading} />
        </Col>
      );
    });
  };

  render() {
    const { moviesList } = this.props;
    const movies = this.renderMoviesList(moviesList);

    return (
      <Row gutter={[36, 36]} justify={'start'} className="movieList">
        {moviesList.length === 0 ? <Spinner /> : movies}
      </Row>
    );
  }
}
