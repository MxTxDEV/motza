import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="pad-x flex min-h-[100svh] flex-col items-start justify-center gap-8 pt-[var(--header-h)]">
      <p className="t-eyebrow text-signal">Erro 404</p>
      <h1 className="t-mega text-paper">
        Fora<br />do mapa.
      </h1>
      <p className="max-w-[40ch] text-lg text-bone/80">Essa página não existe — ou mudou de lugar. Disciplina também é saber voltar.</p>
      <Button href="/" variant="solid" arrow>Voltar ao início</Button>
    </div>
  );
}
