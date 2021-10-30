/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView } from "obsidian";
import { TagExplorerViewType, TagExplorerView } from "./views";
import { dev } from "./constants";

interface TagExplorerSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: TagExplorerSettings = {
    mySetting: "default",
};

export default class TagExplorerPlugin extends Plugin {
    settings: TagExplorerSettings;

    async onload() {
        if (dev) console.log("Loading tag explorer plugin");

        // Settings
        await this.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));

        // Views
        this.registerView(TagExplorerViewType, (leaf: WorkspaceLeaf) => new TagExplorerView(leaf));

        // Commands
        this.addCommand({
            id: "toggle-tag-explorer-pane",
            name: "Toggle Tag Explorer",
            callback: function() {
                this.openPane(TagExplorerViewType, true, true);
            }.bind(this),
        });

        // Ribbons
        if (dev) {
            this.addRibbonIcon("question-mark-glyph", "Print leaf types", () => {
                this.app.workspace.iterateAllLeaves((leaf) => {
                    console.log(leaf.getViewState().type);
                });
            });
        }

        // Initialization
        if (this.app.workspace.layoutReady) {
            this.initWorkspace();
        } else {
            // The "layout-ready" event seems to have been removed in favor of onLayoutReady();
            this.app.workspace.onLayoutReady(this.initWorkspace.bind(this));
        }
    }

    async onunload() {
        if (dev) console.log("unloading Items plugin");
        await this.closePanes(TagExplorerViewType);
    }

    initWorkspace() {
        /** @TODO Make this tied to a setting */
        this.openPane(TagExplorerViewType);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async closePanes(viewType: string): Promise<void> {
        const leaves = this.app.workspace.getLeavesOfType(viewType);
        for (const leaf of leaves) {
            if (leaf.view instanceof TagExplorerView) {
                await leaf.view.onClose();
            }
        }
        this.app.workspace.detachLeavesOfType(viewType);
    }

    async openPane(viewType: string, reveal = false, toggle = false): Promise<void> {
        if (!this.app.workspace.getLeavesOfType(viewType).length) {
            await this.app.workspace.getRightLeaf(false).setViewState({
                type: viewType,
                active: true,
            });
        } else if (toggle) {
            this.closePanes(viewType);
        }
        if (reveal) this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(viewType)[0]);
    }
}

class SettingsTab extends PluginSettingTab {
    plugin: TagExplorerPlugin;

    constructor(app: App, plugin: TagExplorerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        // containerEl.createEl("h2", { text: "Settings" });

        new Setting(containerEl)
            .setName("Setting #1")
            .setDesc("It's a secret")
            .addText(text => text
                .setPlaceholder("Enter your secret")
                .setValue("")
                .onChange(async (value) => {
                    if (dev) console.log("Secret: " + value);
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
