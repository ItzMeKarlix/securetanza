import type { FitBoundsOptions, LatLngBoundsExpression, Map as LeafletMap } from "leaflet";
import type { Side } from "./compare-data";

type Bounds = [[number, number], [number, number]];

/** South-west / north-east corners of any GeoJSON geometry (Polygon or MultiPolygon). */
function boundsOf(coordinates: unknown): Bounds | null {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  const visit = (node: unknown) => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      const [lon, lat] = node as [number, number];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      return;
    }
    node.forEach(visit);
  };
  visit(coordinates);

  return Number.isFinite(minLat) ? [[minLat, minLon], [maxLat, maxLon]] : null;
}

/** Room for the panels floating over each map: the period strip on top, the readout below. */
const HOME_PADDING = { paddingTopLeft: [24, 76] as [number, number], paddingBottomRight: [24, 84] as [number, number] };

const prefersReducedMotion = () =>
  typeof document !== "undefined" && document.documentElement.dataset.reduceMotion === "true";

/**
 * Keeps the two maps of the compare view on one viewport: pan or zoom either
 * and the other follows, so the same barangay always sits in the same place on
 * both. Also the one handle the page's zoom controls and ledger rows use to move
 * both maps at once. Holds no Leaflet runtime itself (only types), so the page
 * can create it during server rendering.
 */
export class MapLink {
  private maps = new Map<Side, LeafletMap>();
  private following = false;
  private coordinatedMove = false;
  private coordinatedMoveId = 0;
  private home: Bounds | null = null;

  /** The whole municipality, from the barangay boundaries. */
  setHome(geoJson: { features?: Array<{ geometry?: { coordinates?: unknown } }> } | null) {
    if (!geoJson?.features) return;
    this.home = boundsOf(geoJson.features.map((f) => f.geometry?.coordinates));
  }

  /** Registers a map and returns the cleanup. A map that joins late takes the view the other already has. */
  attach(side: Side, map: LeafletMap): () => void {
    const partner = this.partnerOf(side);
    if (partner) map.setView(partner.getCenter(), partner.getZoom(), { animate: false });
    else if (this.home) map.fitBounds(this.home, { ...HOME_PADDING, animate: false });

    this.maps.set(side, map);

    const follow = () => {
      // Moving the partner fires its own move event; without this guard the two would echo forever.
      if (this.following || this.coordinatedMove) return;
      const other = this.partnerOf(side);
      if (!other) return;
      this.following = true;
      other.setView(map.getCenter(), map.getZoom(), { animate: false });
      this.following = false;
    };
    map.on("move", follow);

    // The compare sidebar can be hidden, which resizes both map panes without
    // resizing the browser window. Leaflet otherwise keeps the old tile
    // viewport and leaves empty strips until the next window resize.
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false, debounceMoveend: true });
    });
    resizeObserver.observe(map.getContainer());

    return () => {
      resizeObserver.disconnect();
      map.off("move", follow);
      if (this.maps.get(side) === map) this.maps.delete(side);
    };
  }

  zoomIn() {
    this.lead()?.zoomIn();
  }

  zoomOut() {
    this.lead()?.zoomOut();
  }

  /** Back to the whole municipality on both maps. */
  fitHome() {
    for (const map of this.maps.values()) {
      map.invalidateSize({ pan: false, debounceMoveend: true });
    }
    if (this.home) this.flyTo(this.home, HOME_PADDING);
  }

  /** Brings one barangay's boundary into view on both maps. */
  focus(geometry: { coordinates?: unknown } | undefined) {
    const bounds = boundsOf(geometry?.coordinates);
    if (bounds) this.flyTo(bounds, { paddingTopLeft: [56, 96], paddingBottomRight: [56, 104], maxZoom: 16 });
  }

  private flyTo(bounds: LatLngBoundsExpression, options: FitBoundsOptions) {
    const map = this.lead();
    if (!map) return;
    const maps = Array.from(this.maps.values());
    if (prefersReducedMotion()) {
      // Apply both view changes in the same turn without follow events echoing.
      this.following = true;
      maps.forEach((linkedMap) => linkedMap.fitBounds(bounds, { ...options, animate: false }));
      this.following = false;
      return;
    }

    if (maps.length > 1) {
      // Start both animations together. Suppress their move listeners until
      // both finish so neither map is repeatedly reset to the other's frame.
      this.coordinatedMove = true;
      // A previous fit or user pan may still be emitting moveend. Stop both
      // first so those stale events cannot finish this new coordinated move.
      maps.forEach((linkedMap) => linkedMap.stop());
      const moveId = ++this.coordinatedMoveId;
      this.coordinatedMove = true;
      let remaining = maps.length;
      const finish = () => {
        if (moveId !== this.coordinatedMoveId) return;
        remaining -= 1;
        if (remaining === 0) this.coordinatedMove = false;
      };
      maps.forEach((linkedMap) => {
        linkedMap.once("moveend", finish);
        linkedMap.flyToBounds(bounds, { ...options, duration: 0.6 });
      });
      // A map already at the target may not emit moveend; don't leave the
      // synchronization guard enabled if only its partner actually moves.
      window.setTimeout(() => {
        if (moveId === this.coordinatedMoveId) this.coordinatedMove = false;
      }, 900);
      return;
    }

    map.flyToBounds(bounds, { ...options, duration: 0.6 });
  }

  private lead() {
    return this.maps.get("A") ?? this.maps.get("B");
  }

  private partnerOf(side: Side) {
    return this.maps.get(side === "A" ? "B" : "A");
  }
}
