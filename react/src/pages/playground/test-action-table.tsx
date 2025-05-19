/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from 'meta-storyboard';

import React, { useState } from 'react';
import { ActionTable } from '../../components/tables/ActionTable';

const mockData: msb.ActionTableRow[] = [
  {
    action: msb.ActionName.DOT,
    properties: {
      size: 5,
      color: '#FF0000',
      opacity: 0.7,
    },
  },
  {
    action: msb.ActionName.CIRCLE,
    properties: {
      size: 10,
      strokeWidth: 2,
      color: '#00FF00',
      opacity: 0.5,
    },
  },
  {
    action: msb.ActionName.TEXT_BOX,
    properties: {
      title: 'Example Text',
      message: 'Lorem ipsum dolor sit amet',
      backgroundColor: '#0000FF',
      width: 100,
    },
  },
  {
    action: msb.ActionName.CONNECTOR,
    properties: {
      stroke: '#FFFF00',
      opacity: 0.8,
    },
  },
];

const TestActionTable = () => {
  const [data, setData] = useState(mockData);

  return (
    <>
      <ActionTable data={data} setData={setData} />
    </>
  );
};

export default TestActionTable;
