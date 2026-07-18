import { NodeId } from "./project.types";

interface CreateFileOperation {
  type: "CREATE_FILE";
  id: NodeId;
  parentId: NodeId | null;
  name: string;
}

interface CreateFolderOperation {
  type: "CREATE_FOLDER";
  id: NodeId;
  parentId: NodeId | null;
  name: string;
}

interface RenameNodeOperation {
  id: NodeId;
  type: "RENAME_NODE";
  newName: string;
}

interface DeleteNodeOperation {
  nodeId: NodeId;
  type: "DELETE_NODE";
}

export type ProjectOperation =
  | CreateFileOperation
  | CreateFolderOperation
  | RenameNodeOperation
  | DeleteNodeOperation;
