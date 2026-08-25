"use client";

import { useRef, useState, type ReactNode } from "react";
import { Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CertificateDownloadButtonProps {
  children: ReactNode;
  fileName: string;
}

/** Библиотека рендеринга иногда зависает (сбор шрифтов/стилей страницы) — не даём кнопке "залипнуть" навсегда. */
const RENDER_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

/**
 * Оборачивает CertificateCard, рендерит его в PNG через html-to-image
 * и скачивает файл — готовую картинку можно опубликовать в Stories.
 */
export function CertificateDownloadButton({ children, fileName }: CertificateDownloadButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleDownload = async () => {
    if (!ref.current) return;
    setStatus("loading");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await withTimeout(
        toPng(ref.current, {
          pixelRatio: 2,
          backgroundColor: "#06050b",
          // Шрифты уже загружены на странице через next/font — не заставляем
          // библиотеку заново обходить и встраивать все стили документа
          // (именно этот шаг чаще всего "подвешивает" рендер).
          fontEmbedCSS: "",
          skipFonts: true,
        }),
        RENDER_TIMEOUT_MS
      );
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
      setStatus("idle");
    } catch (err) {
      console.error("Не удалось сгенерировать сертификат:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={ref}>{children}</div>
      <Button onClick={handleDownload} isLoading={status === "loading"} size="lg">
        <Download className="size-4" />
        Скачать сертификат для Stories
      </Button>
      {status === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-red-400 max-w-xs text-center">
          <AlertCircle className="size-3.5 shrink-0" />
          Не получилось сгенерировать файл. Попробуйте ещё раз или сделайте скриншот карточки выше.
        </p>
      )}
    </div>
  );
}
