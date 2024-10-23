import React from "react";

const CageDetail = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const id = params.id;
  return (
    <div>
      <h1>Cage Detail {id}</h1>
    </div>
  );
};

export default CageDetail;
