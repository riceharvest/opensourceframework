import { promises as fs } from "fs"
import matter from "gray-matter"
import { sha256 } from "crypto-hash"
import { GetStaticPropsContext } from "next"
import type { ReactNode } from "react"
import { serialize } from "next-mdx-remote/serialize"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"

import { mdxCache } from "./get-cache"
import { getFiles, MdxFile } from "./get-files"
import { getConfig, getSourceConfig } from "./get-config"

export type NodeFrontMatter = Record<string, unknown>
type SerializeOptions = NonNullable<Parameters<typeof serialize>[1]>

export type NodeRelationships<T = Node> = {
  [key: string]: T[]
}

export interface Node<T = NodeFrontMatter, R = any> extends MdxFile, MdxFileData<T> {
  mdx: MDXRemoteSerializeResult
  relationships?: NodeRelationships<R>
}

export interface MdxNode<T = NodeFrontMatter, R = any> extends Node<T, R> {}

export interface MdxParams {
  components?: Record<string, ReactNode>
  scope?: Record<string, unknown>
  mdxOptions?: {
    remarkPlugins?: SerializeOptions["mdxOptions"] extends infer T
      ? T extends { remarkPlugins?: infer U }
        ? U
        : never
      : never
    rehypePlugins?: SerializeOptions["mdxOptions"] extends infer T
      ? T extends { rehypePlugins?: infer U }
        ? U
        : never
      : never
    format?: SerializeOptions["mdxOptions"] extends infer T
      ? T extends { format?: infer U }
        ? U
        : never
      : never
  }
  parseFrontmatter?: boolean
  blockJS?: boolean
  blockDangerousJS?: boolean
}

export interface getAllMdxNodesParams extends MdxParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface MdxFileData<T = NodeFrontMatter> {
  hash: string
  frontMatter: T
  content: string
}

export async function getMdxNode<T extends MdxNode = MdxNode>(
  sourceName: string,
  context: string | GetStaticPropsContext<NodeJS.Dict<string[]>>,
  params?: MdxParams
): Promise<T | null> {
  if (!context || (typeof context !== "string" && !context.params?.slug)) {
    throw new Error(`slug params missing from context`)
  }

  const node = await getNode<T>(sourceName, context)

  if (!node) return null

  return <T>{
    ...node,
    mdx: await renderNodeMdx(node, params),
  }
}

export async function getAllMdxNodes<T extends MdxNode = MdxNode>(
  sourceName: string,
  params?: getAllMdxNodesParams
): Promise<T[]> {
  const nodes = await getAllNodes<T>(sourceName)

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
  const { scope, mdxOptions, parseFrontmatter, blockJS, blockDangerousJS } =
    params ?? {}

  return await serialize(node.content, {
    mdxOptions,
    parseFrontmatter,
    blockJS,
    blockDangerousJS,
    scope: {
      ...scope,
      ...node.frontMatter,
    },
  })
}

export async function getNode<T extends Node = Node>(
  sourceName: string,
  context: string | GetStaticPropsContext<NodeJS.Dict<string[]>>
): Promise<T | null> {
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

  const node = await buildNodeFromFile<T>(file)

  return <T>{
    ...node,
    relationships: await getNodeRelationships(node),
  }
}

export async function getAllNodes<T extends Node = Node>(
  sourceName: string
): Promise<T[]> {
  const sourceConfig = await getSourceConfig(sourceName)
  const sortBy = sourceConfig?.sortBy || "date"
  const sortOrder = sourceConfig?.sortOrder || "desc"

  const files = await getFiles(sourceName)

  if (!files.length) return []

  const nodes = await Promise.all<T>(
    files.map(async (file) => {
      const node = await buildNodeFromFile<T>(file)

      return <T>{
        ...node,
        relationships: await getNodeRelationships(node),
      }
    })
  )

  const adjust = sortOrder === "desc" ? -1 : 1
  return <T[]>nodes.sort((a, b) => {
    const aValue = (a.frontMatter as any)[sortBy]
    const bValue = (b.frontMatter as any)[sortBy]
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
      frontmatter: fileData.frontMatter,
      scope: {},
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

    const valueAsArray = (Array.isArray(values) ? values : [values]).filter(
      (value): value is string => typeof value === "string"
    )

    if (!valueAsArray.length) continue

    const relatedNodes = await Promise.all(
      valueAsArray.map(async (value) => await getNode(key, value))
    )
    relationships[key] = relatedNodes.filter(
      (relatedNode): relatedNode is Node => relatedNode !== null
    )
  }

  return relationships
}
