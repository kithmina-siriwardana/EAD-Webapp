import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";

import { Modal, Row, Col } from "react-bootstrap";
import { FaComments } from "react-icons/fa";
import StarRatings from "react-star-ratings";

const UserProfile = ({ show, onClose, vendorData }) => {
  const [vendor, setVendor] = useState(vendorData);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    setVendor(vendorData);
  }, [vendorData]);

  useEffect(() => {
    setCommentList(vendorData.ratings);
  }, [vendor]);

  console.log("commentList", commentList);

  return (
    <>
      <div style={{ overflowX: "hidden", minHeight: "450px" }}>
        <Row
          style={{
            backgroundColor: "#edf2fd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Col xs={2} style={{ justifyContent: "center", display: "flex" }}>
            {" "}
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="Uploaded preview"
              className="img-fluid "
              style={{ width: "100px", height: "100px" }}
            />
          </Col>
          <Col xs={4}>
            <Row style={{ display: "flex", flexDirection: "row" }}>
              <p>
                <b>Vendor ID:</b> {vendor && vendor.userId}
              </p>
            </Row>
            <Row style={{ display: "flex", flexDirection: "row" }}>
              <p>
                <b>Name:</b> {vendor && vendor.fullName}
              </p>
            </Row>
          </Col>
          <Col xs={5}>
            <Row style={{ display: "flex", flexDirection: "row" }}>
              <p>
                <b>Email:</b> Shehangunasekara2019@gmail.com
              </p>
            </Row>{" "}
          </Col>
          <Col xs={1}>
            {" "}
            <Row
              style={{
                display: "flex",
                flexDirection: "row",
                color: "green",
              }}
            >
              <p>Active</p>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={4} style={{ marginTop: "80px" }}>
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "75px",
                fontWeight: "bold",
              }}
            >
              {vendor && vendor.averageRating}
            </Row>
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <StarRatings
                rating={vendor && vendor.averageRating}
                starRatedColor="gold"
                numberOfStars={5}
                name="rating"
                starDimension="35px"
                starSpacing="2px"
              />
            </Row>
          </Col>

          {commentList.length > 0 ? (
            <Col xs={8} style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "25px", fontWeight: "bold" }}>
                Customer Feedbacks
              </p>
              {commentList.map((comment, index) => (
                <Row key={index} className="mb-2">
                  <p style={{ fontWeight: "bold" }}>
                    {" "}
                    <FaComments /> {comment.customerId}{" "}
                  </p>
                  <Row
                    className="mb-2"
                    style={{ marginLeft: "20px", marginTop: "-10px" }}
                  >
                    <Col xs={11}>{comment.comment} </Col>
                  </Row>
                </Row>
              ))}
            </Col>
          ) : (
            <Col xs={8} style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "25px", fontWeight: "bold" }}>
                Customer Feedbacks
              </p>
              <Row className="mb-2">
                <p style={{ fontWeight: "bold" }}>
                  {" "}
                  <FaComments /> No Customer Feedbacks to display
                </p>{" "}
              </Row>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default UserProfile;
