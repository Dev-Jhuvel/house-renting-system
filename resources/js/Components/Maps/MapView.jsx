import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function MapView({ latitude, longitude, address }) {
    console.log(latitude);
    if (!latitude || !longitude) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl border bg-gray-50">
                No location available.
            </div>
        );
    }

    return (
        <div className="relative h-[400px] overflow-hidden rounded-3xl">
    <MapContainer
        center={[latitude, longitude]}
        zoom={17}
        scrollWheelZoom={false}
        className="h-full w-full"
    >
        <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]} />
    </MapContainer>

    {/* Address Card */}
    <div className="absolute bottom-6 left-6 right-6 z-[1000]">
        <div className="rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Address
            </p>

            <p className="mt-2 text-2xl font-bold leading-tight">
                {address}
            </p>
        </div>
    </div>
</div>
    );
}