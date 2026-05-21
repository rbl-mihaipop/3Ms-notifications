import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Building } from '@shared/types/mockDataTypes';
import mockBuildings from '@shared/mocks/buildings.json';
import type { RootState } from '../../app/store';

interface MasterDataState {
  buildings: Building[];
}

const initialState: MasterDataState = {
  buildings: mockBuildings as Building[],
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    updateBuildingManagers(
      state,
      action: PayloadAction<{
        buildingId: string;
        portfolioManagerId: string;
        objectManagerId: string;
      }>,
    ) {
      const building = state.buildings.find((item) => item.id === action.payload.buildingId);
      if (!building) return;
      building.portfolioManagerId = action.payload.portfolioManagerId;
      building.objectManagerId = action.payload.objectManagerId;
    },
  },
});

export const { updateBuildingManagers } = masterDataSlice.actions;
export const selectBuildings = (state: RootState) => state.masterData.buildings;

export default masterDataSlice.reducer;
