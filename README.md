# 🍭 sugardd.js

<p align="center">
  <img src="https://img.shields.io/npm/v/sugardd.js.svg?style=for-the-badge" alt="NPM Version"/>
  <img src="https://img.shields.io/github/license/cloud-dark/sugardd.js.svg?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg?style=for-the-badge" alt="Node Version"/>
</p>

A sweet and structured project explorer that visualizes your codebase with beautiful tree diagrams and deep analysis. Instantly understand any project's architecture, find key files, and generate documentation. Perfect for onboarding, code reviews, and documentation generation.


## Table of Contents

- [Why sugardd.js?](#why-sugarddjs)
- [✨ Features (Detailed)](#-features-detailed)
  - [Intuitive Project Tree](#1-intuitive-project-tree)
  - [Inline File Content Display](#2-inline-file-content-display)
  - [Advanced Filtering Engine](#3-advanced-filtering-engine)
  - [Comprehensive Statistics](#4-comprehensive-statistics)
  - [Multiple Export Formats](#5-multiple-export-formats)
  - [Interactive Server Mode](#6-interactive-server-mode)
- [🚀 Installation](#-installation)
- [📖 Usage & Examples](#-usage--examples)
  - [Command-Line Options](#command-line-options)
  - [Practical Scenarios](#practical-scenarios)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## Why sugardd.js?

Whether you're onboarding to a new project, preparing for a code review, or creating documentation, `sugardd.js` gives you a complete overview in seconds. It eliminates the need to manually browse folders and provides a high-level, analyzable summary of your entire codebase.

## ✨ Features (Detailed)

### 1. Intuitive Project Tree

Visualize your entire project structure in a clean, colorful, and easy-to-understand tree format right in your terminal.

-   **What it does:** Shows directories and files in a nested hierarchy.
-   **Why it's useful:** Quickly grasp the layout of a project without opening a file explorer or IDE.

**Example:**
```bash
sugardd
```

This command will output a tree structure of your current directory, highlighting files and folders with intuitive icons:

```bash
🍬 Analyzing project structure...
📁 my-awesome-project
    ├── 📁 src
    │   └── 📄 index.js
    ├── 📄 package.json
    └── 📄 README.md
```

### 2. Inline File Content Display

Go beyond the structure. `sugardd.js` can directly display the content of your files within the tree view, giving you immediate context.

-   **What it does:** Prints the content of text-based files directly below their names.
-   **Why it's useful:** Read configuration files, check small utility scripts, or review documentation without ever leaving your terminal.

**Example:**
```bash
sugardd
```

This is the default behavior!

```bash
...
├── 📄 package.json
│   ┌──────────────────────────────────────────────────┐
│   │ {
│   │   "name": "my-awesome-project",
│   │   "version": "1.0.0"
│   │ }
│   └──────────────────────────────────────────────────┘
└── 📄 README.md
    ┌──────────────────────────────────────────────────┐
    │ # My Awesome Project
    │ 
    │ Welcome to the readme!
    └──────────────────────────────────────────────────┘
```
> **Tip:** Use `--no-content` for a faster scan if you only need the file structure.

### 3. Advanced Filtering Engine

Focus only on what matters. The powerful filtering engine lets you include or exclude files and folders based on names or extensions.

-   **What it does:** Provides whitelist and blacklist options for folders, files, and file extensions.
-   **Why it's useful:** Isolate specific parts of your application (e.g., only show source code), ignore noise (`node_modules`), or find all files of a certain type.

**Example 1: Ignore common clutter**
```bash
sugardd --blacklist node_modules,.git,dist,build
```

**Example 2: Show ONLY JavaScript and CSS files**
```bash
sugardd --whitelist-ext .js,.css
# or use the shorthand
sugardd -wle js,css
```

**Example 3: Show all source files but exclude test files**
```bash
sugardd -d ./src --blacklist-ext .test.js,.spec.js
# or use the shorthand
sugardd -d ./src -ble .test.js,.spec.js
```

### 4. Comprehensive Statistics

Get a high-level quantitative summary of your project with the `--stats` flag.

-   **What it does:** Calculates total files, directories, project size, file type distribution, largest file, and longest file.
-   **Why it's useful:** Perfect for code audits, tracking project growth, and identifying potentially problematic large files.

**Example:**
```bash
sugardd --stats --no-content
```

```bash
...
📊 Project Statistics
----------------------
📁 Directories: 15
📄 Total Files: 88
💾 Total Size: 2.35 MB
🐘 Largest File: banner.png (1.2 MB)
📝 Longest File: main.js (1502 lines)

🎨 File Types:
  - .js: 45
  - .json: 12
  - .md: 8
  - .css: 7
----------------------
```

### 5. Multiple Export Formats

Generate shareable reports and artifacts for documentation, code reviews, or programmatic use.

-   **What it does:** Saves the full analysis to a file in JSON, Markdown, HTML, or TXT format.
-   **Why it's useful:** Create permanent records, integrate with CI/CD pipelines, or host a static analysis report.

**Example:**
```bash
# Generate a detailed Markdown file for your repository
sugardd --stats --output PROJECT_REPORT.md

# Create a self-contained, viewable HTML report
sugardd --stats --output analysis.html

# Get a machine-readable JSON output
sugardd --no-content --format json --output manifest.json
```

### 6. Interactive Server Mode

Run `sugardd.js` as a lightweight REST API server to query project information on the fly.

-   **What it does:** Starts an Express server that provides project data via API endpoints.
-   **Why it's useful:** Allows other tools and scripts to programmatically access the file structure and stats without re-scanning the filesystem each time.

**Example:**
```bash
# Start the server on the default port 3000
sugardd --server

# Start on a custom port
sugardd -s -p 8080
```

**API Endpoint:**
-   `GET /scan`: Returns the full project structure and statistics as JSON.
    -   You can pass any CLI option as a query parameter!
    -   Example: `curl "http://localhost:3000/scan?whitelistExt=.js"`

## 🚀 Installation

```bash
npm install -g sugardd.js
```

## 📖 Usage & Examples

### Command-Line Options

| Option | Shorthand | Description | Default |
| --- | --- | --- | --- |
| `--directory <path>` | `-d` | Target directory to analyze. | `process.cwd()` |
| `--blacklist <folders>` | `-bl` | Comma-separated folders to exclude. | `node_modules,.git`|
| `--whitelist <folders>` | `-wl` | Comma-separated folders to include. | `null` |
| `--blacklist-files <files>` | `-bf` | Comma-separated files to exclude. | `.DS_Store` |
| `--whitelist-files <files>` | `-wf` | Comma-separated files to include. | `null` |
| `--whitelist-ext <exts>` | `-wle` | Only include files with these extensions. | `null` |
| `--blacklist-ext <exts>` | `-ble` | Exclude files with these extensions. | `null` |
| `--server` | `-s` | Run as an Express server. | `false` |
| `--port <number>` | `-p` | Server port. | `3000` |
| `--format <type>` | `-f` | Output format (`tree`, `json`, `detailed`). | `tree` |
| `--output <file>` | `-o` | Save output to a file (`.json`, `.md`, `.html`, `.txt`). | `null` |
| `--stats` | | Show comprehensive project statistics. | `false` |
| `--no-content` | | Exclude file content for a faster scan. | `false` |
| `--max-depth <depth>` | | Maximum directory depth to scan. | `10` |
| `--include-hidden` | | Include hidden files and folders (starting with `.`). | `false` |

### Practical Scenarios

**Scenario 1: Onboarding to a new JavaScript project**
You want to understand the structure of the source code and its dependencies.

```bash
sugardd -d ./new-project --wle js,json --bl node_modules,dist --stats
```
This command gives you a tree of only `.js` and `.json` files, ignores `node_modules`, and prints a statistical summary.

**Scenario 2: Generating project documentation**
You need to create a Markdown file that documents the entire project structure and statistics.

```bash
sugardd --stats --output docs/ProjectOverview.md
```
This creates a beautiful Markdown file, perfect for including in your repository's documentation.

**Scenario 3: Finding all configuration files**
You need to see the content of all `.json` and `.yaml` files.

```bash
sugardd --wle json,yaml,yml --no-stats
```

**Scenario 4: Creating a file manifest for a build process**
You need a JSON array of all source files to pass to a build tool.

```bash
sugardd -d ./src --format json --no-content --output manifest.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/cloud-dark/sugardd.js/issues).

## 📄 License

This project is [MIT](https://github.com/cloud-dark/sugardd.js/blob/main/LICENSE) licensed.