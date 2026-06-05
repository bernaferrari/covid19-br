import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => (
  <header className="fixed inset-x-0 top-0 z-10 border-b bg-white">
    <div className="mx-auto max-w-6xl px-4 py-2">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/header_footer/img_logo.png"
            alt="Portal COVID-19 Paraná"
            width={216}
            height={107}
            style={{ width: 80, height: "auto" }}
          />
        </Link>

        <div className="flex items-center gap-2 text-gray-600">
          <Link href="/evolution" className={cn(buttonVariants({ variant: "ghost" }))}>
            Monitoramento
          </Link>
          <Link href="/about" className={cn(buttonVariants({ variant: "ghost" }))}>
            Projeções
          </Link>
          <a
            href="https://www.ufpr.br/portalufpr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Image
              src="/header_footer/img_ufpr.png"
              alt="UFPR"
              width={182}
              height={118}
              style={{ width: 56, height: "auto" }}
            />
          </a>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
