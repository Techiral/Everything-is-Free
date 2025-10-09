/**
 * Link Validator Script
 * Checks Markdown files for broken links using markdown-link-check
 *
 * Usage:
 *   node scripts/link-validator.js [optional/path]
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const targetPath = process.argv[2] ?? '.';

function getMarkdownFiles(dirPath, arrayOfFiles = []) {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getMarkdownFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function runLinkCheck(file) {
  console.log(`🔍 Checking links in ${file}`);
  try {
    childProcess.execSync(`npx markdown-link-check "${file}" --quiet`, {
      stdio: 'inherit',
    });
    console.log(`✅ No broken links in ${file}\n`);
  } catch (error) {
    console.error(`❌ Issues found in ${file}`);
    process.exitCode = 1;
  }
}

const markdownFiles = getMarkdownFiles(targetPath);

if (markdownFiles.length === 0) {
  console.log('No Markdown files found to check.');
  process.exit(0);
}

markdownFiles.forEach(runLinkCheck);