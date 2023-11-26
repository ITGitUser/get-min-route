import { IPropsModalWindow } from "./interfaces/interfaces";
import styles from "./ModalWindow.module.scss";
const ModalWindow = ({ setViewFunc, head, children }: IPropsModalWindow) => {
  const handleModalClick = (event: { target: any; currentTarget: any }) => {
    if (event.target === event.currentTarget) {
      setViewFunc(false);
    }
  };
  return (
    <div className={styles.ModalWindowContainer} onClick={handleModalClick}>
      <div className={styles.modal}>
        <h2>{head}</h2>
        <div className={styles.textInModal}>{children}</div>
        <button
          className={styles.closeButton}
          onClick={() => setViewFunc(false)}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ModalWindow;
