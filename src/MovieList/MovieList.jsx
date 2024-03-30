import React from 'react';
import { Col, Row } from 'antd';

import CardFilm from '../CardFilm/CardFilm.jsx';

import './MovieList.css';

const MovieList = () => (
  <>
    <Row gutter={[36, 36]}>
      <Col span={12}>
        <CardFilm />
      </Col>
      <Col span={12}>
        <CardFilm />
      </Col>
    </Row>
  </>
);
export default MovieList;
