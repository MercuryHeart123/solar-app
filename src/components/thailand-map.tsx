"use client";

import { memo, useEffect, useMemo, useState } from "react";

type ProvincePath = {
    id: string;
    name: string;
    d: string;
};

type MapData = {
    viewBox: string;
    provinces: ProvincePath[];
};

type ThailandMapProps = {
    selectedProvinceId?: string | null;
    onSelect?: (provinceId: string) => void;
    className?: string;
};

const MAP_SOURCE_URL = "/thailand-provinces.svg";
const DEFAULT_VIEWBOX = "0 0 560 1025";

const BASE_FILL = "#d1fae5";
const HOVER_FILL = "#34d399";
const SELECTED_FILL = "#047857";

function ThailandMapComponent({
    selectedProvinceId,
    onSelect,
    className,
}: ThailandMapProps) {
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(
        null
    );
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadMap = async () => {
            try {
                const response = await fetch(MAP_SOURCE_URL);
                if (!response.ok) {
                    throw new Error("Failed to load map asset");
                }

                const svgMarkup = await response.text();
                if (!isMounted) {
                    return;
                }

                const parser = new DOMParser();
                const documentRoot = parser.parseFromString(
                    svgMarkup,
                    "image/svg+xml"
                );
                const svgElement = documentRoot.querySelector("svg");

                if (!svgElement) {
                    throw new Error("Invalid SVG data");
                }

                const viewBox =
                    svgElement.getAttribute("viewBox") ?? DEFAULT_VIEWBOX;
                const provinces = Array.from(
                    svgElement.querySelectorAll("path")
                )
                    .map((path) => ({
                        id: path.getAttribute("id") ?? "",
                        name: path.getAttribute("name") ?? "",
                        d: path.getAttribute("d") ?? "",
                    }))
                    .filter((province) => province.id && province.d);

                setMapData({ viewBox, provinces });
            } catch (loadError) {
                console.error(loadError);
                if (isMounted) {
                    setError(true);
                }
            }
        };

        loadMap();

        return () => {
            isMounted = false;
        };
    }, []);

    const statusLabel = useMemo(() => {
        if (error) {
            return "Unable to load the Thailand map.";
        }
        if (!mapData) {
            return "Loading Thailand map…";
        }
        return undefined;
    }, [error, mapData]);

    if (statusLabel) {
        return (
            <div
                className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-emerald-100 bg-white text-sm text-emerald-600 ${
                    className ?? ""
                }`}
            >
                {statusLabel}
            </div>
        );
    }

    return (
        <figure
            className={`flex flex-col items-center gap-3 ${className ?? ""}`}
        >
            <svg
                aria-label="Selectable map of Thailand"
                viewBox={mapData?.viewBox}
                className="h-auto w-full max-w-[420px]"
                role="group"
            >
                {mapData?.provinces.map((province) => {
                    const isSelected = province.id === selectedProvinceId;
                    const isHovered = province.id === hoveredProvinceId;
                    const fillColor = isSelected
                        ? SELECTED_FILL
                        : isHovered
                        ? HOVER_FILL
                        : BASE_FILL;

                    return (
                        <path
                            key={province.id}
                            d={province.d}
                            fill={fillColor}
                            stroke="#059669"
                            strokeWidth={isSelected ? 2 : 0.8}
                            strokeLinejoin="round"
                            tabIndex={0}
                            role="button"
                            aria-label={province.name || province.id}
                            onClick={() => onSelect?.(province.id)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    onSelect?.(province.id);
                                }
                            }}
                            onMouseEnter={() =>
                                setHoveredProvinceId(province.id)
                            }
                            onMouseLeave={() => setHoveredProvinceId(null)}
                            onFocus={() => setHoveredProvinceId(province.id)}
                            onBlur={() => setHoveredProvinceId(null)}
                            className="cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-emerald-100"
                        />
                    );
                })}
            </svg>
            <figcaption className="text-xs uppercase tracking-wide text-emerald-600">
                {selectedProvinceId
                    ? mapData?.provinces.find(
                          (province) => province.id === selectedProvinceId
                      )?.name ?? "Province selected"
                    : "Select a province"}
            </figcaption>
        </figure>
    );
}

export const ThailandMap = memo(ThailandMapComponent);
