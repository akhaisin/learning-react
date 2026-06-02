import type { TestSuiteResult } from "../utils/testRunner";
import { useTestPanel, countSuiteTests } from "./testPanelContext";
import styles from "./TestResultsPanel.module.css";

function SuiteBlock({ suite }: { suite: TestSuiteResult }) {
  const { total, passed } = countSuiteTests(suite);
  const allPassed = total > 0 && passed === total;
  const hasFailed = total > 0 && passed < total;

  return (
    <div className={styles.testSuite}>
      <div className={styles.suiteTitle}>
        <span className={styles.suiteName}>{suite.name}</span>
        {total > 0 && (
          <span
            className={[
              styles.suiteCount,
              allPassed ? styles.suiteCountPass : hasFailed ? styles.suiteCountFail : "",
            ].join(" ")}
          >
            {passed}/{total}
          </span>
        )}
      </div>
      {suite.cases.length > 0 && (
        <ul className={styles.caseList}>
          {suite.cases.map((tCase, cIdx) => (
            <li key={cIdx} className={styles.testCase}>
              <span
                className={[
                  styles.caseIcon,
                  tCase.pending ? styles.iconPending : tCase.passed ? styles.iconPass : styles.iconFail,
                ].join(" ")}
              >
                {tCase.pending ? "○" : tCase.passed ? "✔" : "✘"}
              </span>
              <div className={styles.caseDetails}>
                <span className={styles.caseName}>{tCase.name}</span>
                {tCase.error && <pre className={styles.caseError}>{tCase.error}</pre>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {suite.children.length > 0 && (
        <div className={styles.childSuites}>
          {suite.children.map((child, idx) => (
            <SuiteBlock key={idx} suite={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TestResultsContent() {
  const { testResults } = useTestPanel();

  return (
    <div className={styles.testBody}>
      {testResults.length === 0 ? (
        <div className={styles.noTestsText}>No tests executed yet.</div>
      ) : (
        testResults.map((suite, sIdx) => <SuiteBlock key={sIdx} suite={suite} />)
      )}
    </div>
  );
}
