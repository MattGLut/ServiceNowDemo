import { servicenowFrontEndPlugins, sass, rollup, glob } from '@servicenow/isomorphic-rollup'

/**
 * Prebuild script for building the client assets of the application before running the rest of the build.
 * Export an async function that accepts useful modules for building the application as arguments.
 * This function returns a Promise that resolves when the build is complete.
 * You can also export an array of functions if you want to run multiple prebuild steps.
 */
export default async ({ rootDir, config, fs, path, logger, registerExplicitId }) => {
    // This is where all the client source files are located
    const clientDir = path.join(rootDir, config.clientDir)
    // Check to make sure we have something to build before we start
    const htmlFilePattern = path.join(clientDir, '**', '*.html')
    const htmlFiles = await glob(htmlFilePattern, { fs })
    if (!htmlFiles.length) {
        logger.warn(`No HTML files found in ${clientDir}, skipping UI build.`)
        return
    }

    // This is the destination for the build output
    const staticContentDir = path.join(rootDir, config.staticContentDir)
    // Clean up any previous build output
    fs.rmSync(staticContentDir, { recursive: true, force: true })

    const snPlugins = await servicenowFrontEndPlugins({
        scope: config.scope,
        rootDir: clientDir,
        projectRootDir: rootDir,
        registerExplicitId,
        editableSourceCodeOnInstance: true,
    })

    // Tailwind output exceeds the default 14KB extract threshold and would be deployed
    // as a separate sys_ux_theme_asset loaded via /uxta/..., which often fails to
    // apply on UI pages. Inline CSS into the bundle instead.
    const plugins = snPlugins.flat().map((plugin) => {
        if (plugin?.name === 'rollup-plugin-sass') {
            return sass({
                insert: true,
                shouldExtract: () => false,
            })
        }
        return plugin
    })

    // Call the rollup build
    const rollupBundle = await rollup({
        fs,
        input: htmlFilePattern,
        plugins,
    })
    // Write the build output to the configured destination
    // including source maps for JavaScript files
    const rollupOutput = await rollupBundle.write({
        dir: staticContentDir,
        sourcemap: true,
    })
    // Print the build results
    rollupOutput.output.forEach((file) => {
        if (file.type === 'asset') {
            logger.info(`Bundled asset: ${file.fileName} (${file.source.length} bytes)`)
        } else if (file.type === 'chunk') {
            logger.info(`Bundled chunk: ${file.fileName} (${file.code.length} bytes)`)
        }
    })
}
