"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
    DragEndEvent,
    LatLngExpression,
    LeafletMouseEvent,
} from "leaflet";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Coordinates = { lat: number; lng: number };

export interface MapPickerProps {
    value: Coordinates | null;
    onChange?: (coords: Coordinates) => void;
    className?: string;
}

const defaultCenter: Coordinates = { lat: 14.17919, lng: 100.50293 };

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function normalizeCoords(coords: { lat: number; lng: number }): Coordinates {
    return {
        lat: Number(coords.lat.toFixed(6)),
        lng: Number(coords.lng.toFixed(6)),
    };
}

function MapViewUpdater({ position }: { position: Coordinates | null }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(
                [position.lat, position.lng],
                Math.max(map.getZoom(), 13),
                {
                    duration: 0.5,
                }
            );
        }
    }, [map, position]);

    return null;
}

function MapInteractions({
    onSelect,
}: {
    onSelect: (coords: Coordinates) => void;
}) {
    useMapEvents({
        click(event: LeafletMouseEvent) {
            onSelect(normalizeCoords(event.latlng));
        },
    });
    return null;
}

export function MapPicker({ value, onChange, className }: MapPickerProps) {
    const [position, setPosition] = useState<Coordinates | null>(value);

    useEffect(() => {
        if (value) {
            setPosition(value);
        }
    }, [value]);

    const handleSelect = useCallback(
        (coords: Coordinates) => {
            setPosition(coords);
            onChange?.(coords);
        },
        [onChange]
    );

    const markerHandlers = useMemo(
        () => ({
            dragend: (event: DragEndEvent) => {
                const marker = event.target;
                if (!marker) {
                    return;
                }
                const next = normalizeCoords(marker.getLatLng());
                handleSelect(next);
            },
        }),
        [handleSelect]
    );

    const mapCenter: LatLngExpression = position
        ? [position.lat, position.lng]
        : [defaultCenter.lat, defaultCenter.lng];

    return (
        <div className={className} aria-label="Map picker" role="application">
            <MapContainer
                center={mapCenter}
                zoom={position ? 13 : 11}
                scrollWheelZoom
                className="h-full w-full rounded-2xl overflow-hidden"
                style={{ height: "100%", width: "100%" }}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapViewUpdater position={position} />
                <MapInteractions onSelect={handleSelect} />
                {position ? (
                    <Marker
                        position={[position.lat, position.lng]}
                        draggable
                        eventHandlers={markerHandlers}
                        icon={markerIcon}
                    />
                ) : null}
            </MapContainer>
        </div>
    );
}
