import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";

function ChangeView({ position }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, 17);
    }, [position, map]);

    return null;
}

function DraggableMarker({ position, onChange }) {
    return (
        <Marker
            draggable
            position={position}
            eventHandlers={{
                dragend(event) {
                    const marker = event.target.getLatLng();

                    onChange([
                        marker.lat,
                        marker.lng,
                    ]);
                },
            }}
        />
    );
}

export default function LocationPicker({
    position,
    onChange,
    className
}) {
    return (
        <div className={`overflow-hidden rounded-xl border ${className}`}>
            <MapContainer
                center={position}
                zoom={17}
                scrollWheelZoom={true}
                className="h-[400px] w-full"
            >
                <ChangeView position={position} />

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <DraggableMarker
                    position={position}
                    onChange={onChange}
                />
            </MapContainer>
        </div>
    );
}