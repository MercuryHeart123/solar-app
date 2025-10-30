import { emeraldTheme } from "./theme-config";

export function getCSSVariableForColor(
    colorName: string,
    shade?: number
): string {
    if (colorName === "emerald") {
        if (shade !== undefined) {
            return `var(--emerald-${shade})`;
        }
        return `var(--emerald-600)`;
    }
    return `var(--${colorName})`;
}

export function generateEmeraldCSSVariables() {
    const variables: Record<string, string> = {};

    Object.entries(emeraldTheme.primary).forEach(([shade, value]) => {
        variables[`--emerald-${shade}`] = value;
    });

    return variables;
}

export function applyThemeToDocument(theme: "light" | "dark") {
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}
