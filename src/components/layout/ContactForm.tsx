"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/** Sem backend ainda: valida e abre o app de e-mail do cliente (mailto). */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim() || "Contato pelo site";
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Informe seu nome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Informe um e-mail válido.";
    if (message.length < 10) next.message = "Escreva uma mensagem com pelo menos 10 caracteres.";
    setErrors(next);
    if (Object.keys(next).length) {
      (e.currentTarget.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus();
      return;
    }
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Nome" name="name" autoComplete="name" required error={errors.name} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" required error={errors.email} />
      <Field label="Assunto" name="subject" />
      <TextArea label="Mensagem" name="message" required error={errors.message} />
      <Button type="submit" variant="solid" size="lg" arrow className="self-start">Enviar mensagem</Button>
      <p role="status" className="min-h-6 text-sm text-bone/80">
        {sent && "Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada abrir, escreva para " + site.email + "."}
      </p>
    </form>
  );
}
