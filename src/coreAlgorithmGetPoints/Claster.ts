import { IPoint } from "./IPoint";

export class Claster {
  private _points: IPoint[];
  private _startPoint: IPoint = { x: 0, y: 0 };
  private _EndPoint: IPoint = { x: 0, y: 0 };
  private _center: IPoint = { x: 0, y: 0 };
  private _pathInClaster: number[]; //массив индексов из _points в порядке обхода-> путь который минимальный
  private _deepReduct: number;

  // считает и устанавливает центр кластера по методу центр масс
  SetCenter(): void {
    let sumX: number = 0;
    let sumY: number = 0;

    for (const point of this._points) {
      sumX += point.x;
      sumY += point.y;
    }

    const averageX = sumX / this._points.length;
    const averageY = sumY / this._points.length;

    this._center = { x: averageX, y: averageY };
  }
  GetCenter(): IPoint {
    return this._center;
  }
  // возвращает все точки в кластере
  GetPoints(): IPoint[] {
    return this._points;
  }
  // возвращает точку по индексу
  GetPointByIndex(index: number): IPoint {
    return this._points[index];
  }

  // устанавливает точку входв в кластер
  SetStartPoint(point: IPoint): void {
    this._startPoint = point;
  }
  // устанаваливает точку выхода из кластера
  SetEndPoint(point: IPoint): void {
    this._EndPoint = point;
  }
  // возвращает точку входа в кластер
  GetStartPoint(): IPoint {
    return this._startPoint;
  }
  // возвращает точку выхода из кластера
  GetEndPoint(): IPoint {
    return this._EndPoint;
  }
  // устанавливает глубину редукции кластера
  SetDeepReduct(n: number): void {
    this._deepReduct = n;
  }
  // возвращает глубину редукции кластера
  GetDeepReduct(): number {
    return this._deepReduct;
  }
  //добавляет индекс точки в конец пути кластера
  PushIndexInPathInClaster(index: number): void {
    this._pathInClaster.push(index);
  }
  //  возвращает путь в кластере, содержащий индексы точек поля points в порядке обхода
  GetPathInClaster(): number[] {
    return this._pathInClaster;
  }
  constructor(arrayPoints?: IPoint[], deep?: number) {
    if (arrayPoints) {
      this._points = [...arrayPoints];
    } else {
      this._points = [];
    }
    if (deep) {
      this._deepReduct = deep;
    } else {
      this._deepReduct = 0;
    }

    this._pathInClaster = [];
  }
}
