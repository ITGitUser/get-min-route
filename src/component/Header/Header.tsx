import { IPropsHeader } from "../interfaces/interfaces";
import styles from "./Header.module.scss";
const Header = ({ children }: IPropsHeader) => {
  return <div className={styles.HeaderContainer}>{children}</div>;
};
export default Header;
