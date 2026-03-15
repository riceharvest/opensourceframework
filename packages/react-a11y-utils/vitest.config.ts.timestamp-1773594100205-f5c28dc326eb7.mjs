// vitest.config.ts
import { defineConfig } from "file:///tmp/opensourceframework/node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.11_happy-dom@20.8.3_jsdom@24.1.3_lightningcss@1.31.1_msw@2.12._mr7logybcxtajgaadxxr22uuoi/node_modules/vitest/dist/config.js";
import react from "file:///tmp/opensourceframework/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@7.3.1_@types+node@22.19.11_jiti@2.6.1_lightningcss@1.31.1_ter_r5j3dlpiphf4igh2uatvlrekmy/node_modules/@vitejs/plugin-react/dist/index.js";
var vitest_config_default = defineConfig({
  // @ts-expect-error - vitest config mismatch
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "test/**/*.test.ts", "test/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.config.ts"
      ]
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi90bXAvb3BlbnNvdXJjZWZyYW1ld29yay9wYWNrYWdlcy9yZWFjdC1hMTF5LXV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvdG1wL29wZW5zb3VyY2VmcmFtZXdvcmsvcGFja2FnZXMvcmVhY3QtYTExeS11dGlscy92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy90bXAvb3BlbnNvdXJjZWZyYW1ld29yay9wYWNrYWdlcy9yZWFjdC1hMTF5LXV0aWxzL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgLSB2aXRlc3QgY29uZmlnIG1pc21hdGNoXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3Rlc3Qvc2V0dXAudHMnXSxcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRlc3QudHMnLCAnc3JjLyoqLyoudGVzdC50c3gnLCAndGVzdC8qKi8qLnRlc3QudHMnLCAndGVzdC8qKi8qLnRlc3QudHN4J10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ25vZGVfbW9kdWxlcy8nLFxuICAgICAgICAnZGlzdC8nLFxuICAgICAgICAnKiovKi5kLnRzJyxcbiAgICAgICAgJyoqLyoudGVzdC50cycsXG4gICAgICAgICcqKi8qLnRlc3QudHN4JyxcbiAgICAgICAgJyoqLyouY29uZmlnLnRzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VSxTQUFTLG9CQUFvQjtBQUN6VyxPQUFPLFdBQVc7QUFFbEIsSUFBTyx3QkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLGlCQUFpQjtBQUFBLElBQzlCLFNBQVMsQ0FBQyxvQkFBb0IscUJBQXFCLHFCQUFxQixvQkFBb0I7QUFBQSxJQUM1RixVQUFVO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVLENBQUMsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUNqQyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
