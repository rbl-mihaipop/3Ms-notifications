import { useMemo, useState } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { mockUsers } from '@shared/mocks';
import type { Building } from '@shared/types/mockDataTypes';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectBuildings, updateBuildingManagers } from '../state/slices/masterDataSlice';
import { addNotification, addToast } from '../state/slices/notificationsSlice';

const formatNumber = (value: number) => value.toLocaleString('ro-RO');
const createId = () => (typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const MasterDataPage = () => {
  const dispatch = useAppDispatch();
  const buildings = useAppSelector(selectBuildings);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [portfolioManagerId, setPortfolioManagerId] = useState('');
  const [objectManagerId, setObjectManagerId] = useState('');

  const portfolioManagers = useMemo(
    () => mockUsers.filter((user) => user.role === 'portfolio_manager'),
    [],
  );
  const objectManagers = useMemo(
    () => mockUsers.filter((user) => user.role === 'object_manager'),
    [],
  );

  const getUserName = (userId: string) => {
    const user = mockUsers.find((item) => item.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId;
  };

  const openEditDialog = (building: Building) => {
    setEditingBuilding(building);
    setPortfolioManagerId(building.portfolioManagerId);
    setObjectManagerId(building.objectManagerId);
  };

  const closeEditDialog = () => {
    setEditingBuilding(null);
  };

  const createAssignmentNotification = (
    building: Building,
    field: 'Portfolio Manager' | 'Object Manager',
    previousValue: string,
    newValue: string,
  ) => {
    const timestamp = new Date().toISOString();
    const message = `${building.name} was reassigned from ${previousValue} to ${newValue} as ${field}.`;
    const fieldToken = field.replaceAll(' ', '-').toLowerCase();

    dispatch(addNotification({
      id: `ntf-${building.id}-${fieldToken}-${createId()}`,
      type: 'assignment',
      category: 'fyi',
      subtype: 'object_assigned',
      statusBadge: 'new',
      title: 'Object assignment updated',
      description: message,
      entityName: building.name,
      entityId: building.id,
      relatedEntityId: building.id,
      relatedEntityName: building.name,
      createdAt: timestamp,
      status: 'unread',
      priority: 'medium',
      ctaLabel: 'View object',
      changedField: field,
      previousValue,
      newValue,
    }));

    dispatch(addToast({
      id: `toast-${building.id}-${fieldToken}-${createId()}`,
      title: 'Object assignment updated',
      message,
      severity: 'info',
    }));
  };

  const handleSave = () => {
    if (!editingBuilding) return;

    const previousPortfolioManager = getUserName(editingBuilding.portfolioManagerId);
    const nextPortfolioManager = getUserName(portfolioManagerId);
    const previousObjectManager = getUserName(editingBuilding.objectManagerId);
    const nextObjectManager = getUserName(objectManagerId);

    dispatch(updateBuildingManagers({
      buildingId: editingBuilding.id,
      portfolioManagerId,
      objectManagerId,
    }));

    if (editingBuilding.portfolioManagerId !== portfolioManagerId) {
      createAssignmentNotification(
        editingBuilding,
        'Portfolio Manager',
        previousPortfolioManager,
        nextPortfolioManager,
      );
    }

    if (editingBuilding.objectManagerId !== objectManagerId) {
      createAssignmentNotification(
        editingBuilding,
        'Object Manager',
        previousObjectManager,
        nextObjectManager,
      );
    }

    closeEditDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
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
              <TableCell>Portfolio Manager</TableCell>
              <TableCell>Object Manager</TableCell>
              <TableCell>Energy Class</TableCell>
              <TableCell align="right">Total area (sqm)</TableCell>
              <TableCell align="right">Refurbishment cost (EUR)</TableCell>
              <TableCell align="right">Project start year</TableCell>
              <TableCell align="right">Expected closing year</TableCell>
              <TableCell>Project status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buildings.map((building) => (
              <TableRow key={building.id} hover>
                <TableCell>{building.id}</TableCell>
                <TableCell>{building.name}</TableCell>
                <TableCell>{building.city}</TableCell>
                <TableCell>{building.country}</TableCell>
                <TableCell>{building.type}</TableCell>
                <TableCell>{getUserName(building.portfolioManagerId)}</TableCell>
                <TableCell>{getUserName(building.objectManagerId)}</TableCell>
                <TableCell>{building.energyClass}</TableCell>
                <TableCell align="right">{formatNumber(building.totalAreaSqm)}</TableCell>
                <TableCell align="right">{formatNumber(building.refurbishmentCostEur)}</TableCell>
                <TableCell align="right">{building.projectStartYear}</TableCell>
                <TableCell align="right">{building.expectedClosingYear}</TableCell>
                <TableCell>{building.projectStatus}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditDialog(building)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingBuilding} onClose={closeEditDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Edit object assignment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <FormControl fullWidth size="small">
            <InputLabel id="portfolio-manager-label">Portfolio Manager</InputLabel>
            <Select
              labelId="portfolio-manager-label"
              value={portfolioManagerId}
              label="Portfolio Manager"
              onChange={(event) => setPortfolioManagerId(event.target.value)}
            >
              {portfolioManagers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="object-manager-label">Object Manager</InputLabel>
            <Select
              labelId="object-manager-label"
              value={objectManagerId}
              label="Object Manager"
              onChange={(event) => setObjectManagerId(event.target.value)}
            >
              {objectManagers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
