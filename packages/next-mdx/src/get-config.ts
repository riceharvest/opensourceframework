import { promises as fs, existsSync } from "fs"
import path from "path"
import { pathToFileURL } from "url"

const DEFAULT_CONFIG_PATH = "next-mdx.json"
const JS_CONFIG_PATH = "next-mdx.config.mjs"

export interface SourceConfig {
  contentPath: string
  basePath?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface Config {
  [key: string]: SourceConfig
}

export async function getConfig(): Promise<Config> {
  const cwd = process.cwd()
  const jsConfigPath = path.resolve(cwd, JS_CONFIG_PATH)
  const jsonConfigPath = path.resolve(cwd, DEFAULT_CONFIG_PATH)

  // Prefer JS config if it exists
  if (existsSync(jsConfigPath)) {
    try {
      const module = await import(pathToFileURL(jsConfigPath).href)
      return module.default || module
    } catch (error) {
      console.error(`Error loading ${JS_CONFIG_PATH}:`, error)
    }
  }

  // Fallback to JSON config
  if (existsSync(jsonConfigPath)) {
    try {
      const json = await fs.readFile(jsonConfigPath, "utf-8")
      return JSON.parse(json)
    } catch (error) {
      console.error(`Error loading ${DEFAULT_CONFIG_PATH}:`, error)
    }
  }

  return {}
}

export async function getSourceConfig(source: string): Promise<SourceConfig> {
  const config = await getConfig()

  if (!config || !config[source]) {
    throw new Error(`Type ${source} does not exist in next-mdx configuration`)
  }

  return {
    sortBy: "title",
    sortOrder: "asc",
    ...config[source],
  }
}
