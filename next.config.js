const { withContentlayer } = require('next-contentlayer');
const fs = require('fs');
const path = require('path');
const glob = require('globby');

// Plugin to fix Contentlayer generated files with import assertion syntax
function fixContentlayerImportsPlugin() {
  return {
    name: 'fix-contentlayer-imports',
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tapAsync(
        'fix-contentlayer-imports',
        async (params, callback) => {
          try {
            const contentlayerDir = path.join(process.cwd(), '.contentlayer', 'generated');

            if (fs.existsSync(contentlayerDir)) {
              const files = await glob(['**/*.{mjs,js}'], {
                cwd: contentlayerDir,
                absolute: true,
              });

              for (const file of files) {
                let content = fs.readFileSync(file, 'utf8');
                const originalContent = content;

                // Check if file has import assertions/attributes
                const importAssertionRegex =
                  /import\s+(\w+)\s+from\s+['"]([^'"]+\.json)['"]\s+(?:assert|with)\s*{\s*type:\s*['"]json['"]\s*}/g;

                if (!importAssertionRegex.test(content)) {
                  continue;
                }

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
                content = content.replace(
                  /import\s*{\s*createRequire\s*}\s*from\s*['"]module['"];?\s*\n?/g,
                  ''
                );
                content = content.replace(
                  /const\s+require\s*=\s*createRequire\([^)]*\);?\s*\n?/g,
                  ''
                );

                // Replace each import with direct import statement (without assert)
                for (const { fullMatch, importName, jsonPath } of importsToFix) {
                  content = content.replace(fullMatch, `import ${importName} from '${jsonPath}'`);
                }

                // Also fix any existing require statements
                content = content.replace(
                  /const\s+(\w+)\s*=\s*require\(['"]([^'"]+\.json)['"]\)/g,
                  "import $1 from '$2'"
                );

                // Fix existing import assertions
                content = content.replace(
                  /import\s+(\w+)\s+from\s+(['"][^'"]+\.json['"])\s+assert\s*{[^}]*}/g,
                  'import $1 from $2'
                );

                if (content !== originalContent) {
                  fs.writeFileSync(file, content, 'utf8');
                }
              }
            }
          } catch (error) {
            console.error('Error fixing Contentlayer imports:', error);
          }
          callback();
        }
      );
    },
  };
}

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = withContentlayer({
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['app', 'components', 'lib', 'layouts', 'scripts'],
  },
  swcMinify: true,
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Add the plugin to fix Contentlayer imports
    config.plugins.push(fixContentlayerImportsPlugin());

    // Enable import assertions for JSON modules
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });

    return config;
  },
});
