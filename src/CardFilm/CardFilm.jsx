import { Card, Image } from 'antd';

import './CardFilm.css';

const CardFilm = () => (
  <Card
    style={{
      width: 450,
      height: 280,
      backgroundColor: 'gray',
    }}
  >
    <Image
      width={180}
      height={280}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </Card>
);
export default CardFilm;
