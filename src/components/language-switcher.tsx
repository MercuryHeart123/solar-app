"use client";

import { Button } from "@/components/ui/button";
import { type Language, useI18n } from "@/lib/i18n";

const LANGUAGE_OPTIONS: Array<{
    code: Language;
    labelKey: "languageSwitcher.option.en" | "languageSwitcher.option.th";
}> = [
    {
        code: "en",
        labelKey: "languageSwitcher.option.en",
    },
    {
        code: "th",
        labelKey: "languageSwitcher.option.th",
    },
];

export function LanguageSwitcher() {
    const { language, setLanguage, t } = useI18n();

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {t("languageSwitcher.label")}
            </span>
            <div
                role="group"
                aria-label={t("languageSwitcher.label")}
                className="flex items-center gap-1 rounded-full border border-emerald-200 bg-white p-1"
            >
                {LANGUAGE_OPTIONS.map((option) => {
                    const isActive = option.code === language;
                    return (
                        <Button
                            key={option.code}
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            aria-pressed={isActive}
                            onClick={() => {
                                if (!isActive) {
                                    setLanguage(option.code);
                                }
                            }}
                            className={
                                isActive
                                    ? "shadow-none"
                                    : "text-emerald-600 hover:text-emerald-700"
                            }
                        >
                            {t(option.labelKey)}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
