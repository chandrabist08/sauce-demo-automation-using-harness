export const FRAMEWORK_EVIDENCE = {
  outputDir: 'evidence/test-output',
  htmlReport: 'evidence/reports/html',
  jsonReport: 'evidence/reports/results.json',
  junitReport: 'evidence/reports/junit.xml',
  harDir: 'evidence/har',
  screenshotsDir: 'evidence/screenshots',
  tracesDir: 'evidence/traces',
  failureEvidence: 'evidence/failure-evidence.json',
} as const;

export type FrameworkEvidence = typeof FRAMEWORK_EVIDENCE;
