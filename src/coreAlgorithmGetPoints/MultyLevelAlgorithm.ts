import { Claster } from "./Claster";
import { HelperMethods } from "./HelperMethods";
import { IPoint } from "./IPoint";
import { ISettingsKit } from "./ISettingsKit";
import { BaseSettingsKit } from "./SettingsKit";

export class MultyLevelAlgorithm extends HelperMethods {
  private _mainPath: IPoint[];
  private _arrayClasters: Claster[];
  private _pathBetweenClasters: number[];
  private _setting: ISettingsKit;
  private _time: number = 0;
  //   удаляет кластер из this_arrayClasters
  private DeleteClaster(claster: Claster): void {
    for (let index = 0; index < this._arrayClasters.length; index++) {
      if (
        claster.GetPoints()[0].x ===
          this._arrayClasters[index]?.GetPoints()[0].x &&
        claster.GetPoints()[0].y === this._arrayClasters[index].GetPoints()[0].y
      ) {
        this._arrayClasters.splice(index, 1);
      }
    }
  }
  //Редукция-понижение размерности задачи
  private Reduction(claster: Claster, deepReduct: number): void {
    // получить две точки максимально удаленные друг от друга
    // получить k-2 точек максимально удаленные от выбранных
    // создать кластера на основе получившихся точек
    // оставшиеся точки засунуть в ближайшие кластера
    // на каждом кластере рекурсивно вызвать редукцию

    // условия останова редукции
    if (this._setting.stoppingConditions(claster)) {
      return;
    }

    let clasters: Claster[] = [];
    let balancePoint: IPoint[] = [...claster.GetPoints()];
    this.DeleteClaster(claster);
    // получаем k точек максимально удаленные друг от друга
    let points: IPoint[] = this.GetPointsMaxDistance(
      this._setting.k,
      balancePoint
    );

    let futureClasters: IPoint[][] = [];
    for (const point of points) {
      futureClasters.push([point]);
    }

    // бежим по сотавшимся точкам и распихиваем их в ближайший будующий кластер
    for (
      let index_balance = 0;
      index_balance < balancePoint.length;
      index_balance++
    ) {
      let minDistance: number = Infinity;
      let indexClaster: number = 0;
      for (let index = 0; index < futureClasters.length; index++) {
        let distance: number = this.GetDistance(
          balancePoint[index_balance],
          points[index]
        );
        if (distance < minDistance) {
          minDistance = distance;
          indexClaster = index;
        }
      }
      futureClasters[indexClaster].push(balancePoint[index_balance]);
      balancePoint.splice(index_balance, 1);
      index_balance--;
    }
    // формируем кластера
    for (const points of futureClasters) {
      clasters.push(new Claster(points, deepReduct + 1));
    }

    for (const claster of clasters) {
      this._arrayClasters.push(claster);
    }

    // рекурсивно вызываем редукцию для каждого кластера
    for (const claster of clasters) {
      this.Reduction(claster, claster.GetDeepReduct());
    }
  }
  //этап Восстановления
  private Reconstruct(): void {
    // проходимся по каждому кластеру и решаем внутреннюю задачу(находим путь внутри кластера)
    for (const claster of this._arrayClasters) {
      this.SolveInternalTask(claster);
    }

    // решаем внешнюю задачу, на выходе получаем this._pathBetweenClasters
    this.SolveExternalTask();

    // выполняем шаг объединения, на выходе полуаем this._mainPath
    this.SolveUnionTask();
  }
  //  получаем массив k точек максимально удаленных друг от друга
  //    массив с оставшимися точками модифицируется
  private GetPointsMaxDistance(
    count: number,
    balancePoint: IPoint[]
  ): IPoint[] {
    let points: IPoint[] | undefined =
      this.GetTwoPointsMaxDistance(balancePoint);
    if (!points) {
      throw new Error("нет у тебя точек масимально удаленных друг от друга)");
    }

    // удаляем из оставшихся точек, найденные стартовые точки
    for (let index = 0; index < balancePoint.length; index++) {
      for (const point of points) {
        if (
          point.x === balancePoint[index].x &&
          point.y === balancePoint[index].y
        ) {
          balancePoint.splice(index, 1);
          index--;
          break;
        }
      }
    }

    // пока не найдем заданное количество точек, бежим по остатку и выбирем максимально удаленную точку от уже выранных
    while ((points as IPoint[]).length !== count) {
      let maxDistance: number = 0;
      let indexMaxdistance: number = 0;
      for (
        let index_balance = 0;
        index_balance < balancePoint.length;
        index_balance++
      ) {
        let distance: number = 0;
        for (const point of points as IPoint[]) {
          distance += this.GetDistance(balancePoint[index_balance], point);
        }
        if (distance >= maxDistance) {
          maxDistance = distance;
          indexMaxdistance = index_balance;
        }
      }
      points?.push(balancePoint[indexMaxdistance]);
      balancePoint.splice(indexMaxdistance, 1);
    }
    return points;
  }
  //возвращает две точки максимально удаленные друг от друга,
  // если в массиве меньше двух точек или нет совсем, то undefined
  private GetTwoPointsMaxDistance(arrayPoints: IPoint[]): IPoint[] | undefined {
    const length = arrayPoints.length;
    if (length < 2) {
      return undefined;
    }

    let maxDistance = this.GetDistance(arrayPoints[0], arrayPoints[1]);
    let point1 = arrayPoints[0];
    let point2 = arrayPoints[1];

    for (let i = 0; i < length - 1; i++) {
      for (let j = i + 1; j < length; j++) {
        const distance = this.GetDistance(arrayPoints[i], arrayPoints[j]);

        if (distance > maxDistance) {
          maxDistance = distance;
          point1 = arrayPoints[i];
          point2 = arrayPoints[j];
        }
      }
    }

    return [point1, point2];
  }
  //решение внутренней задачи-жадным методом: первая точка выбиарется случайно, следующие ближайшие
  //   модифицирует переданный кластер
  private SolveInternalTask(claster: Claster): void {
    claster.SetCenter();
    // если в кластре одна лишь точка, то запоминаем ее в маршурт
    if (claster.GetPoints().length === 1) {
      claster.PushIndexInPathInClaster(0);
    } else {
      this._setting.SolveInternalTask(claster);
    }
  }
  //решение внешней задачи, вычисляется полным перебором
  //   модифицирует this._pathBetweenClasters
  private SolveExternalTask(): void {
    const numClusters = this._arrayClasters.length;

    if (numClusters === 1) {
      this._pathBetweenClasters = [0];
      return;
    }

    const visitedClusters = new Set<number>();
    let indexFirst = 0;
    visitedClusters.add(indexFirst); // Посещен первый кластер
    this._pathBetweenClasters = [indexFirst];

    while (visitedClusters.size !== numClusters) {
      let minDistance = Infinity;
      let indexMinDistance = -1;

      for (let i = 0; i < numClusters; i++) {
        if (!visitedClusters.has(i)) {
          const curDistance = this.GetDistance(
            this._arrayClasters[
              this._pathBetweenClasters[this._pathBetweenClasters.length - 1]
            ].GetCenter(),
            this._arrayClasters[i].GetCenter()
          );

          if (curDistance < minDistance) {
            minDistance = curDistance;
            indexMinDistance = i;
          }
        }
      }

      visitedClusters.add(indexMinDistance);
      this._pathBetweenClasters.push(indexMinDistance);
    }
  }
  //шаг объединения
  private SolveUnionTask(): void {
    let startClaster: Claster =
      this._arrayClasters[this._pathBetweenClasters[0]];
    let secondClaster: Claster =
      this._arrayClasters[this._pathBetweenClasters[1]];

    let pointsFromStartClaster: IPoint[] = [
      startClaster.GetPointByIndex(startClaster.GetPathInClaster()[0]),
      startClaster.GetPointByIndex(
        startClaster.GetPathInClaster()[
          startClaster.GetPathInClaster().length - 1
        ]
      ),
    ];
    let pointFromSecondClaster: IPoint[] = [
      secondClaster.GetPointByIndex(secondClaster.GetPathInClaster()[0]),
      secondClaster.GetPointByIndex(
        secondClaster.GetPathInClaster()[
          secondClaster.GetPathInClaster().length - 1
        ]
      ),
    ];

    // находим точку в первом кластере и точку в соседнем кластере, расстояние между которыми минмально
    let firstPoints: IPoint[] | undefined = this.GetStartPoints(
      pointsFromStartClaster,
      pointFromSecondClaster
    );

    if (firstPoints) {
      // устанавливаем точку выхода для первого кластра
      startClaster.SetEndPoint(firstPoints[0]);
      // если полученная точка для первого кластера первая в маршруте кластера,
      //  то запоминаем решение внутренней задачи кластера в общем решении в правильном порядке,
      // в противном случае в обратном порядке
      if (
        pointsFromStartClaster[0].x === firstPoints[0].x &&
        pointsFromStartClaster[0].y === firstPoints[0].y
      ) {
        //    устанавливаем точку входа для первого кластера
        startClaster.SetStartPoint(pointsFromStartClaster[1]);
        // запоминаем маршрут внутри кластера в обратном порядке
        const reversedArray = startClaster.GetPathInClaster().slice().reverse();
        for (const index of reversedArray) {
          this._mainPath.push(startClaster.GetPointByIndex(index));
        }
      } else {
        //    устанавливаем точку входа для первого кластера
        startClaster.SetStartPoint(pointsFromStartClaster[0]);
        // запоминаем маршрут внутри кластера в правильном порядке
        for (const index of startClaster.GetPathInClaster()) {
          this._mainPath.push(startClaster.GetPointByIndex(index));
        }
      }
      // устанавливаем точку входа для второго кластера
      secondClaster.SetStartPoint(firstPoints[1]);
    } else {
      throw new Error("Ты не получил стартовые точки на шаге объединения");
    }
    // бежим по кластерам в порядке обхода, соединяем кластера между собой, записывая в общий маршрут
    for (let index = 1; index < this._pathBetweenClasters.length; index++) {
      let curClaster: Claster =
        this._arrayClasters[this._pathBetweenClasters[index]];
      let startPoint: IPoint = curClaster.GetStartPoint();
      let firstPointInPathInSecondClaster: IPoint = curClaster.GetPointByIndex(
        curClaster.GetPathInClaster()[0]
      );
      // проверяем, является ли стартовая точка первой в маршруте внутри кластера
      if (
        startPoint.x === firstPointInPathInSecondClaster.x &&
        startPoint.y === firstPointInPathInSecondClaster.y
      ) {
        let lastIndex: number = curClaster.GetPathInClaster().length - 1;
        curClaster.SetEndPoint(
          curClaster.GetPointByIndex(curClaster.GetPathInClaster()[lastIndex])
        );
        // записываем маршрут в правильном порядке
        for (const i of curClaster.GetPathInClaster()) {
          this._mainPath.push(curClaster.GetPointByIndex(i));
        }
      } else {
        curClaster.SetEndPoint(
          curClaster.GetPointByIndex(curClaster.GetPathInClaster()[0])
        );
        const reversedArray = curClaster.GetPathInClaster().slice().reverse();
        // записываем маршрут в обратном порядке
        for (const i of reversedArray) {
          this._mainPath.push(curClaster.GetPointByIndex(i));
        }
      }
      //   если текущий кластер последний , то устанавливаем завершающую точку обхода,
      // т.е. точку куда нужно прийти в итоге
      if (index === this._pathBetweenClasters.length - 1) {
        this._mainPath.push(this._arrayClasters[0].GetStartPoint());
      } else {
        let nextClaster: Claster =
          this._arrayClasters[this._pathBetweenClasters[index + 1]];
        let startPointForNextClaster: IPoint = this.GetPointMinDistance(
          curClaster.GetEndPoint(),
          [
            nextClaster.GetPointByIndex(nextClaster.GetPathInClaster()[0]),
            nextClaster.GetPointByIndex(
              nextClaster.GetPathInClaster()[
                nextClaster.GetPathInClaster().length - 1
              ]
            ),
          ]
        );
        nextClaster.SetStartPoint(startPointForNextClaster);
      }
    }
  }
  //возвращает две точки:первая это конечная точка в первом кластере,
  // вторая-начальная точка во втором кластре
  private GetStartPoints(
    pointsFromClaster1: IPoint[],
    pointsFromClaster2: IPoint[]
  ): IPoint[] | undefined {
    let minDistance = Infinity;
    let point1: IPoint | undefined;
    let point2: IPoint | undefined;

    for (const p1 of pointsFromClaster1) {
      for (const p2 of pointsFromClaster2) {
        const distance = this.GetDistance(p1, p2);

        if (distance < minDistance) {
          minDistance = distance;
          point1 = p1;
          point2 = p2;
        }
      }
    }

    if (point1 && point2) {
      return [point1, point2];
    }

    return undefined;
  }
  //возвращает ближайшую точку из массива, к выбранной точке
  private GetPointMinDistance(
    endPoint: IPoint,
    arrayPointsInNextClaster: IPoint[]
  ): IPoint {
    let minDistance: number = Infinity;
    let resultPoint: IPoint = arrayPointsInNextClaster[0];
    for (const point of arrayPointsInNextClaster) {
      let curDistance: number = this.GetDistance(endPoint, point);
      if (curDistance <= minDistance) {
        minDistance = curDistance;
        resultPoint = point;
      }
    }
    return resultPoint;
  }
  //непосредственно многоуровненвый алгоритм
  public SearchPath(arrayCoordinate: IPoint[]): IPoint[] {
    // сбрасываем все параметры
    this._mainPath = [];
    this._arrayClasters = [];
    this._pathBetweenClasters = [];
    this._time = 0;
    let timeAlgorithm = 0;
    timeAlgorithm = performance.now(); //засекаем время выполнения
    //выполняем метод редукции, на выходе получаем this._arrayclaster
    let mainClaster: Claster = new Claster(arrayCoordinate);
    this._arrayClasters.push(mainClaster);
    this.Reduction(mainClaster, 0);
    // выполняем метод восстановления, на выходе получаем this._mainPaths
    this.Reconstruct();
    timeAlgorithm = performance.now() - timeAlgorithm;
    this._time = timeAlgorithm;
    return this._mainPath;
  }
  //настройки, задающие базовый метод и собственный
  public SetSettingKit(kit: ISettingsKit): void {
    this._setting = kit;
  }
  //
  public GetTime() {
    return this._time;
  }
  public GetClasters() {
    return this._arrayClasters;
  }
  constructor() {
    super();
    this._mainPath = [];
    this._arrayClasters = [];
    this._pathBetweenClasters = [];
    this._setting = new BaseSettingsKit();
    this._time = 0;
  }
}
