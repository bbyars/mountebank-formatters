import terser from '@rollup/plugin-terser';

const outputOptions = {
    exports: 'named',
    preserveModules: true,
    // Ensures that CJS default exports are imported properly (based on __esModule)
    // If needed, can switch to 'compat' which checks for .default prop on the default export instead
    // see https://rollupjs.org/configuration-options/#output-interop
    interop: 'auto',
    banner: `/*
 * mountebank-formatters
 * {@link https://github.com/bbyars/mountebank-formatters}
 * @copyright mountebank
 * @license MIT
 */`,
};

const config = {
    input: 'src/index.js',
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            ...outputOptions,
        },
        {
            dir: 'dist/cjs',
            format: 'cjs',
            ...outputOptions,
        },
    ],
    plugins: [
        terser(),
    ]
};

export default config;
