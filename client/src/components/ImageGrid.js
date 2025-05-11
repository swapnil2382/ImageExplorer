import React from 'react';
import './ImageGrid.css';

const ImageGrid = ({ images, selectedImages, toggleSelect }) => {
  return (
    <div className="image-grid">
      {images.map(img => (
        <div key={img.id} className="image-card">
          <img
            src={img.urls.small}
            alt={img.alt_description || "Image"}
            className="image"
          />
          <input
            type="checkbox"
            checked={selectedImages.includes(img.urls.small)}
            onChange={() => toggleSelect(img.urls.small)}
            className="select-checkbox"
          />
          {img.description && (
            <div className="image-description">
              {img.description.length > 60 ? img.description.substring(0, 60) + '...' : img.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
