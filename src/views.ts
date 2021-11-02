import { ItemView, WorkspaceLeaf } from "obsidian";
import { createButton } from "./gui";
import { dev } from "./constants";
import "./explorer.css";

// Declaring these inside the constructor and returning via this.property doesn't work
// https://discord.com/channels/686053708261228577/840286264964022302/899785798738640916
export const TagExplorerViewType = "tag-explorer-pane";
export const TagExplorerDisplayName = "Tag Explorer";
export const TagExplorerIcon = "tag-glyph";

/**
 * Custom view used as the Tag Explorer pane
 */
export class TagExplorerView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    /** The view type string used by obsidian */
    getViewType(): string { return TagExplorerViewType; }

    /** Human readable text displayed to the user by obsidian */
    getDisplayText(): string { return TagExplorerDisplayName; }

    /** The icon obsidian uses for the view */
    getIcon(): string { return TagExplorerIcon; }

    /** Ran by obsidian whenever the view is opened */
    async onOpen(): Promise<void> {
        const content = this.containerEl.children[1]; // this.containerEl.querySelector(".view-content");
        content.empty();
        const header = content.createDiv({ cls: "nav-header" });
        const buttons = header.createDiv({ cls: "nav-buttons-container" });
        createButton(buttons, TagExplorerViewType, "Change sort order", "up-and-down-arrows", function(ev, element, viewType) {
            //
        });
        createButton(buttons, TagExplorerViewType, "Indent nested tags", "stacked-levels", function(ev, element, viewType) {
            //
        });
        const container = content.createDiv({ cls: "nav-ie-container" });
        if (dev) console.log("Pane opened", this.containerEl);
    }

    /** Used by obsidian & our own code to clean up and handle closing the view */
    async onClose(): Promise<void> {
        // Nothing to clean up
    }
}
