import React, { Component } from 'react';
import { KeyboardCapslockOutlined } from '@material-ui/icons';

class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  map;
  marker = [];
  componentDidMount() {
    var container = document.getElementById('KakaoMap');
    var options = {
      center: new kakao.maps.LatLng(35, 129),
      level: 4,
    };
    this.map = new kakao.maps.Map(container, options);
  }
  render() {
    return (
      <div className='kakaomap'>
        <div id='KakaoMap' />
      </div>
    );
  }
}

export default Map;
