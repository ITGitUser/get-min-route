import { ChangeEvent, useState } from "react";

import { IPropsSettingMap } from "../interfaces/interfaces";
import styles from "./SettingMap.module.scss";
const SettingRoute = ({ flagPointsFunc }: IPropsSettingMap) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    flagPointsFunc(event.target.checked);
  };

  return (
    <div className={styles.SettingMapContainer}>
      <div>
        <span>Настройки карты:</span>
      </div>

      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        Отображать точки
      </label>
    </div>
  );
};
export default SettingRoute;
