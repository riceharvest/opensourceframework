import { defineConfig } from "tsup"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const preserveClientDirectivePlugin = {
  name: "preserve-client-directive",
  renderChunk(code, chunkInfo) {
    let nextCode = code.replace(/\/\/# sourceMappingURL=[^\n]+\.map/g, "")
    const outputPath = chunkInfo.path.replace(/\\/g, "/")

    if (
      outputPath.endsWith("/client/index.js") ||
      outputPath.endsWith("/client/index.mjs")
    ) {
      return {
        code: `"use client";\n${nextCode}`,
        map: null,
      }
    }

    if (nextCode !== code) {
      return {
        code: nextCode,
        map: null,
      }
    }
  },
}

async function _buildProvidersIndex() {
  const providersDir = path.join(__dirname, "src/providers")

  const files = fs
    .readdirSync(providersDir, "utf8")
    .filter((file) => file !== "index.js" && file.endsWith(".js"))

  let importLines = ""
  let exportLines = "export default {\n"
  files.forEach((file) => {
    const provider = fs.readFileSync(path.join(providersDir, file), "utf8")
    try {
      const { functionName } = provider.match(
        /export default function (?<functionName>.+)\s?\(/,
      ).groups

      importLines += `import ${functionName} from "./${file}"\n`
      exportLines += `  ${functionName},\n`
    } catch (error) {
      console.error(`Error processing provider file '${file}':`, error.message)
    }
  })
  exportLines += "}\n"

  fs.writeFileSync(
    path.join(__dirname, "src/providers/index.js"),
    [importLines, exportLines].join("\n"),
  )
  console.log("[build] generated providers/index.js")
}

async function _createModuleEntries() {
  const entries = {
    "index.js": 'module.exports = require("./dist/server").default\n',
    "client.js": 'module.exports = require("./dist/client").default\n',
    "adapters.js": 'module.exports = require("./dist/adapters").default\n',
    "providers.js": 'module.exports = require("./dist/providers").default\n',
    "jwt.js": 'module.exports = require("./dist/lib/jwt").default\n',
    "errors.js": 'module.exports = require("./dist/lib/errors").default\n',
  }

  Object.entries(entries).forEach(([target, content]) => {
    fs.writeFileSync(path.join(__dirname, target), content)
    console.log(`[build] created "${target}" in root folder`)
  })
}

export default defineConfig({
  entry: {
    "server/index": "src/server/index.js",
    "lib/jwt": "src/lib/jwt.js",
    "lib/errors": "src/lib/errors.js",
    "lib/logger": "src/lib/logger.js",
    "lib/parse-url": "src/lib/parse-url.js",
    "adapters/index": "src/adapters/index.js",
    "adapters/prisma": "src/adapters/prisma.js",
    "adapters/typeorm": "src/adapters/typeorm.js",
    "client/index": "src/client/index.js",
    "providers/index": "src/providers/index.js",
  },
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  silent: true,
  plugins: [preserveClientDirectivePlugin],
  loader: {
    ".js": "jsx",
  },
  jsx: "automatic",
  external: [
    "react",
    "react-dom",
    "next",
    "next-auth",
    "jose",
    "futoin-hkdf",
    "jsonwebtoken",
    "nodemailer",
    "oauth",
    "pkce-challenge",
    "preact",
    "preact-render-to-string",
    "querystring",
    "typeorm",
    "mongodb",
  ],
  ignoreAnnotations: true,
  treeshake: false,
})
