import { ISettingsKit } from "../../coreAlgorithmGetPoints/ISettingsKit";
import React, { ReactNode } from "react";
export interface IPropsButtonCalcRoute {
  coords: number[][];
  setCoordRouteFunc: Function;
  settings: ISettingsKit;
  timeInfoFunc: Function;
}

export interface IPropsInfoRoute {
  countCoords: number;
  lengthPath: number;
  time: number;
}

export interface IPropsMapComponent {
  coords: number[][];
  centerMap: number[];
  startPoints?: number[][];
  viewPoints: boolean;
}

export interface IPropsMenuTop {
  setCoordFunc: Function;
  setSettingFunc: Function;
  //   используется для сброса информации о вычисленном пути, при изменении страны
  setCoordRouteFunc: Function;
}

export interface IPropsModalWindow {
  setViewFunc: Function;
  head: string;
  children?: ReactNode;
}
export interface IPropsSettingMap {
  flagPointsFunc: Function;
}
export interface IPropsHeader {
  children?: ReactNode;
}
export interface IPropsAbout {}
