declare var window: Window & typeof globalThis;
declare var document: Document;

declare module "element-ui/lib/transitions/collapse-transition";
declare module "element-ui";
// declare module "service";

interface Ref {
  value: any
}

interface Project {
  _id: string,
  name: string,
  description: string,
  createdAt: string
}

interface MockEvent {
  enabled: boolean
  _id: string
  name: string
  content: string
  project_id: string
  createdAt: string
}

interface MockEvents {
  [propName: string]: Array<MockEvent>;
}

interface StoreState {
  projects: Array<Project>
  mockEvents: MockEvents
}
