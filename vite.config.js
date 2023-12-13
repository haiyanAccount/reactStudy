// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { wrapperEnv } from "./src/utils/getEnv";
import { visualizer } from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";
import viteCompression from "vite-plugin-compression";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// @see: https://vitejs.dev/config/

export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  const viteEnv = wrapperEnv(env);

  return {
    base: "/reactMis/",
    // alias config
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    // global css
    css: {
      preprocessorOptions: {
        less: {
          // modifyVars: {
          // 	"primary-color": "#1DA57A",
          // },
          javascriptEnabled: true,
        },
      },
    },
    // server config
    server: {
      host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // https: false,
      // 代理跨域（mock 不需要配置，这里只是个事列）
      proxy: {
        "/live": {
          target: "https://t.merch.yishengzhan.cn/api/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/live/, ""),
        },
      },
    },
    // plugins
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: "react-xlt",
          },
        },
      }),
      // * 使用 svg 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      // * EsLint 报错信息显示在浏览器界面上
      // eslintPlugin(),
      // * 是否生成包预览
      viteEnv.VITE_REPORT && visualizer(),
      // * gzip compress
      viteEnv.VITE_BUILD_GZIP &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: "gzip",
          ext: ".gz",
        }),
    ],
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
    },
    // build configure
    build: {
      outDir: "dist",
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      minify: "esbuild",
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
