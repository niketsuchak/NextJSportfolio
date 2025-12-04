const fs = require('fs');
const path = require('path');
const glob = require('globby');

async function fixContentlayerImports() {
  try {
    const contentlayerDir = path.join(process.cwd(), '.contentlayer', 'generated');

    if (!fs.existsSync(contentlayerDir)) {
      console.log('Contentlayer generated directory not found, skipping fix...');
      return;
    }

    // Find all .mjs and .js files in the generated directory
    const files = await glob(['**/*.{mjs,js}'], {
      cwd: contentlayerDir,
      absolute: true,
    });

    let fixedCount = 0;

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content;

      // Check if file has import assertions/attributes
      const importAssertionRegex =
        /import\s+(\w+)\s+from\s+['"]([^'"]+\.json)['"]\s+(?:assert|with)\s*{\s*type:\s*['"]json['"]\s*}/g;

      if (!importAssertionRegex.test(content)) {
        continue; // No imports to fix
      }

      // Reset regex
      importAssertionRegex.lastIndex = 0;

      // Collect all imports that need to be fixed
      const importsToFix = [];
      let match;
      while ((match = importAssertionRegex.exec(content)) !== null) {
        importsToFix.push({
          fullMatch: match[0],
          importName: match[1],
          jsonPath: match[2],
        });
      }

      if (importsToFix.length === 0) {
        continue;
      }

      // Remove any existing createRequire imports
      let newContent = content.replace(
        /import\s*{\s*createRequire\s*}\s*from\s*['"]module['"];?\s*\n?/g,
        ''
      );
      newContent = newContent.replace(/const\s+require\s*=\s*createRequire\([^)]*\);?\s*\n?/g, '');

      // Replace each import with direct import statement (without assert)
      for (const { fullMatch, importName, jsonPath } of importsToFix) {
        newContent = newContent.replace(fullMatch, `import ${importName} from '${jsonPath}'`);
      }

      // Also fix any existing require statements
      newContent = newContent.replace(
        /const\s+(\w+)\s*=\s*require\(['"]([^'"]+\.json)['"]\)/g,
        "import $1 from '$2'"
      );

      // Fix existing import assertions
      newContent = newContent.replace(
        /import\s+(\w+)\s+from\s+(['"][^'"]+\.json['"])\s+assert\s*{[^}]*}/g,
        'import $1 from $2'
      );

      if (newContent !== originalContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        fixedCount++;
        console.log(`Fixed imports in: ${path.relative(process.cwd(), file)}`);
      }
    }

    if (fixedCount > 0) {
      console.log(`✓ Fixed ${fixedCount} file(s) with import assertion syntax`);
    } else {
      console.log('No files needed fixing');
    }
  } catch (error) {
    console.error('Error fixing Contentlayer imports:', error);
    process.exit(1);
  }
}

fixContentlayerImports();
