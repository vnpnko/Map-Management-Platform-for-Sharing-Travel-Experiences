import React from "react";
import { Marker } from "@react-google-maps/api";
import Pin from "../../../assets/favmaps_logo.png";

interface CustomMarkerProps {
  position: google.maps.LatLngLiteral;
  isCurrent?: boolean;
  onClick?: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  isCurrent = false,
  onClick,
}) => {
  const icon = isCurrent
    ? {
        url: Pin,
        scaledSize: new window.google.maps.Size(40, 40),
      }
    : undefined;

  return <Marker position={position} onClick={onClick} icon={icon} />;
};

export default CustomMarker;
