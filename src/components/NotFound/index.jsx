import React from 'react'
import './index.css'

const NotFound = () => (
  <div className="not-found-bg-container">
    <div className="not-found-card">
      <img
        className="not-found-image"
        src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704822108/Group_7504_cag8c5.jpg"
        alt="not found"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-paragraph">
        We are Sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFound
