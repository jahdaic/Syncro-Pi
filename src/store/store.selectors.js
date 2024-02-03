import { createSelector } from "@reduxjs/toolkit";
import { initialState } from "./store.redux";

const selectDomain = (state) => state.store || initialState;

export const selectSystemState = createSelector([selectDomain], state => state.system);
export const selectSettingState = createSelector([selectDomain], state => state.settings);
export const selectTimestampState = createSelector([selectDomain], state => state.timestamps);
export const selectGPSState = createSelector([selectDomain], state => state.gps);
export const selectGyroState = createSelector([selectDomain], state => state.gyro);
export const selectWeatherState = createSelector([selectDomain], state => state.weather);
export const selectSpotifyState = createSelector([selectDomain], state => state.spotify);