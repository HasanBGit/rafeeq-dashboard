import { Repository, DependencyGraphData, PullRequest, HealthStatus } from '../types';

// Mock Data simulating the "Data/Infrastructure Layer"
// In a real app, this would use the Adapter Pattern to normalize GitHub/GitLab APIs

const MOCK_REPO: Repository = {
  id: 'repo-123',
  name: 'irhvs-frontend-core',
  provider: 'GitHub',
  fileCount: 1420,
  healthScore: 82,
  lastAnalysis: '2023-10-27T10:30:00Z',
  metrics: {
    codeChurn: { name: 'Code Churn', value: 1250, unit: 'lines/week', trend: 'up', description: 'High churn indicates instability.' },
    complexity: { name: 'Cyclomatic Complexity', value: 4.5, unit: 'avg/function', trend: 'stable', description: 'Average complexity per function.' },
    openIssues: { name: 'Open Issues', value: 24, unit: 'count', trend: 'down', description: 'Total open bugs and tasks.' },
    testCoverage: { name: 'Test Coverage', value: 78, unit: '%', trend: 'up', description: 'Percentage of code covered by unit tests.' }
  }
};

const MOCK_GRAPH: DependencyGraphData = {
  nodes: [
    { id: 'App.tsx', group: 1, size: 20, risk: 10, name: 'App.tsx' },
    { id: 'Dashboard.tsx', group: 1, size: 35, risk: 20, name: 'Dashboard.tsx' },
    { id: 'Graph.tsx', group: 1, size: 40, risk: 65, name: 'Graph.tsx' },
    { id: 'api.ts', group: 4, size: 15, risk: 5, name: 'api.ts' },
    { id: 'utils.ts', group: 4, size: 10, risk: 5, name: 'utils.ts' },
    { id: 'AuthController.ts', group: 2, size: 25, risk: 80, name: 'AuthController.ts' },
    { id: 'UserStore.ts', group: 3, size: 30, risk: 15, name: 'UserStore.ts' },
    { id: 'Settings.tsx', group: 1, size: 15, risk: 10, name: 'Settings.tsx' },
    { id: 'Layout.tsx', group: 1, size: 20, risk: 5, name: 'Layout.tsx' },
    { id: 'SCMAdapter.ts', group: 3, size: 45, risk: 40, name: 'SCMAdapter.ts' },
    { id: 'NotificationService.ts', group: 2, size: 15, risk: 10, name: 'NotificationService.ts' },
    { id: 'Analyzer.ts', group: 2, size: 60, risk: 90, name: 'Analyzer.ts' } // High risk core logic
  ],
  links: [
    { source: 'App.tsx', target: 'Dashboard.tsx', value: 1 },
    { source: 'App.tsx', target: 'Layout.tsx', value: 1 },
    { source: 'Dashboard.tsx', target: 'Graph.tsx', value: 3 },
    { source: 'Dashboard.tsx', target: 'UserStore.ts', value: 2 },
    { source: 'Graph.tsx', target: 'utils.ts', value: 1 },
    { source: 'AuthController.ts', target: 'api.ts', value: 5 },
    { source: 'UserStore.ts', target: 'api.ts', value: 2 },
    { source: 'SCMAdapter.ts', target: 'api.ts', value: 4 },
    { source: 'Analyzer.ts', target: 'SCMAdapter.ts', value: 6 },
    { source: 'Analyzer.ts', target: 'utils.ts', value: 2 },
    { source: 'Dashboard.tsx', target: 'Analyzer.ts', value: 1 },
  ]
};

const MOCK_PRS: PullRequest[] = [
  { id: 'PR-402', title: 'Refactor Auth Controller', author: 'j.doe', riskScore: 85, impactedFiles: 12, status: 'Open', created: '2 hrs ago', prediction: 'High Risk: Touches legacy security module.' },
  { id: 'PR-405', title: 'Update Dashboard Styles', author: 's.smith', riskScore: 12, impactedFiles: 3, status: 'Open', created: '5 hrs ago', prediction: 'Low Risk: UI only changes.' },
  { id: 'PR-401', title: 'Fix API Retry Logic', author: 'm.chen', riskScore: 45, impactedFiles: 2, status: 'Merged', created: '1 day ago', prediction: 'Medium Risk: Core networking logic.' },
  { id: 'PR-406', title: 'Add GitLab Support', author: 'a.baker', riskScore: 60, impactedFiles: 8, status: 'Open', created: '30 mins ago', prediction: 'Medium Risk: New integration adapter.' },
];

export const SCMAdapter = {
  fetchRepositoryData: async (): Promise<Repository> => {
    // Simulate API latency
    return new Promise(resolve => setTimeout(() => resolve(MOCK_REPO), 800));
  },
  
  fetchDependencyGraph: async (): Promise<DependencyGraphData> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GRAPH), 600));
  },

  fetchPullRequests: async (): Promise<PullRequest[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PRS), 500));
  },

  getHistoricalHealth: () => {
    return [
      { date: 'Mon', score: 88 },
      { date: 'Tue', score: 87 },
      { date: 'Wed', score: 82 }, // Dip caused by high churn
      { date: 'Thu', score: 84 },
      { date: 'Fri', score: 85 },
      { date: 'Sat', score: 82 },
      { date: 'Sun', score: 82 },
    ];
  }
};