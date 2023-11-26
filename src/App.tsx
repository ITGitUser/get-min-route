import { useState } from "react";
import MapComponent from "./component/MapComponent";
import MenuTop from "./component/MenuTop";
import ButtonCalcRoute from "./component/ButtonCalcRoute";
import { BaseSettingsKit } from "./coreAlgorithmGetPoints/SettingsKit";
import { ISettingsKit } from "./coreAlgorithmGetPoints/ISettingsKit";
import InfoRoute from "./component/InfoRoute";
import { HelperMethods } from "./coreAlgorithmGetPoints/HelperMethods";
import SettingRoute from "./component/SettingMap";
import styles from "./App.module.scss";
import Header from "./component/Header";
import ModalWindow from "./component/ModalWindow";
import About from "./component/About";
function App() {
  const helper = new HelperMethods();
  const [arrayCoordinate, setArrayCoordinate] = useState<number[][]>([]);
  const [typeSetting, setTypeSetting] = useState<ISettingsKit>(
    new BaseSettingsKit()
  );
  const [arrayCoordinateRoute, setArrayCoordinateRoute] = useState<number[][]>(
    []
  );
  const [timeInfo, setTimeInfo] = useState<number>(-1);
  const [flagPoints, setFlagPoints] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const Center: number[] = helper.GetCenter(arrayCoordinate);

  return (
    <div className={styles.AppContainer}>
      <Header>
        <h2>Тестовое приложение для решения задачи коммивояжера</h2>
        <button onClick={() => setIsModal(true)}>О проекте</button>
      </Header>
      <div className={styles.BodyContainer}>
        <div className={styles.MenuContainer}>
          <div>
            <MenuTop
              setCoordFunc={setArrayCoordinate}
              setSettingFunc={setTypeSetting}
              setCoordRouteFunc={setArrayCoordinateRoute}
            />
            {<SettingRoute flagPointsFunc={setFlagPoints}></SettingRoute>}
          </div>
          <div>
            {arrayCoordinateRoute.length > 0 && (
              <InfoRoute
                countCoords={arrayCoordinate.length}
                lengthPath={parseFloat(
                  helper.GetAllDistance(arrayCoordinateRoute).toFixed(4)
                )}
                time={parseFloat(helper.millisToSeconds(timeInfo).toFixed(4))}
              />
            )}
          </div>
          <ButtonCalcRoute
            coords={arrayCoordinate}
            setCoordRouteFunc={setArrayCoordinateRoute}
            settings={typeSetting}
            timeInfoFunc={setTimeInfo}
          />
        </div>
        <MapComponent
          coords={arrayCoordinateRoute}
          centerMap={Center}
          startPoints={arrayCoordinate}
          viewPoints={flagPoints}
        />{" "}
      </div>
      {isModal && (
        <ModalWindow head="О проекте" setViewFunc={setIsModal}>
          <About></About>
        </ModalWindow>
      )}
    </div>
  );
}

export default App;
