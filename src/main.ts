/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, ItemView } from "obsidian";
import { TagExplorerViewType, TagExplorerView }  from "./panes";

const dev = process.env.BUILD !== "production";

interface TagExplorerSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: TagExplorerSettings = {
    mySetting: "default",
};

export default class TagExplorerPlugin extends Plugin {
    settings: TagExplorerSettings;
    explorerPane: null | TagExplorerView;

    async onload() {
        if (dev) console.log("Loading tag explorer plugin");

        // Settings
        await this.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));

        // Views
        // Won't be instantiated until setViewState() is used
        this.explorerPane = null;
        this.registerView(TagExplorerViewType, (leaf: WorkspaceLeaf) => (this.explorerPane = new TagExplorerView(leaf)));

        this.addCommand({
            id: "toggle-tag-explorer-pane",
            name: "Toggle Tag Explorer",
            callback: function() {
                this.openPane(TagExplorerViewType, true, true);
            }.bind(this),
        });

        if (this.app.workspace.layoutReady) {
            this.initWorkspace();
        } else {
            // The "layout-ready" event seems to have been removed in favor of onLayoutReady();
            this.app.workspace.onLayoutReady(this.initWorkspace.bind(this));
        }
    }

    async onunload() {
        console.log("unloading Items plugin");
        await this.closePanes(TagExplorerViewType, this.explorerPane);

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

    async closePanes(viewType: string, view: null | TagExplorerView = null): Promise<void> {
        // Views aren't instantiated until setViewState() is used
        if (view) await view.onClose();
        this.app.workspace.detachLeavesOfType(viewType);
    }

    async openPane(viewType: string, reveal = false, toggle = false): Promise<void> {
        /** @todo data-type attribute of the resulting workspace-leaf-content is undefined, and I don't know why */
        if (dev) console.log("viewTypeId used with setViewState:", viewType);
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
                    console.log("Secret: " + value);
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
