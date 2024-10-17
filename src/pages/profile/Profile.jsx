import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";

import { Modal, Row, Col } from "react-bootstrap";
import { FaComments } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import UserProfile from "../../components/profile/UserProfile";

const Profile = () => {
  const commentList = [
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
    "this is comment 1 this is comment 1this is comment 1this is comment 1this is comment 1this is comment 1",
  ];
  return (
    <div className="px-4 my-4">
      {/* Header text */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Profile</h1>
      </div>
      <UserProfile />
    </div>
  );
};

export default Profile;
