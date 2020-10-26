import React from "react";
import QRCodeModule from "qrcode.react";

// hooks and services

// components, styles and UI

// interfaces
export interface QRCodeProps {
  address: string;
}

const QRCodeGenerator: React.FunctionComponent<QRCodeProps> = ({ address }) => {
  return (
    <div className="QRCodeContainer">
      <QRCodeModule
        level="H"
        renderAs="svg"
        size={350}
        includeMargin
        value={address}
      />
    </div>
  );
};

export default QRCodeGenerator;
