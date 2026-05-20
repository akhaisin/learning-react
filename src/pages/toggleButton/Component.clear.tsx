// import useToggle from "./utils";
import styles from "./Component.module.css";

function ToggleButton() {
  // TODO: Consume the hook here
  // const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "1.25rem", maxWidth: "520px", lineHeight: "1.55" }}>
        Build a custom useToggle hook that encapsulates a boolean state and a toggle function.
        Return them as a typed tuple. Consume the hook in a button that changes its label and
        CSS class based on the active state.
      </p>
      {/* TODO: Add onClick and change label/class dynamically */}
      <button className={styles.toggle}>
        OFF
      </button>
    </div>
  );
}

export default ToggleButton;
