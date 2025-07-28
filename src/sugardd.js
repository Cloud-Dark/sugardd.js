const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const mime = require('mime-types');

class Sugardd {
  constructor(options = {}) {
    // --- PERUBAHAN DI CONSTRUCTOR ---
    this.options = {
      directory: options.directory || process.cwd(),
      blacklistFolders: this.parseList(options.blacklist, false), // folder tidak perlu titik
      whitelistFolders: this.parseList(options.whitelist, false),
      blacklistFiles: this.parseList(options.blacklistFiles, false),
      whitelistFiles: this.parseList(options.whitelistFiles, false),
      // Menambahkan opsi baru untuk ekstensi
      whitelistExtensions: this.parseList(options.whitelistExt, true), // ekstensi perlu titik
      blacklistExtensions: this.parseList(options.blacklistExt, true),
      format: options.format || 'tree',
      output: options.output || null,
      maxSize: parseInt(options.maxSize) * 1024 || 1024000,
      maxDepth: parseInt(options.maxDepth) || 10,
      includeContent: options.content !== false,
      includeHidden: options.includeHidden || false,
      showStats: options.stats || false,
      port: parseInt(options.port) || 3000
    };
    // --- AKHIR PERUBAHAN ---
    
    this.stats = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
      fileTypes: {},
      largestFile: { name: '', size: 0 },
      longestFile: { name: '', lines: 0 }
    };
  }

  // --- PERUBAHAN DI parseList ---
  // Menambahkan argumen 'isExtension' untuk menangani titik secara otomatis
  parseList(listString, isExtension = false) {
    if (!listString) return [];
    return listString.split(',').map(item => {
      const trimmed = item.trim();
      if (isExtension && trimmed.length > 0 && !trimmed.startsWith('.')) {
        return `.${trimmed}`;
      }
      return trimmed;
    }).filter(Boolean);
  }
  // --- AKHIR PERUBAHAN ---

  async scan(targetDir = this.options.directory, currentDepth = 0) {
    if (currentDepth > this.options.maxDepth) return null;

    try {
      const stats = await fs.stat(targetDir);
      if (stats.isFile()) {
        return await this.processFile(targetDir);
      }
      if (stats.isDirectory()) {
        return await this.processDirectory(targetDir, currentDepth);
      }
    } catch (error) {
      return { name: path.basename(targetDir), type: 'error', error: error.message };
    }
  }

  async processFile(filePath) {
    const name = path.basename(filePath);

    // Pengecekan file dipindah ke atas agar lebih efisien
    if (!this.shouldIncludeFile(name)) return null;

    const stats = await fs.stat(filePath);
    const ext = path.extname(name);

    this.stats.totalFiles++;
    this.stats.totalSize += stats.size;
    const fileType = ext || 'no-extension';
    this.stats.fileTypes[fileType] = (this.stats.fileTypes[fileType] || 0) + 1;
    if (stats.size > this.stats.largestFile.size) {
      this.stats.largestFile = { name, size: stats.size };
    }

    const fileInfo = {
      name,
      type: 'file',
      path: path.relative(this.options.directory, filePath),
      size: stats.size,
      extension: ext,
      mimeType: mime.lookup(filePath) || 'unknown',
      modified: stats.mtime
    };

    if (this.options.includeContent && stats.size <= this.options.maxSize) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        fileInfo.content = content;
        fileInfo.lines = content.split('\n').length;
        if (fileInfo.lines > this.stats.longestFile.lines) {
          this.stats.longestFile = { name, lines: fileInfo.lines };
        }
      } catch (error) {
        fileInfo.content = '[File Biner atau tidak dapat dibaca]';
        fileInfo.isBinary = true;
      }
    } else if (stats.size > this.options.maxSize) {
      fileInfo.content = `[File terlalu besar: ${this.formatSize(stats.size)}]`;
    }

    return fileInfo;
  }

  async processDirectory(dirPath, currentDepth) {
    const name = path.basename(dirPath);
    if (!this.shouldIncludeDirectory(name)) return null;

    this.stats.totalDirectories++;

    const dirInfo = {
      name,
      type: 'directory',
      path: path.relative(this.options.directory, dirPath),
      children: []
    };

    try {
      const items = await fs.readdir(dirPath);
      for (const item of items) {
        if (!this.options.includeHidden && item.startsWith('.')) continue;

        const itemPath = path.join(dirPath, item);
        const childInfo = await this.scan(itemPath, currentDepth + 1);
        if (childInfo) dirInfo.children.push(childInfo);
      }

      // Filter direktori kosong setelah anak-anaknya difilter
      if (dirInfo.children.length === 0) {
        // Cek apakah direktori ini awalnya memiliki item, jika tidak, bisa jadi direktori kosong asli
        const originalItems = await fs.readdir(dirPath);
        if(originalItems.length > 0) return null;
      }

      dirInfo.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      dirInfo.error = error.message;
    }

    return dirInfo;
  }

  shouldIncludeDirectory(name) {
    if (this.options.whitelistFolders.length > 0) {
      return this.options.whitelistFolders.includes(name);
    }
    return !this.options.blacklistFolders.includes(name);
  }

  // --- PERUBAHAN SIGNIFIKAN DI shouldIncludeFile ---
  shouldIncludeFile(name) {
    const ext = path.extname(name);

    // Filter berdasarkan ekstensi
    if (this.options.whitelistExtensions.length > 0) {
      if (!this.options.whitelistExtensions.includes(ext)) {
        return false; // Ditolak karena ekstensi tidak ada di whitelist
      }
    } else if (this.options.blacklistExtensions.length > 0) {
      if (this.options.blacklistExtensions.includes(ext)) {
        return false; // Ditolak karena ekstensi ada di blacklist
      }
    }
    
    // Filter berdasarkan nama file (logika yang sudah ada)
    if (this.options.whitelistFiles.length > 0) {
      return this.options.whitelistFiles.some(pattern => 
        name.includes(pattern) || name.match(new RegExp(pattern))
      );
    }
    
    return !this.options.blacklistFiles.includes(name);
  }
  // --- AKHIR PERUBAHAN ---

  display(data) {
    const format = this.options.format;
    if (format === 'json') {
      console.log(JSON.stringify(data, null, 2));
    } else if (format === 'tree' || format === 'detailed') {
      console.log(this.generateTreeString(data, '', true, format === 'detailed'));
    } else {
      console.log(this.generateTreeString(data));
    }
  }

  displayStats() {
    console.log(chalk.hex('#FF69B4').bold('\n📊 Statistik Proyek'));
    console.log(chalk.gray('----------------------'));
    console.log(`${chalk.blue('📁 Direktori:')} ${this.stats.totalDirectories}`);
    console.log(`${chalk.green('📄 Total File:')} ${this.stats.totalFiles}`);
    console.log(`${chalk.yellow('💾 Ukuran Total:')} ${this.formatSize(this.stats.totalSize)}`);
    console.log(`${chalk.magenta('🐘 File Terbesar:')} ${this.stats.largestFile.name} (${this.formatSize(this.stats.largestFile.size)})`);
    if (this.stats.longestFile.lines > 0) {
        console.log(`${chalk.cyan('📝 File Terpanjang:')} ${this.stats.longestFile.name} (${this.stats.longestFile.lines} baris)`);
    }
    
    const fileTypes = Object.entries(this.stats.fileTypes)
      .sort(([,a],[,b]) => b-a)
      .slice(0, 10);

    if(fileTypes.length > 0) {
        console.log(chalk.blue('\n🎨 Tipe File:'));
        fileTypes.forEach(([type, count]) => {
            console.log(`  - ${chalk.yellow(type)}: ${count}`);
        });
    }
    console.log(chalk.gray('----------------------\n'));
  }

  formatSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateTreeString(node, prefix = '', isLast = true, detailed = false) {
    if (!node) return '';
    let line = prefix;
    if (prefix) {
      line += isLast ? '└── ' : '├── ';
    }
  
    if (node.type === 'directory') {
      line += chalk.blue.bold(`📁 ${node.name}`);
    } else if (node.type === 'file') {
      line += chalk.green(`📄 ${node.name}`);
      if (detailed) {
        line += chalk.gray(` (${this.formatSize(node.size)})`);
      }
    } else {
      line += chalk.red(`❌ ${node.name} (Error: ${node.error})`);
    }
    line += '\n';
  
    const contentPrefix = prefix + (isLast ? '    ' : '│   ');

    if (node.type === 'file' && node.content && this.options.includeContent) {
        if(node.isBinary) {
            line += `${contentPrefix}${chalk.gray('│ ')} ${chalk.italic.gray(node.content)}\n`;
        } else {
            const contentLines = node.content.split('\n');
            line += `${contentPrefix}${chalk.gray('┌' + '─'.repeat(50) + '┐')}\n`;
            contentLines.forEach(contentLine => {
                line += `${contentPrefix}${chalk.gray('│')} ${chalk.white(contentLine)}\n`;
            });
            line += `${contentPrefix}${chalk.gray('└' + '─'.repeat(50) + '┘')}\n`;
        }
    }

    if (node.type === 'directory' && node.children) {
      node.children.forEach((child, index) => {
        const isChildLast = index === node.children.length - 1;
        line += this.generateTreeString(child, contentPrefix, isChildLast, detailed);
      });
    }
    return line;
  }

  async saveToFile(data, outputPath) {
    const ext = path.extname(outputPath).toLowerCase();
    const outputDir = path.dirname(outputPath);
    
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {}

    let content;
    switch (ext) {
      case '.json': content = await this.generateJSON(data); break;
      case '.md': content = await this.generateMarkdown(data); break;
      case '.html': content = await this.generateHTML(data); break;
      case '.txt': content = await this.generateText(data); break;
      default:
        content = await this.generateJSON(data);
        outputPath += '.json';
    }

    try {
      await fs.writeFile(outputPath, content, 'utf8');
      console.log(chalk.green(`✅ Output disimpan ke: ${chalk.cyan(outputPath)}`));
    } catch (error) {
      console.error(chalk.red(`❌ Gagal menyimpan file: ${error.message}`));
      throw error;
    }
  }

  async generateJSON(data) {
    const output = {
      metadata: {
        service: 'sugardd.js',
        version: '1.0.0',
        description: 'A sweet and structured project explorer',
        scannedDirectory: this.options.directory,
        timestamp: new Date().toISOString(),
        options: this.options
      },
      statistics: this.stats,
      structure: data
    };
    return JSON.stringify(output, null, 2);
  }

  async generateText(data) {
    const detailed = this.options.format === 'detailed';
    let text = `🍭 Analisis Proyek: ${path.basename(this.options.directory)}\n`;
    text += `Dihasilkan oleh sugardd.js v1.0.0\n\n`;
    text += this.generateTreeString(data, '', true, detailed);
    return text;
  }

  async generateMarkdown(data) {
    let md = `# 🍭 Analisis Proyek: ${path.basename(this.options.directory)}\n\n`;
    md += `**Dihasilkan oleh sugardd.js** - Penjelajah proyek termanis Anda.\n\n`;
    md += `## 📊 Statistik Proyek\n\n`;
    md += `| Metrik | Nilai |\n|---|---|\n`;
    md += `| 📁 Direktori | ${this.stats.totalDirectories} |\n`;
    md += `| 📄 File | ${this.stats.totalFiles} |\n`;
    md += `| 💾 Ukuran Total | ${this.formatSize(this.stats.totalSize)} |\n`;
    md += `| 🐘 File Terbesar | ${this.stats.largestFile.name} (${this.formatSize(this.stats.largestFile.size)}) |\n`;
    if (this.stats.longestFile.lines > 0) {
      md += `| 📝 File Terpanjang | ${this.stats.longestFile.name} (${this.stats.longestFile.lines} baris) |\n`;
    }
    md += `\n## 🌳 Struktur Proyek\n\n\`\`\`\n${this.generateTreeString(data, '', true, false)}\n\`\`\`\n\n`;
    if (this.options.includeContent) {
      md += `## 📄 Isi File\n\n${await this.generateFileContentsMarkdown(data)}\n`;
    }
    md += `*Dihasilkan oleh sugardd.js v1.0.0*`;
    return md;
  }
  
  async generateFileContentsMarkdown(node, level = 3) {
      let md = '';
      if (node.type === 'file' && node.content && !node.isBinary) {
          md += `${'#'.repeat(level)} ${node.path}\n\n`;
          const ext = node.extension ? node.extension.substring(1) : 'text';
          md += `\`\`\`${ext}\n${node.content}\n\`\`\`\n\n`;
      }
      if (node.type === 'directory' && node.children) {
          for (const child of node.children) {
              md += await this.generateFileContentsMarkdown(child, level + 1);
          }
      }
      return md;
  }

  async generateHTML(data) {
    const title = `Analisis Proyek - ${path.basename(this.options.directory)}`;
    const treeHTML = this.generateTreeHTML(data);
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 960px; margin: 2rem auto; padding: 2rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { text-align: center; border-bottom: 1px solid #e9ecef; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
        .header h1 { color: #d63384; margin: 0; }
        .header .subtitle { color: #6c757d; font-size: 1.1rem; }
        .section { margin-bottom: 2rem; }
        .section h2 { border-bottom: 2px solid #d63384; padding-bottom: 0.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .stat-item { background: #f8f9fa; padding: 1rem; border-radius: 5px; }
        .stat-item strong { display: block; color: #495057; }
        .tree-container { background: #1e1e1e; color: #d4d4d4; padding: 1.5rem; border-radius: 5px; overflow-x: auto; font-family: "Fira Code", "Consolas", monospace; }
        .tree ul { padding-left: 20px; list-style-type: none; }
        .tree li { position: relative; }
        .footer { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e9ecef; font-size: 0.9rem; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍭 ${title}</h1>
            <p class="subtitle">Dihasilkan oleh sugardd.js - Penjelajah proyek termanis Anda</p>
        </div>
        <div class="section">
            <h2>📊 Statistik Proyek</h2>
            <div class="stats-grid">
                <div class="stat-item"><strong>Direktori</strong> ${this.stats.totalDirectories}</div>
                <div class="stat-item"><strong>Total File</strong> ${this.stats.totalFiles}</div>
                <div class="stat-item"><strong>Ukuran Total</strong> ${this.formatSize(this.stats.totalSize)}</div>
                <div class="stat-item"><strong>File Terbesar</strong> ${this.stats.largestFile.name} (${this.formatSize(this.stats.largestFile.size)})</div>
            </div>
        </div>
        <div class="section">
            <h2>🌳 Struktur Proyek</h2>
            <div class="tree-container">
                <div class="tree">${treeHTML}</div>
            </div>
        </div>
        <div class="footer">
            <p>Dihasilkan oleh <strong>sugardd.js v1.0.0</strong></p>
        </div>
    </div>
</body>
</html>`;
  }

  generateTreeHTML(node) {
      if (!node) return '';
      let html = '<ul>';
      const icon = node.type === 'directory' ? '📁' : '📄';
      html += `<li>${icon} ${node.name}`;
      if (node.type === 'directory' && node.children && node.children.length > 0) {
          node.children.forEach(child => {
              html += this.generateTreeHTML(child);
          });
      }
      html += '</li></ul>';
      return html;
  }
  
  async startServer() {
    const app = express();
    app.use(cors());
    app.get('/', (req, res) => {
      res.json({
        service: 'sugardd.js',
        description: 'A sweet and structured project explorer.',
        version: '1.0.0',
      });
    });

    app.get('/scan', async (req, res) => {
        try {
            // Re-create instance to handle new query params per request
            const requestOptions = { ...this.options, ...req.query };
            const scanner = new Sugardd(requestOptions);
            const data = await scanner.scan();
            res.json({
                statistics: scanner.stats,
                structure: data
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to scan directory', details: error.message });
        }
    });

    app.listen(this.options.port, () => {
      console.log(chalk.hex('#FF69B4').bold(`\n🍭 server sugardd.js sedang berjalan!`));
      console.log(chalk.green(`🌐 Server: http://localhost:${this.options.port}`));
      console.log(chalk.cyan(`API Endpoint: http://localhost:${this.options.port}/scan`));
    });
  }
}

module.exports = Sugardd;