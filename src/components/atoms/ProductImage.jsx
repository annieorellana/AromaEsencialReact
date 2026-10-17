import React from 'react';

function ProductImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="card-img-top"
      style={{
        height: '260px',
        objectFit: 'cover'
      }}
    />
  );
}

export default ProductImage;