import { ItemView, WorkspaceLeaf } from "obsidian";
import "./explorer.css";

export const TagExplorerViewType = "tag-explorer-pane";
export const TagExplorerDisplayName = "Tag Explorer";

export class TagExplorerView extends ItemView {
    viewTypeId: string;
    displayName: string;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.viewTypeId = TagExplorerViewType;
        this.displayName = TagExplorerDisplayName;
    }

    getViewType(): string {
        return this.viewTypeId;
    }

    getDisplayText(): string {
        return this.displayName;
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: this.displayName });
    }

    async onClose() {
        // Nothing to clean up.
    }
}
