import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    published: {
      type: "boolean",
      default: true,
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    url: {
      type: "string",
      required: false,
    },
    repository: {
      type: "string",
      required: false,
    },
    designPitch: { type: "string", required: false },
    videoDemo: { type: "string", required: false },
    figmaPrototype: { type: "string", required: false },
    github: { type: "string", required: false },
    tools: { type: "list", of: { type: "string" }, required: false },
    displayDate: { type: "string", required: false },
    category: { type: "string", required: false },
  },
  computedFields: {
    path: {
      type: "string",
      resolve: (project) => project._raw.flattenedPath,
    },
    slug: {
      type: "string",
      resolve: (project) => project._raw.flattenedPath.replace("projects/", ""),
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
  },
  computedFields: {
    path: {
      type: "string",
      resolve: (page) => page._raw.flattenedPath,
    },
    slug: {
      type: "string",
      resolve: (page) => page._raw.flattenedPath.replace("pages/", ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Project, Page],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("highlighted");
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ["word"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
}); 