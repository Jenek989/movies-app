import { Col, Row, Spin } from 'antd';

import './Spinner.css';

const Spinner = () => (
  <>
    <Col md={12} sm={24} xs={24}>
      <Row className="movieCard" wrap={false}>
        <Spin className="spin" />
      </Row>
    </Col>
    <Col md={12} sm={24} xs={24}>
      <Row className="movieCard" wrap={false}>
        <Spin className="spin" />
      </Row>
    </Col>
  </>
);

export default Spinner;
