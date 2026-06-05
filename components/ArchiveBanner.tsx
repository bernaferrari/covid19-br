import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ArchiveBanner = () => (
  <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
    <Alert className="items-start gap-3 border-primary/30 px-4 py-4 shadow-sm md:px-5 md:py-5">
      <Info className="mt-0.5 size-5 text-primary" />
      <div>
        <AlertTitle className="text-sm font-semibold uppercase tracking-wide">
          Portal arquivado
        </AlertTitle>
        <AlertDescription className="text-sm text-gray-700">
          Mantemos este site como registro histórico da mobilização coletiva nos primeiros anos da
          pandemia (2020-2021). Os dados não são mais atualizados e os serviços estão indisponíveis.{" "}
          Para saber mais sobre o contexto e as limitações atuais, consulte o{" "}
          <a
            href="https://github.com/bernaferrari/covid19-br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            README do repositório
          </a>
          .
        </AlertDescription>
      </div>
    </Alert>
  </div>
);

export default ArchiveBanner;
