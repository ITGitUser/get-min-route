import { IPropsInfoRoute } from "./interfaces/interfaces";
import styles from "./InfoRoute.module.scss";
const InfoRoute = ({ lengthPath, time, countCoords }: IPropsInfoRoute) => {
  return (
    <div className={styles.InfoRouteContainer}>
      <span>Информация о маршруте:</span>
      <div className={styles.InfoBlock}>
        <div>
          Количество координат: <span>{countCoords}</span>
        </div>
        <div>
          Расстояние: <span>{lengthPath}</span>
        </div>
        <div>
          Время алгоритма: <span>{time} сек</span>
        </div>
      </div>
    </div>
  );
};
export default InfoRoute;
