import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// 打包成单个 HTML 文件，双击即可离线打开（方便拷到平板/手机/电脑上用）
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  server: { host: true },
});
