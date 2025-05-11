import React from 'react';
import { Download, Eye } from 'lucide-react';
import './ImageGrid.css';

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map(img => (
        <div key={img.id} className="image-card">
          <img
            src={img.urls.small}
            alt={img.alt_description || "Image"}
            className="image"
          />
          <div className="overlay">
            <a
              href={img.links.download}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="download-button"
            >
              <Download size={16} />
              <span>Download</span>
            </a>
            <a
              href={img.urls.full}
              target="_blank"
              rel="noopener noreferrer"
              className="view-button"
            >
              <Eye size={16} />
              <span>View Full</span>
            </a>
          </div>
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