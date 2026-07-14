export interface BackendStatus {
  status: string;
  service: string;
  version: string;
}

export interface ModuleItem {
  title: string;
  description: string;
  icon: string;
}

export type PageName = 'home' | 'welcome';