import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { mockBuildings } from '@shared/mocks';

const formatNumber = (value: number) => value.toLocaleString('en-GB');

export const MasterDataPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      Master Data
    </Typography>

    <TableContainer
      component={Paper}
      sx={{
        border: '1px solid #E5E7EB',
        borderRadius: 1,
        boxShadow: 'none',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Energy class</TableCell>
            <TableCell align="right">Total area (sqm)</TableCell>
            <TableCell align="right">Refurbishment cost (EUR)</TableCell>
            <TableCell align="right">Project start year</TableCell>
            <TableCell align="right">Expected closing year</TableCell>
            <TableCell>Project status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockBuildings.map((building) => (
            <TableRow key={building.id} hover>
              <TableCell>{building.id}</TableCell>
              <TableCell>{building.name}</TableCell>
              <TableCell>{building.city}</TableCell>
              <TableCell>{building.country}</TableCell>
              <TableCell>{building.type}</TableCell>
              <TableCell>{building.energyClass}</TableCell>
              <TableCell align="right">{formatNumber(building.totalAreaSqm)}</TableCell>
              <TableCell align="right">{formatNumber(building.refurbishmentCostEur)}</TableCell>
              <TableCell align="right">{building.projectStartYear}</TableCell>
              <TableCell align="right">{building.expectedClosingYear}</TableCell>
              <TableCell>{building.projectStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);
