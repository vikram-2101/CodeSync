import { NodeId } from "./project.types";

export interface CreateFileOperation {
  type: "CREATE_FILE";
  id: NodeId;
  parentId: NodeId | null;
  name: string;
}

export interface CreateFolderOperation {
  type: "CREATE_FOLDER";
  id: NodeId;
  parentId: NodeId | null;
  name: string;
}

export interface RenameNodeOperation {
  id: NodeId;
  type: "RENAME_NODE";
  newName: string;
}

export interface DeleteNodeOperation {
  id: NodeId;
  type: "DELETE_NODE";
}

export type ProjectOperation =
  | CreateFileOperation
  | CreateFolderOperation
  | RenameNodeOperation
  | DeleteNodeOperation;
