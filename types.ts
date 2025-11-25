export enum UserRole {
  DEVELOPER = 'Developer',
  QA = 'QA Engineer',
  MANAGER = 'Project Manager'
}

export enum HealthStatus {
  HEALTHY = 'Healthy',
  WARNING = 'Warning',
  CRITICAL = 'Critical'
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface Repository {
  id: string;
  name: string;
  provider: 'GitHub' | 'GitLab';
  fileCount: number;
  healthScore: number;
  lastAnalysis: string;
  metrics: {
    codeChurn: Metric;
    complexity: Metric;
    openIssues: Metric;
    testCoverage: Metric;
  };
}

export interface DependencyNode {
  id: string;
  group: number; // 1: UI, 2: Logic, 3: Data, 4: Util
  size: number; // Based on lines of code or complexity
  risk: number; // 0-100
  name: string;
}

export interface DependencyLink {
  source: string;
  target: string;
  value: number;
}

export interface DependencyGraphData {
  nodes: DependencyNode[];
  links: DependencyLink[];
}

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  riskScore: number;
  impactedFiles: number;
  status: 'Open' | 'Merged' | 'Closed';
  created: string;
  prediction: string;
}