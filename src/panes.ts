import { ItemView, WorkspaceLeaf } from "obsidian";
import "./explorer.css";

// Can't define these inside the constructor, because when getViewType is used by obsidian, the constructor hasn't ran yet
// https://discord.com/channels/686053708261228577/840286264964022302/899785798738640916
export const TagExplorerViewType = "tag-explorer-pane";
export const TagExplorerDisplayName = "Tag Explorer";

export class TagExplorerView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return TagExplorerViewType;
    }

    getDisplayText(): string {
        return TagExplorerDisplayName;
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: TagExplorerDisplayName });
    }

    async onClose() {
        // Nothing to clean up.
    }
}
