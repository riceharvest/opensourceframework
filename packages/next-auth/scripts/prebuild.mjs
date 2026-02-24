import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

async function buildProvidersIndex() {
  const providersDir = path.join(root, "src/providers")

  const files = fs
    .readdirSync(providersDir, "utf8")
    .filter((file) => file !== "index.js" && file.endsWith(".js") && !file.includes("test"))

  let importLines = ""
  let exportLines = "export default {\n"
  files.forEach((file) => {
    const provider = fs.readFileSync(path.join(providersDir, file), "utf8")
    try {
      const match = provider.match(/export default function (?<functionName>.+)\s?\(/)
      if (match) {
        const functionName = match[1].trim()
        importLines += `import ${functionName} from "./${file}"\n`
        exportLines += `  ${functionName},\n`
      }
    } catch (error) {
      console.error(`Error processing provider file '${file}':`, error.message)
    }
  })
  exportLines += "}\n"

  fs.writeFileSync(
    path.join(root, "src/providers/index.js"),
    [importLines, exportLines].join("\n"),
  )
  console.log("[build] generated providers/index.js")
}

async function createModuleEntries() {
  const entries = {
    "index.js": 'module.exports = require("./dist/server").default\n',
    "client.js": 'module.exports = require("./dist/client").default\n',
    "adapters.js": 'module.exports = require("./dist/adapters").default\n',
    "providers.js": 'module.exports = require("./dist/providers").default\n',
    "jwt.js": 'module.exports = require("./dist/lib/jwt").default\n',
    "errors.js": 'module.exports = require("./dist/lib/errors").default\n',
  }

  Object.entries(entries).forEach(([target, content]) => {
    fs.writeFileSync(path.join(root, target), content)
    console.log(`[build] created "${target}" in root folder`)
  })
}

(async () => {
  await buildProvidersIndex()
  await createModuleEntries()
})()
