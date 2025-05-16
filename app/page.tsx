import Link from "next/link";
import React from "react";
import Particles from "./components/particles";
import Image from "next/image";
import { Card } from "./components/card";
import { ArrowRight, Github, Mail, Linkedin } from "lucide-react";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Photography", href: "/photography" },
  { name: "Contact", href: "/contact" },
];

const socials = [
  {
    icon: <Linkedin size={16} />,
    href: "https://www.linkedin.com/in/ckunchur/",
    label: "LinkedIn",
  },
  {
    icon: <Mail size={16} />,
    href: "mailto:crkunchur@gmail.com",
    label: "Email",
  },
  {
    icon: <Github size={16} />,
    href: "https://github.com/ckunchur",
    label: "Github",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="py-4 animate-fade-in">
        <ul className="flex items-center justify-center gap-3">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={500} />

      <div className="container mx-auto px-4 py-8 lg:py-16 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col">
            <h1 className="py-2 px-0.5 text-4xl text-white animate-title font-display sm:text-6xl md:text-8xl">
              caitlin
            </h1>
            <h1 className="py-2 px-0.5 text-4xl animate-title font-display sm:text-6xl md:text-8xl text-edge-outline">
              kunchur
            </h1>
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-colors duration-200 rounded-md underline underline-offset-4"
            >
              View my work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Card>
            <div className="p-4 md:p-8">
              <div className="flex flex-col items-center gap-8">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-6 border-white">
                  <Image
                    src="/profile.png"
                    alt="Profile photo"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden w-full h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

                <div className="text-center p-2">
                  <h2 className="text-md text-zinc-600">
                    I'm a developer and a designer, passionate about creating
                    products that make a difference. With a B.S. in Biomedical
                    Computation and an M.S. in Computer Science (HCI), I've
                    worked on tools for clinicians, scientists, teachers, parents,
                    and more. I'm passionate about data visualization and building
                    products that are accessible and intuitive.
                  </h2>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {socials.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      className="text-zinc-600 hover:text-white transition-colors duration-200 border border-zinc-600 hover:border-white rounded-full p-2"
                    >
                      {s.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <p className="fixed bottom-4 right-4 text-xs text-zinc-600">
          Built with{' '}
          <a href="https://nextjs.org/" className="underline">
            Next.js
          </a>
          ,{' '}
          <a href="https://tailwindcss.com/" className="underline">
            Tailwind CSS
          </a>
          ,{' '}
          <a href="https://supabase.com/" className="underline">
            Supabase
          </a>
          , and deployed to{' '}
          <a href="https://vercel.com/" className="underline">
            Vercel
          </a>
          .
        </p>
      </div>
    </div>
  )
}