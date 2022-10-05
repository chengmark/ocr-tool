import React, { useState } from 'react';

const useForeceUpdate = () => {
  const [v, setV] = useState(0);
  return () => setV((v) => v + 1);
};

export default useForeceUpdate;
