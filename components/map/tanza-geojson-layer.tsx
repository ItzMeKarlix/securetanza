"use client";

import React from "react";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";
import type { Feature, GeoJsonObject, Geometry } from "geojson";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, getThreatLevelFromCount } from "@/hooks/useThreatLevels";
import { useCrimeTypeByBarangay } from "@/hooks/useCrimeTypeByBarangay";
import { useCrimeHoverStats } from "@/hooks/useCrimeHoverStats";
import { useDataColors } from "@/hooks/useDataColors";
import {
  getHotspotSectorForDate,
} from "@/constants/dummy";

interface BarangayLayerProps {
  data: GeoJsonObject;
  selectedBarangay: string | null;
  onClickBarangay?: (name: string) => void;
}

const TanzaBarangayLayer: React.FC<BarangayLayerProps> = ({
  data,
  selectedBarangay,
  onClickBarangay,
}) => {
  const { palette, theme, threatColors } = useDataColors();
  const highlightBorder = "#ffffff";
  const {
    hotspotMode,
    hotspotMonth,
    hotspotYear,
    hoveredThreatLevel,
    previewThreatLevel,
    hoveredBarangay,
    setHoveredBarangay,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
    selectedCrimeType,
    selectedFelonyStage,
    timeRange,
  } = useMapContext();

  // Registered per polygon in onEachFeature, so a hover that originates
  // *outside* the map — e.g. a row in the crime-type breakdown list — can
  // apply the exact same highlight a direct map hover would, by calling
  // Leaflet's setStyle directly instead of remounting the whole GeoJSON
  // layer (which the key below already does for the rarer, discrete
  // hoveredThreatLevel case — too heavy to also do on every casual mouse
  // pass over the map).
  const layerRegistryRef = React.useRef<Map<string, { layer: L.Path; feature: Feature<Geometry, { adm4_en?: string }> }>>(new Map());

  // Tracks whichever polygon's sticky tooltip is currently open. Each layer's
  // bindTooltip only knows how to open/close *its own* tooltip on its own
  // hover events — on small, adjacent barangays (sharing a boundary), a fast
  // mouse sweep can fire the next polygon's mouseover before the previous
  // one's mouseout cleanly fires, leaving multiple tooltips stuck open at
  // once. Explicitly closing whatever was last tracked open, on every
  // mouseover, guarantees at most one is ever visible regardless of that
  // timing race.
  const openTooltipLayerRef = React.useRef<L.Layer | null>(null);
  
  const { barangayCrimeCounts, filteredBarangayCrimeCounts, thresholds, loading } = useThreatLevels();
  const { crimeTypeCounts, loading: crimeTypeLoading } = useCrimeTypeByBarangay();
  const { stats: hoverStats } = useCrimeHoverStats(hoveredBarangay);

  // Debug logging - only log once when time filter state changes
  React.useEffect(() => {
    if (isTimeFilterActive) {
      console.log('🗺️ TIME FILTER ACTIVE - Barangay Layer Update:', {
        timeFilterDate: timeFilterDate?.toLocaleDateString(),
        timeFilterHour,
        filteredBarangaysLength: Object.keys(filteredBarangayCrimeCounts).length,
        filteredCounts: filteredBarangayCrimeCounts,
      });
      
      // Log which barangays will be highlighted
      const barangaysWithCrimes = Object.entries(filteredBarangayCrimeCounts)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => `${name}: ${count}`);
      
      if (barangaysWithCrimes.length > 0) {
        console.log('🎨 Barangays to highlight:', barangaysWithCrimes.join(', '));
      } else {
        console.log('⚪ No barangays to highlight (all transparent)');
      }
    }
  }, [isTimeFilterActive, timeFilterDate, timeFilterHour, filteredBarangayCrimeCounts]);

  const getThreatLevel = (barangayName: string) => {
    // Normalize barangay name to uppercase for matching
    const normalizedName = barangayName.toUpperCase();
    
    // `thresholds` already follows the active view (crime type, single day / hour, or
    // the whole period — see useThreatLevels), so the shading always matches the legend.
    if (selectedCrimeType) {
      const count = crimeTypeCounts[normalizedName] || crimeTypeCounts[barangayName] || 0;
      return getThreatLevelFromCount(count, thresholds);
    }

    if (isTimeFilterActive) {
      const count = filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0;
      return getThreatLevelFromCount(count, thresholds);
    }

    // Normal mode: use individual barangay counts with dynamic thresholds
    const count = barangayCrimeCounts[normalizedName] || barangayCrimeCounts[barangayName] || 0;
    return getThreatLevelFromCount(count, thresholds);
  };

  const hasFilteredCrimes = (barangayName: string) => {
    const normalizedName = barangayName.toUpperCase();
    
    // Check if crime type filter is active
    if (selectedCrimeType) {
      return (crimeTypeCounts[normalizedName] || crimeTypeCounts[barangayName] || 0) > 0;
    }
    
    // Check if this barangay has crimes in the filtered time period
    // When time filter is active (date-based), check filteredBarangayCrimeCounts
    if (isTimeFilterActive) {
      const count = filteredBarangayCrimeCounts[normalizedName] || filteredBarangayCrimeCounts[barangayName] || 0;
      return count > 0;
    }
    
    return false;
  };

  // Don't render the layer until data is loaded to prevent color flickering.
  // Checked again just before the JSX return below, not here — every hook in
  // this component (including the hoveredBarangay effect further down) has
  // to run on every render regardless, or React's hook-order tracking breaks
  // the moment `loading` flips between renders.
  const skipRender = loading && Object.keys(barangayCrimeCounts).length === 0;

  const styleFeature = (feature?: Feature<Geometry, { adm4_en?: string }>) => {
    const name = feature?.properties?.adm4_en ?? "";
    const hasActiveCrimes = hasFilteredCrimes(name);
    
    // When time filter is active, handle styling differently
    if (isTimeFilterActive) {
      if (hasActiveCrimes) {
        // Only get threat level and color for barangays WITH crimes
        const level = getThreatLevel(name);
        const color = threatColors[level];
        
        // Highlight barangays with crimes at this time with their threat level color
        return {
          color: highlightBorder,
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.75,
          dashArray: "",
        };
      } else {
        // Barangays without crimes at this time - completely transparent/no fill
        return {
          color: "#64748b",
          weight: 1,
          opacity: 0.15,
          fillColor: "transparent",
          fillOpacity: 0,
          dashArray: "3",
        };
      }
    }
    
    // Normal mode (no time filter) - get threat level for all barangays
    const level = getThreatLevel(name);
    const color = threatColors[level];

    const isSelected = Boolean(
      selectedBarangay &&
      (selectedBarangay.toLowerCase().trim() === name?.toLowerCase().trim() ||
       selectedBarangay.toLowerCase().trim().endsWith(name?.toLowerCase().trim()))
    );
    const activeThreatLevel = previewThreatLevel ?? hoveredThreatLevel;
    const isFocusMatch = activeThreatLevel
      ? level === activeThreatLevel
      : true;

    const isHotspot =
      hotspotMode &&
      getHotspotSectorForDate(hotspotMonth, hotspotYear) === name;

    if (isHotspot) {
      return {
        color: highlightBorder,
        weight: 5,
        opacity: 0.3,
        fillColor: threatColors.critical,
        fillOpacity: 0.85,
      };
    }

    // When crime type filter is active
    if (selectedCrimeType) {
      if (hasActiveCrimes) {
        // Highlight barangays with this crime type
        return {
          color: highlightBorder,
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.75,
          dashArray: "",
        };
      } else {
        // Show barangays without this crime type in blue (secure color)
        return {
          color: threatColors.secure,
          weight: 1.5,
          opacity: 0.5,
          fillColor: threatColors.secure,
          fillOpacity: 0.45,
          dashArray: "2",
        };
      }
    }

    // Normal state (no time filter)
    return {
      color:
        isSelected || (activeThreatLevel && isFocusMatch) ? highlightBorder : color,
      weight: isSelected ? 5 : activeThreatLevel && isFocusMatch ? 4 : activeThreatLevel ? 1.5 : 2.5,
      opacity: isSelected ? 0.9 : activeThreatLevel ? (isFocusMatch ? 1 : 0.35) : 0.7,
      fillColor: color,
      fillOpacity: isSelected ? 0.35 : activeThreatLevel ? (isFocusMatch ? 0.75 : 0.18) : 0.45,
      dashArray: isSelected || (activeThreatLevel && isFocusMatch) ? "" : "",
    };
  };

  // Keep the callback passed to React Leaflet stable. Hover styles are applied
  // directly to Leaflet paths; a new style callback on every render makes
  // React Leaflet reapply the base styles and erase that hover treatment.
  const styleFeatureRef = React.useRef(styleFeature);
  styleFeatureRef.current = styleFeature;
  const getPathStyle = React.useCallback(
    (feature?: Feature<Geometry, { adm4_en?: string }>) => ({
      ...styleFeatureRef.current(feature),
      className: "barangay-hover-transition",
    }),
    []
  );

  const onEachFeature = (feature: Feature<Geometry, { adm4_en?: string }>, layer: L.Layer) => {
    if (!(layer instanceof L.Path)) return;
    const name = feature?.properties?.adm4_en ?? "";

    if (name) {
      layerRegistryRef.current.set(name.toLowerCase().trim(), { layer, feature });
    }

    layer.on({
      // The style highlight is applied by the hoveredBarangay effect below —
      // this just reports the hover, the same way a list row hovering it would.
      mouseover: () => {
        setHoveredBarangay(name);
        if (openTooltipLayerRef.current && openTooltipLayerRef.current !== layer) {
          openTooltipLayerRef.current.closeTooltip();
        }
        layer.openTooltip();
        openTooltipLayerRef.current = layer;
      },
      mouseout: () => {
        setHoveredBarangay(null);
        layer.closeTooltip();
        if (openTooltipLayerRef.current === layer) {
          openTooltipLayerRef.current = null;
        }
      },
      click: () => {
        if (onClickBarangay) onClickBarangay(name);
      },
    });

    if (name) {
      layer.bindTooltip(getTooltipContent(name), {
        sticky: true,
        className: "custom-tooltip-revert",
        direction: "top",
        opacity: 1,
      });
    }
  };

  function getTooltipContent(name: string) {
    const normalizedName = name.toUpperCase();
    const count = barangayCrimeCounts[normalizedName] ?? barangayCrimeCounts[name] ?? 0;
    const level = getThreatLevel(name);
    const matchingHover = hoverStats && hoveredBarangay?.toUpperCase() === normalizedName;
    const countLabel = matchingHover
      ? `${hoverStats.totalIncidents} incidents · ${hoverStats.totalOffenses} offenses`
      : `${count} incidents · offenses loading…`;
    return `<div class="map-tip">
      <p class="map-tip__label">Barangay</p>
      <p class="map-tip__name">${name}</p>
      <div class="map-tip__row">
        <span class="map-tip__dot" style="background:${threatColors[level]}"></span>
        <span>${level} (${countLabel})</span>
      </div>
    </div>`;
  }

  React.useEffect(() => {
    if (!hoveredBarangay) return;
    const entry = layerRegistryRef.current.get(hoveredBarangay.toLowerCase().trim());
    if (entry) entry.layer.setTooltipContent(getTooltipContent(entry.feature.properties.adm4_en ?? hoveredBarangay));
    // Data and counts control tooltip contents; the function is recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredBarangay, hoverStats, barangayCrimeCounts, thresholds, threatColors, palette, theme]);

  // Applies/clears the hover highlight from wherever hoveredBarangay was set —
  // a direct map hover (via onEachFeature above) or an external one, like a
  // row in the crime-type breakdown list. One place decides what "hovered"
  // looks like, regardless of who reported it.
  React.useEffect(() => {
    const nextKey = hoveredBarangay ? hoveredBarangay.toLowerCase().trim() : null;
    // Match compare's hover treatment: dim the surrounding shapes so the
    // selected barangay's mapped fill and crisp boundary stand out. Reapply
    // each feature's normal style first so leaving the hover restores the map.
    for (const [key, entry] of layerRegistryRef.current) {
      const baseStyle = styleFeature(entry.feature);
      if (nextKey && key !== nextKey) {
        entry.layer.setStyle({
          ...baseStyle,
          opacity: (baseStyle.opacity ?? 1) * 0.45,
          fillOpacity: (baseStyle.fillOpacity ?? 0) * 0.45,
        });
        continue;
      }

      entry.layer.setStyle(baseStyle);
      if (nextKey && key === nextKey) {
        const name = entry.feature.properties.adm4_en ?? hoveredBarangay ?? "";
        const level = getThreatLevel(name);
        entry.layer.setStyle({
          color: highlightBorder,
          weight: 4,
          opacity: 1,
          fillColor: threatColors[level],
          fillOpacity: 0.75,
          dashArray: "",
        });
        entry.layer.bringToFront();
      }
    }

    // styleFeature is intentionally omitted: it's a new function identity every
    // render, so including it would fire this on every render instead of only
    // when the hover actually changes. It's still always the current render's
    // styleFeature via closure — any staleness self-corrects on the next data
    // change anyway, since that remounts the whole layer via the key below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredBarangay, previewThreatLevel, palette, theme, threatColors]);

  const timeRangeKey = `${timeRange.mode}-${timeRange.selections.map(s => `${s.year}_${s.quarter ?? ''}_${s.month ?? ''}_${s.halfYear ?? ''}_${s.day ? new Date(s.day).getTime() : ''}`).join(',')}`;
  const crimeCountsKey = Object.entries(crimeTypeCounts).map(([b, c]) => `${b}:${c}`).join('|');
  const baseCountsKey = Object.entries(barangayCrimeCounts).map(([b, c]) => `${b}:${c}`).join('|');

  // The actual "don't render the layer until data is loaded" bail-out — see
  // the skipRender comment above for why this can't happen any earlier.
  if (skipRender) {
    return null;
  }

  return (
    <Pane name="barangay-pane" style={{ zIndex: 450 }}>
      <GeoJSON
        key={`${palette}-${theme}-${selectedBarangay}-${hoveredThreatLevel}-${hotspotMonth}-${hotspotYear}-${loading}-${crimeTypeLoading}-${isTimeFilterActive}-${timeFilterDate?.getTime()}-${timeFilterHour}-${selectedCrimeType}-${selectedFelonyStage}-${timeRangeKey}-${crimeCountsKey}-${baseCountsKey}-${thresholds.low}-${thresholds.moderate}-${thresholds.high}-${thresholds.critical}`}
        data={data}
        style={getPathStyle}
        onEachFeature={onEachFeature}
      />
    </Pane>
  );
};

export default TanzaBarangayLayer;
