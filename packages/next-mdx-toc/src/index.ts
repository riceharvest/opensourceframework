import remark from 'remark';
import toc from 'mdast-util-toc';
import type { List, ListItem, Paragraph, PhrasingContent } from 'mdast';
import type { MdxNode } from '@opensourceframework/next-mdx';
import type { VFile } from 'vfile';

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

type TocNode = List | ListItem | Paragraph | null | undefined;

function getTextContent(children: PhrasingContent[]): string | undefined {
  const text = children
    .map((child) => {
      if ('value' in child && typeof child.value === 'string') {
        return child.value;
      }

      if ('children' in child) {
        return getTextContent(child.children as PhrasingContent[]) ?? '';
      }

      return '';
    })
    .join('');

  return text || undefined;
}

function isItem(value: Partial<Item> | Items): value is Item {
  return typeof (value as Item).title === 'string' && typeof (value as Item).url === 'string';
}

function isTocNode(node: unknown): node is Exclude<TocNode, null | undefined> {
  return (
    !!node &&
    typeof node === 'object' &&
    'type' in node &&
    typeof node.type === 'string' &&
    ['paragraph', 'list', 'listItem'].includes(node.type)
  );
}

function getItems(node: TocNode, current: Partial<Item>): Partial<Item> | Items {
  if (!node) {
    return {};
  }

  if (node.type === 'paragraph') {
    for (const child of node.children) {
      if (child.type === 'link') {
        current.url = child.url;

        const linkText = getTextContent(child.children);
        if (linkText) {
          current.title = linkText;
        }
      }

      if (child.type === 'text' && !current.title) {
        current.title = child.value;
      }
    }

    return current;
  }

  if (node.type === 'list') {
    const items = node.children.map((child) => getItems(child, {})).filter(isItem);
    if (!items.length) {
      return {};
    }

    current.items = items;
    return current;
  }

  if (node.type === 'listItem') {
    const [headingNode, nestedListNode] = node.children;
    const heading = isTocNode(headingNode) ? getItems(headingNode, {}) : {};

    if (nestedListNode && isTocNode(nestedListNode)) {
      return getItems(nestedListNode, heading as Partial<Item>);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node: unknown, file: VFile) => {
  const table = toc(node as any);
  (file.data as { tableOfContents?: TableOfContents }).tableOfContents = getItems(
    table.map as TocNode,
    {}
  ) as TableOfContents;
};

export interface TableOfContents extends Items {}

export async function getTableOfContents(node: MdxNode): Promise<TableOfContents> {
  const result = await remark()
    .use(getToc as any)
    .process(node.content);

  return (result.data as { tableOfContents?: TableOfContents }).tableOfContents ?? {};
}
