#!/usr/bin/env node

const { program } = require('commander');
const Sugardd = require('../src/sugardd');
const chalk = require('chalk');

console.log(chalk.hex('#FF69B4').bold('🍭 sugardd.js - Your Project\'s Sweetest Explorer'));
console.log(chalk.gray('Visualize your codebase with beautiful, structured diagrams.\n'));

program
  .name('sugardd')
  .description('A sweet and structured project explorer that visualizes your codebase.')
  .version('1.0.0')
  .option('-d, --directory <path>', 'target directory', process.cwd())
  .option('-bl, --blacklist <folders>', 'blacklist folders (comma separated)', 'node_modules,.git,dist,build')
  .option('-wl, --whitelist <folders>', 'whitelist folders (comma separated)')
  .option('-bf, --blacklist-files <files>', 'blacklist files (comma separated)', '.DS_Store,Thumbs.db')
  .option('-wf, --whitelist-files <files>', 'whitelist files (comma separated)')
  // --- TAMBAHKAN DUA BARIS DI BAWAH INI ---
  .option('-wle, --whitelist-ext <extensions>', 'whitelist file extensions (comma separated, e.g., .js,.ts)')
  .option('-ble, --blacklist-ext <extensions>', 'blacklist file extensions (comma separated, e.g., .log,.tmp)')
  // --- AKHIR TAMBAHAN ---
  .option('-s, --server', 'run as an express server')
  .option('-p, --port <number>', 'server port', '3000')
  .option('-f, --format <type>', 'output format (tree|json|detailed)', 'tree')
  .option('-o, --output <file>', 'save output to a file (supports .json, .md, .txt, .html)')
  .option('--max-size <size>', 'max file size to read (in KB)', '1000')
  .option('--max-depth <depth>', 'max directory depth', '10')
  .option('--no-content', 'exclude file content for faster scanning')
  .option('--include-hidden', 'include hidden files and folders')
  .option('--stats', 'show comprehensive project statistics')
  .parse();

const options = program.opts();

async function main() {
  try {
    const sugardd = new Sugardd(options);
    
    if (options.server) {
      console.log(chalk.blue('🌐 Starting sugardd.js Server...'));
      await sugardd.startServer();
    } else {
      console.log(chalk.green('🍬 Analyzing project structure...'));
      const result = await sugardd.scan();
      
      if (options.stats) {
        sugardd.displayStats(result);
      }
      
      if (options.output) {
        await sugardd.saveToFile(result, options.output);
      } else {
        sugardd.display(result);
      }
    }
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

main();