import React from 'react';
import { useParams } from "react-router-dom";
export const ProductPage = () => {
  const { code } = useParams();

  return (<>
    ProductPage {code}
  </>);
};
