import React, { useState } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';

const PrimeImage = ({ source, style, resizeMode, ...rest }) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <FastImage
        {...rest}
        source={source}
        style={[style, loading && { display: 'none' }]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading ? (
        <FastImage
          source={require('../img/placeholder.png')}
          style={style}
          resizeMode={resizeMode}
        />
      ) : null}
    </>
  );
};
export default PrimeImage;
