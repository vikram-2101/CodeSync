import {
  CreateFileOperation,
  CreateFolderOperation,
  DeleteNodeOperation,
  ProjectOperation,
  RenameNodeOperation,
} from "./project.operations";
import {
  FolderNode,
  NodeId,
  NodeType,
  ProjectNode,
  ProjectTree,
} from "./project.types";

export class ProjectService {
  apply(tree: ProjectTree, operation: ProjectOperation): ProjectTree {
    switch (operation.type) {
      case "CREATE_FILE":
        return this.applyCreateFile(tree, operation);

      case "CREATE_FOLDER":
        return this.applyCreateFolder(tree, operation);

      case "RENAME_NODE":
        return this.applyRenameNode(tree, operation);

      case "DELETE_NODE":
        return this.applyDeleteNode(tree, operation);

      default: {
        // Exhaustive check
        const _exhaustive: never = operation;
        throw new Error(
          `Unhandled operation type: ${JSON.stringify(_exhaustive)}`,
        );
      }
    }
  }

  // ==========================================================
  // Operation Handlers
  // ==========================================================

  private applyCreateFile(
    tree: ProjectTree,
    operation: CreateFileOperation,
  ): ProjectTree {
    this.assertNodeDoesNotExist(tree, operation.id);

    this.getParentFolder(tree, operation.parentId);
    this.assertUniqueName(tree, operation.parentId, operation.name);
    const now = Date.now();
    tree.nodes[operation.id] = {
      id: operation.id,
      type: NodeType.FILE,
      parentId: operation.parentId,
      name: operation.name,
      createdAt: now,
      updatedAt: now,
    };

    return tree;
  }

  private applyCreateFolder(
    tree: ProjectTree,
    operation: CreateFolderOperation,
  ): ProjectTree {
    this.assertNodeDoesNotExist(tree, operation.id);
    this.getParentFolder(tree, operation.parentId);
    this.assertUniqueName(tree, operation.parentId, operation.name);

    tree.nodes[operation.id] = {
      id: operation.id,
      type: NodeType.FOLDER,
      parentId: operation.parentId,
      name: operation.name,
      createdAt: Date.now(),
    };

    return tree;
  }

  private applyRenameNode(
    tree: ProjectTree,
    operation: RenameNodeOperation,
  ): ProjectTree {
    const node = this.getNode(tree, operation.id);
    if (node.name === operation.newName) {
      return tree; // No change needed if the name is the same
    }
    this.assertUniqueName(tree, node.parentId, operation.newName, operation.id);

    node.name = operation.newName;
    if (node.type === NodeType.FILE) {
      node.updatedAt = Date.now();
    }
    return tree;
  }

  private applyDeleteNode(
    tree: ProjectTree,
    operation: DeleteNodeOperation,
  ): ProjectTree {
    this.getNode(tree, operation.id);

    this.deleteSubtree(tree, operation.id);
    return tree;
  }

  // ==========================================================
  // Validation Helpers
  // ==========================================================

  private getNode(tree: ProjectTree, nodeId: NodeId): ProjectNode {
    const node = tree.nodes[nodeId];
    if (!node) {
      throw new Error(`Node with id ${nodeId} does not exist`);
    }
    return node;
  }

  private getParentFolder(
    tree: ProjectTree,
    parentId: NodeId | null,
  ): FolderNode | null {
    // first check if parentId is valid and then return the parent node, otherwise return null
    if (parentId == null) {
      return null;
    }
    const parent = this.getNode(tree, parentId);
    if (parent.type !== NodeType.FOLDER) {
      throw new Error(`Parent node with id ${parentId} is not a folder`);
    }
    return parent;
  }

  private assertNodeDoesNotExist(tree: ProjectTree, nodeId: NodeId) {
    if (tree.nodes[nodeId]) {
      throw new Error(`Node with id ${nodeId} already exists`);
    }
  }

  private assertUniqueName(
    tree: ProjectTree,
    parentId: NodeId | null,
    name: string,
    excludeNodeId?: NodeId,
  ) {
    const duplicate = Object.values(tree.nodes).find(
      (node) =>
        node.parentId === parentId &&
        node.name === name &&
        node.id !== excludeNodeId,
    );
    if (duplicate) {
      throw new Error(
        `Node with name ${name} already exists in parent Folder with id ${parentId}`,
      );
    }
  }
  private deleteSubtree(tree: ProjectTree, nodeId: NodeId) {
    const children = Object.values(tree.nodes).filter(
      (node) => node.parentId === nodeId,
    );
    children.forEach((child) => this.deleteSubtree(tree, child.id));
    delete tree.nodes[nodeId];
  }
}
