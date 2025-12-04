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

      // Replace assert { type: 'json' } with with { type: 'json' }
      content = content.replace(
        /assert\s*{\s*type:\s*['"]json['"]\s*}/g,
        "with { type: 'json' }"
      );

      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
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

