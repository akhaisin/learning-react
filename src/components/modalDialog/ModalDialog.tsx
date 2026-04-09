import styles from './ModalDialog.module.css';


type ModalDialogProps = {
    caption: string;
    text: string;
    isOpen: boolean;
    onClose: () => void;
};


function ModalDialog({ caption, text, isOpen, onClose }: ModalDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modalDialog}>
        <div className={styles.header}>
          <h1>{caption}</h1>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <p>{text}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.okBtn} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </>
  );
}


export default ModalDialog;