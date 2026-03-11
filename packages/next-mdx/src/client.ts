import { createElement, type ComponentType, type ReactElement, type ReactNode } from "react"
import {
  MDXRemote,
  type MDXRemoteProps,
  type MDXRemoteSerializeResult,
} from "next-mdx-remote"

interface HydrateProvider<
  TScope = Record<string, unknown>,
  TFrontmatter = Record<string, unknown>,
> {
  component: ComponentType<
    Record<string, unknown> & {
      children?: ReactNode
      components?: MDXRemoteProps<TScope, TFrontmatter>["components"]
    }
  >
  props?: Record<string, unknown>
}

export interface HydrateOptions<
  TScope = Record<string, unknown>,
  TFrontmatter = Record<string, unknown>,
> {
  components?: MDXRemoteProps<TScope, TFrontmatter>["components"]
  lazy?: boolean
  provider?: HydrateProvider<TScope, TFrontmatter>
}

export function useHydrate(
  content: { mdx: MDXRemoteSerializeResult },
  options?: HydrateOptions
): ReactElement {
  const hydratedContent = createElement(MDXRemote, {
    ...content.mdx,
    components: options?.components,
    lazy: options?.lazy,
  })

  if (!options?.provider) {
    return hydratedContent
  }

  const Provider = options.provider.component

  return createElement(
    Provider,
    {
      ...(options.provider.props ?? {}),
      components: options.components,
    },
    hydratedContent
  )
}
