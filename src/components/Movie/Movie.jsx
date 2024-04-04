import { Component } from 'react';
import { Col, Row, Typography, Tag, Rate, Flex, Spin } from 'antd';
import { format, parseISO } from 'date-fns';

import GenresContext from '../GenresContext/GenresContext';
import ratingStore from '../RatingStore/RatingStore';
import Poster from '../Poster/Poster';

import './Movie.css';

const { Title, Text, Paragraph } = Typography;

export default class Movie extends Component {
  state = {
    rating: null,
  };

  getGenresItems = (genresList, genres) => {
    const filteredGenres = genresList.filter((genre) => genres.includes(genre.id));
    return filteredGenres.map((genre) => {
      return (
        <Tag className="tagSpan" key={genre.id}>
          {genre.name}
        </Tag>
      );
    });
  };

  getShortedOverview = (text, maxLength) => {
    if (text.length <= maxLength) return text;

    const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
    if (lastSpaceIndex !== -1) {
      return text.slice(0, lastSpaceIndex) + '...';
    }
    return text.slice(0, maxLength) + '...';
  };

  getFormattedDate = (date) => {
    try {
      const dateFromServer = date;
      const parsedDate = parseISO(dateFromServer);
      return format(parsedDate, 'MMMM d, yyyy');
    } catch (error) {
      return 'A long time ago';
    }
  };

  sendRate = (rate) => {
    const { moviesApi, movie } = this.props;
    moviesApi.sendRateMovie(movie.id, rate);
    ratingStore[movie.id] = rate;
    this.setState({ rating: rate });
  };

  render() {
    const { movie, loading } = this.props;
    const { rating } = this.state;
    const rows = movie.title.length < 23 && movie.genre_ids.length < 4 ? { rows: 5 } : { rows: 3 };
    const rateAverage = movie.vote_average.toFixed(1);

    if (loading) {
      return (
        <Row className="movieCard" wrap={false}>
          <Spin className="spin" />
        </Row>
      );
    }

    const getColor = (value) => {
      if (value >= 0 && value < 3) return '#E90000';
      if (value >= 3 && value < 5) return '#E97E00';
      if (value >= 5 && value < 7) return '#E9D100';
      else return '#66E900';
    };

    const rate = movie.rating || ratingStore[movie.id] || rating;

    return (
      <Row className="movieCard" wrap={false}>
        <Poster width={180} height={280} url={movie.poster_path} />
        <Col className="movieText">
          <Flex gap={13}>
            <Poster width={60} height={90} url={movie.poster_path} isSmall={true} />
            <Flex className="headerCard" vertical>
              <Flex>
                <Title className="title" level={4}>
                  {movie.title}
                </Title>
                <span className="progressBar" style={{ borderColor: getColor(movie.vote_average) }}>
                  {rateAverage}
                </span>
              </Flex>
              <Text className="releaseDate" type="secondary">
                {this.getFormattedDate(movie.release_date)}
              </Text>
              <GenresContext.Consumer>
                {(genresList) => {
                  return <div className="tags">{this.getGenresItems(genresList, movie.genre_ids)}</div>;
                }}
              </GenresContext.Consumer>
            </Flex>
          </Flex>
          <Paragraph className="overviewFull" ellipsis={rows}>
            {this.getShortedOverview(movie.overview, 175)}
          </Paragraph>
          <Paragraph className="overviewMobile" ellipsis={rows}>
            {this.getShortedOverview(movie.overview, 225)}
          </Paragraph>

          <Rate
            className="rate"
            allowHalf
            defaultValue={rate}
            onChange={(rate) => this.sendRate(rate, movie.id)}
            count={10}
            style={{ fontSize: '15px' }}
          />
        </Col>
      </Row>
    );
  }
}
