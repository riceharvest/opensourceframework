import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const providersDir = path.join(root, "src/providers")
const distProvidersDir = path.join(root, "dist/providers")
const distProvidersCjsDir = path.join(root, "dist/providers-cjs")

function getProviderEntries() {
  return fs
    .readdirSync(providersDir, "utf8")
    .filter(
      (file) =>
        file !== "index.js" && file.endsWith(".js") && !file.includes("test"),
    )
    .map((file) => {
      const provider = fs.readFileSync(path.join(providersDir, file), "utf8")
      const match = provider.match(
        /export default function (?<functionName>.+)\s?\(/,
      )
      if (!match?.groups?.functionName) {
        throw new Error(`Unable to derive provider name from ${file}`)
      }

      return {
        basename: path.basename(file, ".js"),
        functionName: match.groups.functionName.trim(),
      }
    })
}

async function createProviderTypeStubs() {
  await fs.ensureDir(distProvidersDir)
  await fs.ensureDir(distProvidersCjsDir)

  for (const { basename, functionName } of getProviderEntries()) {
    const typeStub = [
      'import Providers from "../../types/providers"',
      "",
      `declare const provider: typeof Providers.${functionName}`,
      "",
      "export default provider",
      "",
    ].join("\n")

    fs.writeFileSync(path.join(distProvidersDir, `${basename}.d.ts`), typeStub)
    fs.writeFileSync(
      path.join(distProvidersCjsDir, `${basename}.cjs`),
      `module.exports = require("../providers/${basename}.js").default\n`,
    )
  }
}

await createProviderTypeStubs()
