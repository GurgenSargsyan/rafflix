"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Type, Plus, X, ListPlus, Crown } from "lucide-react";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import type { CustomField } from "@/types";

const FONT_OPTIONS = ["Inter", "Poppins", "Space Grotesk", "Sora", "Manrope", "Roboto Mono"];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-base-800/70 border border-white/10 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-neon-violet/50">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-7 rounded-lg cursor-pointer bg-transparent border-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white font-mono focus:outline-none"
        />
      </div>
    </div>
  );
}

export function StepBranding() {
  const { draft, updateBranding, addCustomField, removeCustomField } = useGiveawayStore();
  const branding = draft.branding;
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  if (!branding) return null;

  const handleFileToDataUrl = (
    file: File | undefined,
    key: "logoUrl" | "backgroundImageUrl"
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateBranding({ [key]: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const field: Omit<CustomField, "id"> = {
      label: newFieldLabel.trim(),
      fieldType: "text",
      required: false,
    };
    addCustomField(field);
    setNewFieldLabel("");
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-2 text-neon-fuchsia">
        <Crown className="size-4" />
        <span className="text-xs font-medium uppercase tracking-widest">Premium · Брендинг</span>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">Настройте фирменный стиль</h2>
        <p className="text-white/50 text-sm mt-1">
          Эти настройки будут применены к публичной странице розыгрыша.
        </p>
      </div>

      {/* Логотип и фон */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
            Логотип
          </span>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="w-full aspect-video rounded-xl border border-dashed border-white/15 hover:border-neon-violet/50 bg-base-800/50 flex flex-col items-center justify-center gap-1.5 transition-colors overflow-hidden"
          >
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoUrl} alt="Логотип" className="max-h-16 object-contain" />
            ) : (
              <>
                <Upload className="size-5 text-white/40" />
                <span className="text-xs text-white/40">Загрузить лого</span>
              </>
            )}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileToDataUrl(e.target.files?.[0], "logoUrl")}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
            Фоновое изображение
          </span>
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            className="w-full aspect-video rounded-xl border border-dashed border-white/15 hover:border-neon-cyan/50 bg-base-800/50 flex flex-col items-center justify-center gap-1.5 transition-colors overflow-hidden bg-cover bg-center"
            style={
              branding.backgroundImageUrl
                ? { backgroundImage: `url(${branding.backgroundImageUrl})` }
                : undefined
            }
          >
            {!branding.backgroundImageUrl && (
              <>
                <ImageIcon className="size-5 text-white/40" />
                <span className="text-xs text-white/40">Загрузить фон</span>
              </>
            )}
          </button>
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileToDataUrl(e.target.files?.[0], "backgroundImageUrl")}
          />
        </div>
      </div>

      {/* Цвета */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ColorField
          label="Основной цвет"
          value={branding.primaryColor}
          onChange={(v) => updateBranding({ primaryColor: v })}
        />
        <ColorField
          label="Вторичный цвет"
          value={branding.secondaryColor}
          onChange={(v) => updateBranding({ secondaryColor: v })}
        />
        <ColorField
          label="Цвет фона"
          value={branding.backgroundColor}
          onChange={(v) => updateBranding({ backgroundColor: v })}
        />
      </div>

      {/* Шрифт */}
      <div>
        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/50">
          <Type className="size-3.5" /> Шрифт заголовков
        </span>
        <div className="flex flex-wrap gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => updateBranding({ fontFamily: font })}
              style={{ fontFamily: font }}
              className={`px-3.5 py-2 rounded-lg text-sm border transition-colors ${
                branding.fontFamily === font
                  ? "border-neon-violet/60 bg-neon-violet/10 text-white"
                  : "border-white/10 text-white/60 hover:border-white/25"
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* Водяной знак */}
      <div className="p-4 rounded-xl glass-light border border-white/10">
        <Switch
          checked={branding.hideWatermark}
          onChange={(v) => updateBranding({ hideWatermark: v })}
          label="Скрыть водяной знак Freespin"
          description="Ваш бренд — единственное, что увидят участники"
        />
      </div>

      {/* Кастомные поля формы */}
      <div className="space-y-3">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/50">
          <ListPlus className="size-3.5" /> Кастомные поля формы участия
        </span>

        <AnimatePresence>
          {draft.customFields.map((field) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-2.5 rounded-lg glass-light border border-white/10"
            >
              <span className="text-sm text-white flex-1">{field.label}</span>
              <span className="text-[10px] uppercase text-white/30">{field.fieldType}</span>
              <button
                type="button"
                onClick={() => removeCustomField(field.id)}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex gap-2">
          <Input
            placeholder="Например: Ваш Telegram username"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddField())}
          />
          <Button type="button" variant="outline" onClick={handleAddField} className="shrink-0">
            <Plus className="size-4" /> Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}
