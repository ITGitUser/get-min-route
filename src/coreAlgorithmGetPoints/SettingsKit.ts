import { Claster } from "./Claster";
import { HelperMethods } from "./HelperMethods";
import { IPoint } from "./IPoint";
import { ISettingsKit } from "./ISettingsKit";

let helper = new HelperMethods();

export class BaseSettingsKit implements ISettingsKit {
  k: number = 8;
  deepReduct: number = 2 * this.k;
  // условия останова редукции
  stoppingConditions(claster: Claster): boolean {
    if (
      claster.GetPoints().length <= this.k ||
      claster.GetDeepReduct() >= this.deepReduct
    ) {
      return true;
    } else {
      return false;
    }
  }
  // внутренняя задача
  SolveInternalTask(claster: Claster): void {
    let curPoints: IPoint[] = [...claster.GetPoints()];
    // первую точку выбираем случайным образом
    let indexFirst: number = Math.floor(
      Math.random() * claster.GetPoints().length
    );
    // запоминаем в маршруте внутри кластера первую точку
    claster.PushIndexInPathInClaster(indexFirst);
    //   удаляем индекс первой выбранной точки из оставшихся точек
    curPoints.splice(indexFirst, 1);

    //   бежим по массиву пути, который будет пополнятся
    for (let i_1 = 0; i_1 < claster.GetPathInClaster().length; i_1++) {
      if (curPoints.length === 0) {
        break;
      }
      let minDistance: number = Infinity;
      let indexMinDistance = 0;
      // проверяем расстояние для каждой оставшейся точки
      for (let i_2 = 0; i_2 < curPoints.length; i_2++) {
        let pointPath: IPoint =
          claster.GetPoints()[claster.GetPathInClaster()[i_1]];
        let pointNew: IPoint = curPoints[i_2];

        let curDistance: number = helper.GetDistance(pointPath, pointNew);

        if (curDistance <= minDistance) {
          minDistance = curDistance;
          indexMinDistance = i_2;
        }
      }
      let indexPointInClasterPoints = 0;
      for (let index = 0; index < claster.GetPoints().length; index++) {
        if (
          claster.GetPointByIndex(index).x === curPoints[indexMinDistance].x &&
          claster.GetPointByIndex(index).y === curPoints[indexMinDistance].y
        ) {
          indexPointInClasterPoints = index;
          break;
        }
      }
      // запоминаем индекс ближайшей точки
      claster.PushIndexInPathInClaster(indexPointInClasterPoints);
      // удаляем из оставшихся
      curPoints.splice(indexMinDistance, 1);
    }
  }
}

export class MySettingsKit implements ISettingsKit {
  k: number = 2;
  deepReduct: number = 2 * this.k;
  // условия останова редукции
  stoppingConditions(claster: Claster): boolean {
    if (
      claster.GetPoints().length <= this.k ||
      claster.GetDeepReduct() >= this.deepReduct
    ) {
      return true;
    } else {
      return false;
    }
  }
  // внутренняя задача
  // первая точка выбирается максимально удаенная от центра
  GetIndexPointOutCenter(claster: Claster): number {
    let indexCenterPoint: number = 0;
    let maxDistanceToCenter: number = 0;
    for (let index = 0; index < claster.GetPoints().length; index++) {
      let curDistance: number = helper.GetDistance(
        claster.GetPointByIndex(index),
        claster.GetCenter()
      );
      if (curDistance >= maxDistanceToCenter) {
        maxDistanceToCenter = curDistance;
        indexCenterPoint = index;
      }
    }
    return indexCenterPoint;
  }
  //возвращает индекс точки ближайшей к предыдущему кластеру
  GetIndexPoint(claster: Claster, centerPrevClaster: IPoint | undefined) {
    if (centerPrevClaster === undefined) {
      let indexFirst: number = Math.floor(
        Math.random() * claster.GetPoints().length
      );
      return indexFirst;
    } else {
      let indexPoint: number = 0;
      let minDistanceToPrevClaster: number = Infinity;
      for (let index = 0; index < claster.GetPoints().length; index++) {
        let curDistance: number = helper.GetDistance(
          claster.GetPointByIndex(index),
          centerPrevClaster
        );
        if (curDistance < minDistanceToPrevClaster) {
          minDistanceToPrevClaster = curDistance;
          indexPoint = index;
        }
      }
      return indexPoint;
    }
  }
  // внутренняя задача
  // идея в том что бы брать самую удаленную от центра точку в кластере
  SolveInternalTask2(claster: Claster): void {
    let curPoints: IPoint[] = [...claster.GetPoints()];
    // первую точку выбираем max удаленно от центра кластера
    let indexFirst: number = this.GetIndexPointOutCenter(claster);

    // запоминаем в маршруте внутри кластера первую точку
    claster.PushIndexInPathInClaster(indexFirst);
    //   удаляем индекс первой выбранной точки из оставшихся точек
    curPoints.splice(indexFirst, 1);

    //   бежим по массиву пути, который будет пополнятся
    for (let i_1 = 0; i_1 < claster.GetPathInClaster().length; i_1++) {
      if (curPoints.length === 0) {
        break;
      }
      let minDistance: number = Infinity;
      let indexMinDistance = 0;
      // проверяем расстояние для каждой оставшейся точки
      for (let i_2 = 0; i_2 < curPoints.length; i_2++) {
        let pointPath: IPoint =
          claster.GetPoints()[claster.GetPathInClaster()[i_1]];
        let pointNew: IPoint = curPoints[i_2];

        let curDistance: number = helper.GetDistance(pointPath, pointNew);

        if (curDistance <= minDistance) {
          minDistance = curDistance;
          indexMinDistance = i_2;
        }
      }
      let indexPointInClasterPoints = 0;
      for (let index = 0; index < claster.GetPoints().length; index++) {
        if (
          claster.GetPointByIndex(index).x === curPoints[indexMinDistance].x &&
          claster.GetPointByIndex(index).y === curPoints[indexMinDistance].y
        ) {
          indexPointInClasterPoints = index;
          break;
        }
      }
      // запоминаем индекс ближайшей точки
      claster.PushIndexInPathInClaster(indexPointInClasterPoints);
      // удаляем из оставшихся
      curPoints.splice(indexMinDistance, 1);
    }
  }

  SolveInternalTask(claster: Claster): void {
    let curPoints: IPoint[] = [...claster.GetPoints()];
    // первую точку выбираем max удаленно от центра кластера
    let indexFirst: number = this.GetIndexPointOutCenter(claster);

    // запоминаем в маршрут внутри кластера первую точку
    claster.PushIndexInPathInClaster(indexFirst);
    //   удаляем индекс первой выбранной точки из оставшихся точек
    curPoints.splice(indexFirst, 1);

    while (curPoints.length !== 0) {
      let minDistance: number = Infinity;
      let indexMinDistance = 0;
      let pointPath: IPoint = claster.GetPointByIndex(
        claster.GetPathInClaster()[claster.GetPathInClaster().length - 1]
      );

      for (let index = 0; index < curPoints.length; index++) {
        let pointNew: IPoint = curPoints[index];
        let curDistance: number = helper.GetDistance(pointPath, pointNew);

        if (minDistance > curDistance) {
          minDistance = curDistance;
          indexMinDistance = index;
        }
      }
      let indexPoint = claster
        .GetPoints()
        .findIndex(
          (point) =>
            point.x === curPoints[indexMinDistance].x &&
            point.y === curPoints[indexMinDistance].y
        );
      claster.PushIndexInPathInClaster(indexPoint);
      curPoints.splice(indexMinDistance, 1);
    }
  }
  // находит индекс ближайшей точки
  findNearestPoint(currentPoint: IPoint, points: IPoint[]): number {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let i = 0; i < points.length; i++) {
      const distance = helper.GetDistance(currentPoint, points[i]);
      if (distance < nearestDistance) {
        nearestIndex = i;
        nearestDistance = distance;
      }
    }

    return nearestIndex;
  }
  //
  calculateRoute(startPoint: IPoint, points: IPoint[]): IPoint[] {
    const remainingPoints = [...points];
    const route: IPoint[] = [startPoint];
    let currentPoint = startPoint;

    while (remainingPoints.length > 0) {
      const nearestIndex = this.findNearestPoint(currentPoint, remainingPoints);
      const nearestPoint = remainingPoints[nearestIndex];

      route.push(nearestPoint);
      remainingPoints.splice(nearestIndex, 1);
      currentPoint = nearestPoint;
    }

    return route;
  }
  SolveInternalTask3(claster: Claster): void {
    let curPoints: IPoint[] = [...claster.GetPoints()];
    // первую точку выбираем max удаленно от центра кластера
    let indexFirst: number = this.GetIndexPointOutCenter(claster);

    // запоминаем в маршрут внутри кластера первую точку
    claster.PushIndexInPathInClaster(indexFirst);
    //   удаляем индекс первой выбранной точки из оставшихся точек
    curPoints.splice(indexFirst, 1);

    let route = this.calculateRoute(
      claster.GetPointByIndex(claster.GetPathInClaster()[0]),
      curPoints
    );

    for (
      let index_pointInPath = 0;
      index_pointInPath < route.length;
      index_pointInPath++
    ) {
      for (
        let index_pointInClaster = 0;
        index_pointInClaster < claster.GetPoints().length;
        index_pointInClaster++
      ) {
        if (
          route[index_pointInPath].x ===
            claster.GetPointByIndex(index_pointInClaster).x &&
          route[index_pointInPath].y ===
            claster.GetPointByIndex(index_pointInClaster).y
        ) {
          claster.PushIndexInPathInClaster(index_pointInClaster);
        }
      }
    }
  }
}
