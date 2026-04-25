import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">

      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>

      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that facilitates buying and selling
          of products or services over the internet. It serves as a virtual marketplace
          where businesses and individuals showcase their products, interact with customers,
          and conduct transactions securely.
        </p>
        <p>
          E-commerce websites typically display products or services with detailed
          descriptions, images, prices, and any available variations such as sizes and
          colors. Each product usually has its own dedicated page with all relevant
          information for the buyer.
        </p>
      </div>

    </div>
  )
}

export default DescriptionBox