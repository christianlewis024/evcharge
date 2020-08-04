import React, { useState, useEffect, useRef } from "react";
import MapGL, { Marker, Popup } from "react-map-gl";

import * as evcDate from "./data/evstations.json";
import Geocoder from "react-map-gl-geocoder";
import DeckGL, { GeoJsonLayer } from "deck.gl";

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 2,
  });

  const [searchResultLayer, setSearchResultsLayer] = useState(null);
  const mapRef = useRef();

  const handleOnResult = (event) => {
    console.log(event.result);
    setSearchResultsLayer(
      new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      })
    );
  };
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedStation(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/christianlewis/ckdg36i5j11x41iqr21ihmff5"
      >
        {evcDate.features.map((station) => (
          <Marker
            key={station.ID}
            latitude={station.AddressInfo.Latitude}
            longitude={station.AddressInfo.Longitude}
          >
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setSelectedStation(station);
              }}
            >
              <img
                src="/icons8-car-battery-64.png"
                alt="charging battery icon"
                width="15px"
                height="15px"
              />
            </button>
          </Marker>
        ))}
        {selectedStation ? (
          <Popup
            latitude={selectedStation.AddressInfo.Latitude}
            longitude={selectedStation.AddressInfo.Longitude}
            onClose={() => {
              setSelectedStation(null);
            }}
          >
            <div>
              Charging Station:
              <h2>{selectedStation.AddressInfo.Title}</h2>
              <p>{selectedStation.AddressInfo.Town}</p>
              <p>Last Verified:{selectedStation.DateLastVerified}</p>
              <p>Power:{selectedStation.PowerKW}</p>
            </div>
          </Popup>
        ) : null}
        <Geocoder
          mapRef={mapRef}
          onResult={handleOnResult}
          onViewportChange={(viewport) => {
            setViewport(viewport);
          }}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="top-left"
        />
      </MapGL>
    </div>
  );
}
