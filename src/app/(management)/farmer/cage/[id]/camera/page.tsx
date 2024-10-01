import React from "react";

const Camera = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <div>
      <p className="text-3xl">Camera</p>
      <p className="text-2xl">Cage ID: {params.id}</p>
    </div>
  );
};

export default Camera;
