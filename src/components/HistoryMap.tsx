'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function HistoryMap({ events, selectedYear }: { events: any[], selectedYear: number }) {
  const visibleEvents = events.filter(e => true); // Show all for now

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-amber-200 mt-4">
      <MapContainer center={[-7.0, 110.5]} zoom={8} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {visibleEvents.map(ev => (
          <Marker key={ev.title} position={ev.coords}>
            <Popup>
              <b>{ev.year}: {ev.title}</b><br/>
              {ev.desc}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
