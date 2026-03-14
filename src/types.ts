export interface ProjectData {
  id: number;
  name: string;
  nodes: Node[];
  edges: Edge[];
  theme: Theme;
  settings: Settings;
}

export interface Node {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Theme {
  dark: boolean;
  logo: { uuid: string; width: number; height: number };
  color: string;
}

export interface Settings {
  title: string;
  description: string | null;
}
