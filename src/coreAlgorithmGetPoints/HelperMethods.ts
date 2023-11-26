import { IPoint } from "./IPoint";

export class HelperMethods {
  // считает и возвращает растояние между двумя конкретными точками в кластере
  // евклидово расстояние между двумя точками
  GetDistance(point1: IPoint, point2: IPoint): number {
    let distance: number = Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
    return distance;
  }
  millisToSeconds(millis: number): number {
    let seconds: number = millis / 1000;
    return seconds;
  }
  GetAllDistance(coords: number[][]): number {
    let distance: number = 0;
    for (let index = 0; index < coords.length - 1; index++) {
      distance += Math.sqrt(
        Math.pow(coords[index][0] - coords[index + 1][0], 2) +
          Math.pow(coords[index][1] - coords[index + 1][1], 2)
      );
    }
    return distance;
  }

  GetCenter(coords: number[][]): number[] {
    let sumX: number = 0;
    let sumY: number = 0;

    for (const point of coords) {
      sumX += point[0];
      sumY += point[1];
    }
    if (coords.length === 0) {
      return [55.751574, 37.573856];
    }
    const averageX = sumX / coords.length;
    const averageY = sumY / coords.length;

    return [averageX, averageY];
  }
}
