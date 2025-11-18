import Image from "next/image";
import { hostname } from "os";
import { ReloadButton } from "./reload-button";

export const revalidate = 10;

export default async function Home() {
  const name = hostname();
  const version = Date.now();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1>Welcome to Next.js + Platformatic!</h1>

        <h3>
          Last server date is <strong>{version}</strong>, served by{" "}
          <strong>{name}</strong>
        </h3>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <ReloadButton />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://docs.platformatic.dev/docs/next/guides"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Guides
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://docs.platformatic.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to Platformatic Docs →
        </a>
      </footer>
    </div>
  );
}
