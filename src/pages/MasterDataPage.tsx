import { useEffect, useRef } from 'react';
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
import { useSearchParams } from 'react-router-dom';
import { mockBuildings } from '@shared/mocks';
import { BRAND_PURPLE } from '../theme/theme';

const formatNumber = (value: number) => value.toLocaleString('ro-RO');

export const MasterDataPage = () => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('object');
  const highlightRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Master Data
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ border: '1px solid #E5E7EB', borderRadius: 1, boxShadow: 'none' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Energy Class</TableCell>
              <TableCell align="right">Total area (sqm)</TableCell>
              <TableCell align="right">Refurbishment cost (EUR)</TableCell>
              <TableCell align="right">Project start year</TableCell>
              <TableCell align="right">Expected closing year</TableCell>
              <TableCell>Project status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBuildings.map((building) => {
              const isHighlighted = building.id === highlightId;
              return (
                <TableRow
                  key={building.id}
                  hover
                  ref={isHighlighted ? highlightRef : null}
                  sx={{
                    bgcolor: isHighlighted ? 'rgba(128, 51, 128, 0.08)' : 'inherit',
                    outline: isHighlighted ? `2px solid ${BRAND_PURPLE}` : 'none',
                    outlineOffset: '-2px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>{building.id}</TableCell>
                  <TableCell sx={{ fontWeight: isHighlighted ? 600 : 400 }}>{building.name}</TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
