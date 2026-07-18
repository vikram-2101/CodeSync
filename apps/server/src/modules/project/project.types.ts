export type ProjectId = string;

export type NodeId = string;

export enum NodeType {
  FILE = "file",
  FOLDER = "folder",
}

export interface BaseNode {
  id: NodeId;
  name: string;
  parentId: NodeId | null;
  createdAt: number;
}

export interface FileNode extends BaseNode {
  type: NodeType.FILE;
  language?: string;
  updatedAt: number;
}

export interface FolderNode extends BaseNode {
  type: NodeType.FOLDER;
}

export type ProjectNode = FileNode | FolderNode;

export type NodeMap = Record<NodeId, ProjectNode>;

export interface ProjectTree {
  projectId: ProjectId;
  nodes: NodeMap;
}
