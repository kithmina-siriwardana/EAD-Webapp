import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

export default function ProductViewContent({ productData }) {
  const [selectedImg, setSelectedImg] = useState(
    productData && productData.imageUrls[0]
  );

  // Handle mouse enter
  const handleMouseEnter = (imgURL) => {
    setSelectedImg(imgURL);
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={12} lg={6}>
          <div className="custom-padding-prod-img">
            <Row>
              <Col sm={12}>
                {" "}
                <img
                  src={selectedImg}
                  alt="Uploaded preview"
                  className="img-fluid custom-img"
                />
              </Col>
            </Row>
            <Row className="g-0 cmt-10 justify-content-center">
              {productData.imageUrls &&
                productData.imageUrls.map((imgURL, index) => (
                  <Col
                    xs={2}
                    sm={2}
                    key={index}
                    onMouseEnter={() => handleMouseEnter(imgURL)}
                  >
                    <img
                      src={imgURL}
                      alt={`Uploaded preview ${index}`}
                      className="img-fluid custom-img-preview"
                    />
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={6}>
          <Row>
            {" "}
            <div className="d-flex flex-row">
              <p className="product-viewe-title">{productData.name}</p>
              <div className="cmt-10">
                <span
                  className={
                    productData.isActive
                      ? "product-viewe-title-status-active"
                      : "product-viewe-title-status-inactive"
                  }
                >
                  {productData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>{" "}
            <p style={{ fontWeight: "normal", marginTop: "-25px" }}>
              {productData.productId}
            </p>{" "}
            <p style={{ fontWeight: "bold", marginTop: "-13px" }}>
              {productData.categoryID}
            </p>{" "}
          </Row>
          <Row>
            {" "}
            <div className="d-flex flex-row">
              <p className="product-view-price">LKR</p> {/* check this again */}
              <p className="product-view-amount">{productData.price}</p>
              <p className="product-view-price"> .00</p>
            </div>
          </Row>
          <Row>
            {" "}
            <div className="d-flex flex-row">
              <p className="fw-bold">
                Available quantity : {productData.quantity}
              </p>{" "}
            </div>
          </Row>
          <Row>
            {" "}
            <div className="d-flex flex-row">
              <p>{productData.description}</p>{" "}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
