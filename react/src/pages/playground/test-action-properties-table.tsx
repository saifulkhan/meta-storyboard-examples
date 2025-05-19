import React, { useState } from 'react';

import { ActionPropertiesTable } from '../../components/tables/ActionPropertiesTable';

const TestActionPropertiesTablePage = () => {
  const [data, setData] = useState<Record<string, any>>({
    title: 'Example Text',
    message: 'Lorem ipsum dolor sit amet',
    backgroundColor: '#0000FF',
    width: 100,
  });

  return (
    <>
      <ActionPropertiesTable data={data} setData={setData} />
    </>
  );
};

export default TestActionPropertiesTablePage;
