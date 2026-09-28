/** import locally for development and testing **/
import * as msb from '../../../msb/src';
/** import from npm library */
// import * as msb from 'meta-storyboard';

import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import { green } from '@mui/material/colors';

import { ExampleLayout } from '../../components/ExampleLayout';
import { FeatureActionTable } from '../../components/tables/FeatureActionTable';
import covid19NumFATable from '../../assets/feature-action-table/covid-19-numerical-fa-table.json';
import mlNumFATableMirrored from '../../assets/feature-action-table/ml-numerical-fa-table-line.json';
import mlNumFATablePCP from '../../assets/feature-action-table/ml-numerical-fa-table-pcp.json';

const tableDataMap: any = {
  'Covid19 Single Location': covid19NumFATable,
  'ML Provenance': mlNumFATableMirrored,
  'ML Multivariate': mlNumFATablePCP,
};

const FeatureActionTablesPage = () => {
  const [data, setData] = useState<msb.FeatureActionTableRow[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const _tables = Object.keys(tableDataMap) as string[];
      setTables(_tables);
      setSelectedTable(_tables[0]);
      console.log('tables: ', _tables);

      await fetchTableData(_tables[0]);
    };

    fetchData();
  }, []);

  const fetchTableData = async (table: string) => {
    try {
      console.log('table: ', table);
      const tableData = tableDataMap[table] as msb.FeatureActionTableRow[];
      console.log('tableData: ', tableData);
      setData(tableData);
    } catch (e) {
      console.error('Failed to fetch table data:', e);
    }
  };

  const handleTableChange = async (event: any) => {
    setSelectedTable(event.target.value as string);
    if (event.target.value !== '') {
      fetchTableData(event.target.value as string);
    }
  };

  const handleCreateTable = () => {
    // TODO: implement logic to create a new table
  };

  const handleSaveTable = () => {
    // TODO: implement logic to save the existing table
  };

  return (
    <ExampleLayout
      title="Feature-Action Tables"
      subtitle="Browse the feature-action tables that drive the stories, and experiment with features, actions, and their properties. This is an experimental feature."
      chip="Interactive Table"
      icon={<TableChartIcon />}
      color={green[700]}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <FormControl sx={{ width: 300 }} size="small">
          <InputLabel id="table-select-label">Select table</InputLabel>
          <Select
            labelId="table-select-label"
            value={selectedTable}
            onChange={handleTableChange}
            label="Select table"
          >
            {tables.map(table => (
              <MenuItem key={table} value={table}>
                {table}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Not implemented yet">
            <span>
              <Button variant="outlined" disabled onClick={handleCreateTable}>
                Create New Table
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Not implemented yet">
            <span>
              <Button variant="outlined" disabled onClick={handleSaveTable}>
                Save Table
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <FeatureActionTable data={data} setData={setData} />
    </ExampleLayout>
  );
};

export default FeatureActionTablesPage;
