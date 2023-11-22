import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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

const dir = 'dist'

const config = [{
    input: 'src/index.js',
    output: [
        {
            file: `${dir}/index.cjs`,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: `${dir}/index.min.cjs`,
            format: 'cjs',
            sourcemap: true,
            plugins: [terser()],
        },
        {
            file: `${dir}/index.js`,
            format: 'esm',
            sourcemap: true,
        },
        {
            file: `${dir}/index.min.js`,
            format: 'esm',
            sourcemap: true,
            plugins: [terser()],
        },
    ],
    plugins: [
        nodeResolve(),
    ],
    external: ['ejs'],
    treeshake: true,
},{
    input: './types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
},];

export default config;
