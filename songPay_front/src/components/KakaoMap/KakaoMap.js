/*global kakao*/
import React, { Component } from 'react';
import styled from 'styled-components';

class KakaoMap extends Component {
  componentDidMount() {
    console.log(process.env.REACT_APP_KAKAO_MAP_KEY);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        let container = document.getElementById('Mymap');
        let options = {
          center: new kakao.maps.LatLng(37.506502, 127.053617),
          level: 7,
        };

        const map = new window.kakao.maps.Map(container, options);
      });
    };
  }
  render() {
    return <MapContents id='Mymap'></MapContents>; // 이부분이 지도를 띄우게 될 부분.
  }
}

const MapContents = styled.div`
  width: 100%;
  height: 100%;
`;
export default KakaoMap;
