import Link from "next/link";
import { Project } from "contentlayer/generated";

interface Props {
	project: Project;
}

export const Article: React.FC<Props> = ({ project }) => {
	return (
		<Link href={`/projects/${project.slug}`}>
			<article className="p-4 md:p-8">
  <div className="flex justify-between gap-4 pb-4 items-center">
    {/* Date */}
    <span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
      <span>{project.displayDate || "SOON"}</span>
    </span>

    {/* Category chip */}
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-700 text-zinc-200 group-hover:bg-white group-hover:text-zinc-800 transition">
      {project.category}
    </span>
  </div>

  <h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
    {project.title}
  </h2>
  <p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
    {project.description}
  </p>
</article>

		</Link>
	);
};
