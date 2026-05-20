import { useState } from 'react';
import styles from './Component.module.css';
import { defaultPanels, type AccordionPanel } from './utils';

type AccordionProps = {
  panels?: AccordionPanel[];
};

function Accordion({ panels = defaultPanels }: AccordionProps) {
  const [openPanelId, setOpenPanelId] = useState<string | null>(panels[0]?.id ?? null);

  const handleToggle = (panelId: string) => {
    setOpenPanelId((currentId) => (currentId === panelId ? null : panelId));
  };

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a collapsible accordion component that renders a list of panels, each with a
        clickable header and a toggleable body. Use <code>useState</code> to track the currently
        open panel by id, and conditionally render each panel's content based on whether its id
        matches the active one. Define a TypeScript interface for the panel data and accept the
        list as a typed prop.
      </p>

      <div className={styles.accordion}>
        {panels.map((panel) => {
          const isOpen = panel.id === openPanelId;

          return (
            <article key={panel.id} className={styles.panel}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                onClick={() => handleToggle(panel.id)}
              >
                <span>{panel.title}</span>
                <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen ? <p className={styles.content}>{panel.content}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Accordion;
