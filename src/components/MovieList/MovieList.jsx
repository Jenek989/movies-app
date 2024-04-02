import React, { Component } from 'react';
import { Col, Row, Spin } from 'antd';

import Movie from '../Movie/Movie.jsx';

import './MovieList.css';

export default class MovieList extends Component {
  renderMoviesList = (arr) => {
    // console.log(arr);
    return arr.map((movie) => {
      const filteredGenres = this.props.genresList.filter((genre) => movie.genre_ids.includes(genre.id));
      return (
        <Col key={movie.id} span={12}>
          <Movie movie={movie} genres={filteredGenres} loading={this.props.loading} />
        </Col>
      );
    });
  };

  spin = () => (
    <>
      <Col span={12}>
        <Row className="movieCard" wrap={false}>
          <Spin className="spin" />
        </Row>
      </Col>
      <Col span={12}>
        <Row className="movieCard" wrap={false}>
          <Spin className="spin" />
        </Row>
      </Col>
    </>
  );

  render() {
    const { moviesList } = this.props;
    const movies = this.renderMoviesList(moviesList);

    return (
      <Row gutter={[36, 36]} justify={'start'} className="movieList">
        {moviesList.length === 0 ? this.spin() : movies}
      </Row>
    );
  }
}
