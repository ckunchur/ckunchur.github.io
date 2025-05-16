'use client';

import Link from "next/link";
import React, { useState } from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featured = allProjects.find((project) => project.slug === "ecovision")!;
  const top2 = allProjects.find((project) => project.slug === "mindstorm")!;
  const top3 = allProjects.find((project) => project.slug === "edusketch")!;

  const filteredProjects = allProjects
    .filter((p) => p.published)
    .filter(project =>
      selectedCategory === "all"
        ? project.slug !== featured.slug &&
        project.slug !== top2.slug &&
        project.slug !== top3.slug
        : project.category === selectedCategory
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Projects
            </h2>
            <p className="mt-4 text-zinc-400">
              A walkthrough of some of my projects, both coding and design. These projects span mobile, web, and XR, covering domains such as healthcare, wellbeing, sustainability, education, and more.
            </p>
          </div>
          <select
            className="bg-zinc-800 text-zinc-100 rounded-md px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 w-full lg:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Mobile">Mobile</option>
            <option value="Web">Web</option>
            <option value="XR">XR</option>
          </select>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {selectedCategory === "all" ? (
          <>
            <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
              <Card>
                <Link href={`/projects/${featured.slug}`}>
                  <article className="relative w-full h-full p-4 md:p-8">
                      <div className="flex justify-between gap-4 pb-4 items-center">
                        <span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
                          <span>{featured.displayDate || "SOON"}</span>
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-700 text-zinc-200 group-hover:bg-white group-hover:text-zinc-800 transition">
                          {featured.category}
                        </span>
                      </div>
                    <h2
                      id="featured-post"
                      className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                    >
                      {featured.title}
                    </h2>
                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                      {featured.description}
                    </p>
                    <div className="absolute bottom-4 md:bottom-8">
                      <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                        Read more <span aria-hidden="true">&rarr;</span>
                      </p>
                    </div>
                  </article>
                </Link>
              </Card>

              <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
                {[top2, top3].map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} />
                  </Card>
                ))}
              </div>
            </div>
            <div className="hidden w-full h-px md:block bg-zinc-800" />
          </>
        ) : null}

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
