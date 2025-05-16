import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function ProjectPage({ params }: Props) {
  const project = allProjects.find((project) => project.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} />
      <article className="px-4 py-12 mx-auto max-w-5xl flex flex-col items-center">
        <div className="prose prose-zinc dark:prose-invert prose-headings:font-display prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-a:text-zinc-900 prose-strong:text-zinc-900 prose-li:text-zinc-600 w-full">
          <Mdx code={project.body.code} />
        </div>
      </article>
    </div>
  );
}
