const { withContentlayer } = require('next-contentlayer');
const fs = require('fs');
const path = require('path');
const glob = require('globby');

// Plugin to fix Contentlayer generated files with import assertion syntax
function fixContentlayerImportsPlugin() {
  return {
    name: 'fix-contentlayer-imports',
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tapAsync('fix-contentlayer-imports', async (params, callback) => {
        try {
          const contentlayerDir = path.join(process.cwd(), '.contentlayer', 'generated');
          
          if (fs.existsSync(contentlayerDir)) {
            const files = await glob(['**/*.{mjs,js}'], {
              cwd: contentlayerDir,
              absolute: true,
            });

            for (const file of files) {
              let content = fs.readFileSync(file, 'utf8');
              const fixedContent = content.replace(
                /assert\s*{\s*type:\s*['"]json['"]\s*}/g,
                "with { type: 'json' }"
              );

              if (content !== fixedContent) {
                fs.writeFileSync(file, fixedContent, 'utf8');
              }
            }
          }
        } catch (error) {
          console.error('Error fixing Contentlayer imports:', error);
        }
        callback();
      });
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
  webpack: (config, { isServer }) => {
    // Add the plugin to fix Contentlayer imports
    config.plugins.push(fixContentlayerImportsPlugin());
    return config;
  },
});
