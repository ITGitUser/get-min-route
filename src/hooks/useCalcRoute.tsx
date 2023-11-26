import { IPoint } from "../coreAlgorithmGetPoints/IPoint";
import { ISettingsKit } from "../coreAlgorithmGetPoints/ISettingsKit";
import { MultyLevelAlgorithm } from "../coreAlgorithmGetPoints/MultyLevelAlgorithm";

function useCalcRoute(
  coords: number[][],
  settings: ISettingsKit,
  timeInfoFunc: Function,
  setCoordRouteFunc: Function
) {
  // возвращает 0 когда маршрут найден,
  //  и -1 когда маршрут не найден
  // или нет начальных координат
  const calculateRoute = (): number => {
    if (coords.length === 0) {
      return -1;
    }
    // преобразуем массив координат вида [[x,y]...[]] в вид [IPoint,...]
    let points: IPoint[] = [];
    for (const coord of coords) {
      points.push({ x: coord[0], y: coord[1] });
    }

    // запускаем алгоритм на преобразованном массиве
    let alg = new MultyLevelAlgorithm();
    alg.SetSettingKit(settings);
    let resPoints: IPoint[] = alg.SearchPath(points);

    let arrayCoordinates: number[][] = [];
    // обратно преобразуем массив вида [IPoint,...] в массив вида [[x,y]...[]], что бы дальше могли работать в яндекс картах
    for (const point of resPoints) {
      arrayCoordinates.push([point.x, point.y]);
    }

    // сетим затраченное время в состояние в компоненте app
    timeInfoFunc(alg.GetTime());
    // сетим массив координат найденного маршрута  в состояние в компоненте app
    setCoordRouteFunc(arrayCoordinates);
    return 0;
  };

  return calculateRoute;
}

export default useCalcRoute;
