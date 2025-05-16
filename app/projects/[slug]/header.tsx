"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Project } from "contentlayer/generated";
import { toolIconMap } from "@/app/components/tool-icons";

interface Props {
	project: Project;
}

export const Header: React.FC<Props> = ({ project }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	// Dynamically find all URL fields in the project
	const urlLinks = Object.entries(project)
		.filter(([key, value]) =>
			typeof value === "string" &&
			value.startsWith("http") &&
			!["image", "ogImage", "cover", "thumbnail"].includes(key)
		)
		.map(([key, value]) => ({
			label: key
				.replace(/([A-Z])/g, " $1")
				.replace(/^./, (str) => str.toUpperCase())
				.replace("Url", "Website"),
			href: String(value),
		}));

	const tools: string[] = Array.isArray((project as any).tools) ? (project as any).tools : [];

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
		>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-white/10  border-zinc-200 lg:border-transparent"
				}`}
			>
				<div className="container flex items-center p-6 mx-auto">
					<Link
						href="/projects"
						className={`duration-200 hover:font-medium ${
							isIntersecting
								? " text-zinc-400 hover:text-zinc-100"
								: "text-zinc-600 hover:text-zinc-900"
						} `}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden  py-16 sm:py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{project.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-300">
							{project.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none flex flex-col items-center">
						{tools.length > 0 && (
							<div className="flex items-center gap-3 justify-center text-center mb-8">
								<span className="text-sm text-zinc-500">Built with</span>
								{tools.map((tool) => (
									<span key={tool} title={tool} className="flex items-center">
										{toolIconMap[tool] || (
											<span className="inline-block w-6 h-6 bg-zinc-400 rounded" />
										)}
									</span>
								))}
							</div>
						)}
						{urlLinks.length > 0 && (
							<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10 mt-8">
								{urlLinks.map((link) => (
									<Link target="_blank" key={link.label} href={link.href} className="inline-flex items-center gap-1 hover:underline">
										{link.label} <span aria-hidden="true">&rarr;</span>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
