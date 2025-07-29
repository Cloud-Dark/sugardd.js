# Complete sugardd.js Documentation

Welcome to the comprehensive guide for `sugardd.js`. Here you'll find everything you need to know, from basic features to advanced usage scenarios.

## Table of Contents

  - [Why sugardd.js?](https://www.google.com/search?q=%23why-sugarddjs)
  - [✨ Full Features](https://www.google.com/search?q=%23-full-features)
      - [1. Intuitive Project Tree View](https://www.google.com/search?q=%231-intuitive-project-tree-view)
      - [2. Inline File Content Display](https://www.google.com/search?q=%232-inline-file-content-display)
      - [3. Powerful Filtering Engine](https://www.google.com/search?q=%233-powerful-filtering-engine)
      - [4. Comprehensive Statistics](https://www.google.com/search?q=%234-comprehensive-statistics)
      - [5. Various Export Formats](https://www.google.com/search?q=%235-various-export-formats)
      - [6. Interactive Server Mode](https://www.google.com/search?q=%236-interactive-server-mode)
  - [📖 Usage & Examples](https://www.google.com/search?q=%23-usage--examples)
      - [Command-Line Interface (CLI) Options](https://www.google.com/search?q=%23command-line-interface-cli-options)
      - [Practical Scenarios](https://www.google.com/search?q=%23practical-scenarios)

-----

## Why sugardd.js?

Whether you're starting a new project, preparing for a code review, or generating documentation, `sugardd.js` gives you a complete overview in seconds. It eliminates the need to manually navigate through folders and provides a high-level, analyzable summary of your entire codebase.

-----

## ✨ Full Features

### 1\. Intuitive Project Tree View

Visualize your entire project structure in a clean, colorful, and easy-to-understand tree format directly in your terminal.

  - **Functionality:** Displays directories and files in a nested hierarchy.
  - **Benefits:** Quickly grasp the project layout without opening a file explorer or IDE.
  - **Customization:** Adjust display depth, filter by file extension, or focus on specific directories.
  - **Short Aliases:** Use `-d` for directory, `-bl` for blacklist, `-wl` for whitelist, and more.

**Example:**

```bash
sugardd
```

return

```bash
🍬 Analyzing project structure...
📁 my-cool-project
    ├── 📁 src
    │   └── 📄 index.js
    ├── 📄 package.json
    └── 📄 README.md
```

### 2\. Inline File Content Display

More than just structure. `sugardd.js` can directly display your file content within the tree view, giving you instant context.

  - **Functionality:** Prints text-based file content directly below its name.
  - **Benefits:** Read configuration files, check small utility scripts, or review documentation without ever leaving your terminal.

**Example (this is the default behavior):**

```bash
sugardd
```

return

```bash
...
├── 📄 package.json
│   ┌──────────────────────────────────────────────────┐
│   │ {
│   │   "name": "my-cool-project",
│   │   "version": "1.0.0"
│   │ }
│   └──────────────────────────────────────────────────┘
└── 📄 README.md
    ┌──────────────────────────────────────────────────┐
    │ # My Cool Project
    │
    │ Welcome to the readme!
    └──────────────────────────────────────────────────┘
```

> **Tip:** Use `--no-content` for a faster scan if you only need the file structure.

### 3\. Powerful Filtering Engine

Focus only on what matters. The robust filtering engine allows you to include or exclude files and folders based on name or extension.

  - **Functionality:** Provides `whitelist` and `blacklist` options for folders, files, and file extensions.
  - **Benefits:** Isolate specific parts of your application (e.g., only show source code), ignore irrelevant directories (`node_modules`), or find all files of a certain type.

**Example 1: Ignoring common folders**

```bash
sugardd --blacklist node_modules,.git,dist,build
```

**Example 2: Displaying ONLY JavaScript and CSS files**

```bash
sugardd --whitelist-ext .js,.css
# or use its short alias
sugardd -wle js,css
```

**Example 3: Displaying all source files but excluding test files**

```bash
sugardd -d ./src --blacklist-ext .test.js,.spec.js
# or use its short alias
sugardd -d ./src -ble .test.js,.spec.js
```

### 4\. Comprehensive Statistics

Get a high-level quantitative summary of your project with the `--stats` flag.

  - **Functionality:** Counts total files, directories, project size, file type distribution, largest files, and longest files.
  - **Benefits:** Perfect for code audits, tracking project growth, and identifying potentially problematic large files.

**Example:**

```bash
sugardd --stats --no-content
```

return

```bash
...
🍭 sugardd.js - Your Project's Sweetest Explorer
Visualize your codebase with beautiful, structured diagrams.

🍬 Analyzing project structure...

📊 Project Statistics
----------------------
📁 Directories: 4
📄 Total Files: 6
💾 Total Size: 65.17 KB
🐘 Largest File: package-lock.json (33.48 KB)

🎨 File Types:
  - .js: 2
  - .md: 2
  - .json: 2
----------------------

📁 sugardd.js
    ├── 📁 bin
    │   └── 📄 main.js
    ├── 📁 docs
    │   └── 📄 id.md
    ├── 📁 src
    │   └── 📄 sugardd.js
    ├── 📄 package-lock.json
    ├── 📄 package.json
    └── 📄 README.md
```

### 5\. Various Export Formats

Generate shareable reports and artifacts for documentation, code reviews, or programmatic use.

  - **Functionality:** Saves the complete analysis to a file in JSON, Markdown, HTML, or TXT format.
  - **Benefits:** Create permanent records, integrate with CI/CD pipelines, or host static analysis reports.

**Example:**

```bash
# Generate a detailed Markdown file for your repository
sugardd --stats --output PROJECT_REPORT.md

# Create a self-contained, viewable HTML report
sugardd --stats --output analysis.html

# Get machine-readable JSON output
sugardd --no-content --format json --output manifest.json
```

### 6\. Interactive Server Mode

Run `sugardd.js` as a lightweight REST API server to dynamically query project information.

  - **Functionality:** Starts an Express server that provides project data via API endpoints.
  - **Benefits:** Allows other tools and scripts to programmatically access file structure and statistics without re-scanning the file system every time.

**Example:**

```bash
# Start the server on the default port 3000
sugardd --server

# Run on a custom port
sugardd -s -p 8080
```

**API Endpoints:**

  - `GET /scan`: Returns the entire project structure and statistics as JSON.
      - You can pass any CLI option as a query parameter\!
      - Example: `curl "http://localhost:3000/scan?whitelistExt=.js"`

-----

## 📖 Usage & Examples

### Command-Line Interface (CLI) Options

| Option | Alias | Description | Default |
| --- | --- | --- | --- |
| `--directory <path>` | `-d` | Target directory to analyze. | Current directory |
| `--blacklist <folders>` | `-bl` | Folders to exclude (comma-separated). | `node_modules,.git`|
| `--whitelist <folders>` | `-wl` | Only these folders will be included. | `null` |
| `--blacklist-files <files>`| `-bf` | Files to exclude (comma-separated). | `.DS_Store` |
| `--whitelist-files <files>`| `-wf` | Only these files will be included. | `null` |
| `--whitelist-ext <exts>` | `-wle` | Only include files with these extensions. | `null` |
| `--blacklist-ext <exts>` | `-ble` | Exclude files with these extensions. | `null` |
| `--server` | `-s` | Run as an Express server. | `false` |
| `--port <number>` | `-p` | Port for the server. | `3000` |
| `--format <type>` | `-f` | Output format (`tree`, `json`, `detailed`). | `tree` |
| `--output <file>` | `-o` | Save output to a file (`.json`, `.md`, `.html`, `.txt`).| `null` |
| `--stats` | | Display comprehensive project statistics. | `false` |
| `--no-content` | | Omit file content for faster scans. | `false` |
| `--max-depth <depth>` | | Maximum directory depth to scan. | `10` |
| `--include-hidden` | | Include hidden files and folders (prefixed with `.`). | `false` |

### Practical Scenarios

**Scenario 1: Starting a New JavaScript Project**
You want to understand the structure of the source code and its dependencies.

```bash
sugardd -d ./new-project --wle js,json --bl node_modules,dist --stats
```

This command gives you a tree of only `.js` and `.json` files, ignores `node_modules`, and prints a statistical summary.

**Scenario 2: Creating Project Documentation**
You need to generate a Markdown file documenting the entire project structure and statistics.

```bash
sugardd --stats --output docs/ProjectOverview.md
```

This will create a beautiful Markdown file, perfect for including in your repository documentation.

**Scenario 3: Finding All Configuration Files**
You need to view the content of all `.json` and `.yaml` files.

```bash
sugardd --wle json,yaml,yml --no-stats
```

**Scenario 4: Creating a File Manifest for Build Processes**
You need a JSON array of all source files to pass to a build tool.

```bash
sugardd -d ./src --format json --no-content --output manifest.json
```