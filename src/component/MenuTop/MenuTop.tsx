import { ChangeEvent, useState } from "react";
import {
  BaseSettingsKit,
  MySettingsKit,
} from "../../coreAlgorithmGetPoints/SettingsKit";
import { DATA } from "../../data/allData";
import { IPropsMenuTop } from "../interfaces/interfaces";
import styles from "./Menutop.module.scss";
interface IOption {
  name: string;
  type?: string;
}

let optionCountry: IOption[] = [
  { name: "Djibouti" },
  { name: "Uruguay" },
  { name: "Qatar" },
  { name: "Western Sahara" },
];
let optionSetting: IOption[] = [
  { name: "базовые", type: "base" },
  { name: "собственные", type: "my" },
];

function MenuTop({
  setCoordFunc,
  setSettingFunc,
  setCoordRouteFunc,
}: IPropsMenuTop) {
  const [selectedOptionCountry, setSelectedOptionCountry] =
    useState<string>("");
  const [selectedOptionSetting, setSelectedOptionSetting] =
    useState<string>("");

  let Countries: Record<string, number[][]> = {};

  optionCountry.map((option, index) => {
    return (Countries[option.name] = DATA[index]);
  });

  const handleSelectChangeCountry = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionCountry(event.target.value);
    setCoordFunc(Countries[event.target.value]);
    setCoordRouteFunc([]);
  };
  const handleSelectChangeSetting = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionSetting(event.target.value);
    if (event.target.value === "base") {
      setSettingFunc(new BaseSettingsKit());
    } else if (event.target.value === "my") {
      setSettingFunc(new MySettingsKit());
    }
  };

  const GetOption = (options: IOption[]): JSX.Element[] => {
    let resoptions: JSX.Element[] = [];
    for (const option of options) {
      resoptions.push(<option value={option.type}>{option.name}</option>);
    }
    return resoptions;
  };

  return (
    <div className={styles.MenuTopContainer}>
      <form>
        <span>Стандартные задачи:</span>
        <select
          value={selectedOptionCountry}
          onChange={handleSelectChangeCountry}
          required
        >
          <option value={""} disabled>
            Выберите страну
          </option>
          {GetOption(optionCountry)}
        </select>
        <span>Настройки алгоритма:</span>
        <select
          value={selectedOptionSetting}
          onChange={handleSelectChangeSetting}
          required
        >
          {GetOption(optionSetting)}
        </select>
      </form>
    </div>
  );
}

export default MenuTop;
