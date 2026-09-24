import React, { useState } from 'react';

import { FeaturePropertiesTable } from '../../components/tables/FeaturePropertiesTable';

const TestFeaturePropertiesTablePage = () => {
  const [data, setData] = useState<Record<string, any>>({
    le: 5,
    gt: 2,
    some_key: 'some_value',
  });

  return (
    <>
      <FeaturePropertiesTable data={data} setData={setData} />
    </>
  );
};

export default TestFeaturePropertiesTablePage;
