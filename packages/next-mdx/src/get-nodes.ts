import { promises as fs } from "fs"
import matter from "gray-matter"
import { sha256 } from "crypto-hash"
import { GetStaticPropsContext } from "next"
import { Pluggable } from "unified"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemoteSerializeResult } from "next-mdx-remote"

import { mdxCache } from "./get-cache"
import { getFiles, MdxFile } from "./get-files"
import { getConfig, getSourceConfig } from "./get-config"

export type NodeFrontMatter = Record<string, unknown>

// TODO: Properly type node relationships with generics.
export interface NodeRelationships<T = Node> {
  [key: string]: T[]
}

export interface Node<T = NodeFrontMatter> extends MdxFile, MdxFileData<T> {
  mdx: MDXRemoteSerializeResult
  relationships?: NodeRelationships
}

// type MdxNodeWithoutMdx<T extends Node> = Omit<T, "mdx">

export interface MdxNode<T = NodeFrontMatter> extends Node<T> {}

export interface MdxParams {
  components?: Record<string, React.ReactNode>
  scope?: Record<string, unknown>
  mdxOptions?: {
    remarkPlugins?: Pluggable[]
    rehypePlugins?: Pluggable[]
    format?: 'mdx' | 'md'
  }
  parseFrontmatter?: boolean
}

export interface getAllMdxNodesParams extends MdxParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface MdxFileData<T = NodeFrontMatter> {
  hash: string
  frontMatter?: T
  content?: string
}

export async function getMdxNode<T extends MdxNode>(
  sourceName: string,
  context: string | GetStaticPropsContext<NodeJS.Dict<string[]>>,
  params?: MdxParams
): Promise<T> {
  if (!context || (typeof context !== "string" && !context.params?.slug)) {
    throw new Error(`slug params missing from context`)
  }

  const node = await getNode(sourceName, context)

  if (!node) return null

  return <T>{
    ...node,
    mdx: await renderNodeMdx(node, params),
  }
}

export async function getAllMdxNodes<T extends MdxNode>(
  sourceName: string,
  params?: getAllMdxNodesParams
): Promise<T[]> {
  const nodes = await getAllNodes(sourceName)

  if (!nodes.length) return []

  return Promise.all<T>(
    nodes.map(
      async (node) =>
        <T>{
          ...node,
          mdx: await renderNodeMdx(node, params),
        }
    )
  )
}

async function renderNodeMdx(node: Node, params?: MdxParams) {
  return await serialize(node.content, {
    ...params,
    scope: {
      ...params?.scope,
      ...node.frontMatter,
    },
  })
}

export async function getNode<T extends Node>(
  sourceName: string,
  context: string | GetStaticPropsContext<NodeJS.Dict<string[]>>
): Promise<T> {
  const files = await getFiles(sourceName)

  if (!files.length) return null

  const slug =
    typeof context === "string"
      ? context
      : context.params?.slug
      ? context.params.slug.join("/")
      : ""

  const [file] = files.filter((file) => file.slug === slug)

  if (!file) return null

  const node = await buildNodeFromFile(file)

  return <T>{
    ...node,
    relationships: await getNodeRelationships(node),
  }
}

export async function getAllNodes<T extends Node>(
  sourceName: string
): Promise<T[]> {
  const sourceConfig = await getSourceConfig(sourceName)
  const sortBy = sourceConfig?.sortBy || "date"
  const sortOrder = sourceConfig?.sortOrder || "desc"

  const files = await getFiles(sourceName)

  if (!files.length) return []

  const nodes = await Promise.all<T>(
    files.map(async (file) => {
      const node = await buildNodeFromFile(file)

      return <T>{
        ...node,
        relationships: await getNodeRelationships(node),
      }
    })
  )

  const adjust = sortOrder === "desc" ? -1 : 1
  return <T[]>nodes.sort((a, b) => {
    const aValue = a.frontMatter[sortBy]
    const bValue = b.frontMatter[sortBy]
    if (aValue < bValue) {
      return -1 * adjust
    }
    if (aValue > bValue) {
      return 1 * adjust
    }
    return 0
  })
}

async function buildNodeFromFile<T extends Node>(file: MdxFile): Promise<T> {
  const fileData = await getFileData(file)
  return <T>{
    ...file,
    ...fileData,
    mdx: {
      compiledSource: "",
    },
  }
}

export async function getFileData(file: MdxFile): Promise<MdxFileData> {
  const raw = await fs.readFile(file.filepath, "utf-8")
  const hash = await sha256(raw)

  const cachedContent = mdxCache.get<MdxFileData>(hash)
  if (cachedContent?.hash === hash) {
    // console.info(`HIT for ${file.slug}`)
    return cachedContent
  }

  // console.info(`MISS for ${file.slug}`)

  const { content, data: frontMatter } = matter(raw)

  const fileData: MdxFileData = {
    hash,
    content,
    frontMatter,
  }

  mdxCache.set<MdxFileData>(hash, fileData)

  return fileData
}

async function getNodeRelationships(node: Node): Promise<NodeRelationships> {
  const relationships: NodeRelationships = {}
  const config = await getConfig()

  for (const key of Object.keys(node.frontMatter)) {
    if (!config[key]) continue

    const values = node.frontMatter[key]

    if (!values) continue

    const valueAsArray: string[] = Array.isArray(values) ? values : [values]
    relationships[key] = await Promise.all(
      valueAsArray.map(async (value) => await getNode(key, value))
    )
  }

  return relationships
}
