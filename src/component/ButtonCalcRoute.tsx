import { useState } from "react";
import useCalcRoute from "../hooks/useCalcRoute";
import ModalWindow from "./ModalWindow";
import { IPropsButtonCalcRoute } from "./interfaces/interfaces";
import styles from "./ButtonCalcRoute.module.scss";
const ButtonCalcRoute = ({
  coords,
  setCoordRouteFunc,
  settings,
  timeInfoFunc,
}: IPropsButtonCalcRoute) => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const calculateRoute = useCalcRoute(
    coords,
    settings,
    timeInfoFunc,
    setCoordRouteFunc
  );

  const hadleClickButton = () => {
    let flag: number = calculateRoute();
    if (flag === -1) {
      setIsModal(true);
    }
  };
  return (
    <div className={styles.ButtonCalcRouteContainer}>
      <button onClick={() => hadleClickButton()}>Вычислить маршрут</button>
      {isModal && (
        <ModalWindow head="Внимание!" setViewFunc={setIsModal}>
          <div>Пожалуйста, выберите страну из списка</div>
        </ModalWindow>
      )}
    </div>
  );
};

export default ButtonCalcRoute;
