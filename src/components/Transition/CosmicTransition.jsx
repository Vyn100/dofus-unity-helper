import { useEffect, useState } from "react";
import "../../../index.css";

const CosmicTransition = ({ visible }) => {
  return (
    <div
      className={`cosmic-transition ${visible ? "show cosmic-stars" : ""}`}
    />
  );
};

export default CosmicTransition;
