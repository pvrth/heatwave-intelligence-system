const svg = document.getElementById("indiaMap");
const mapGroup = document.getElementById("mapGroup");
const mapLoading = document.getElementById("mapLoading");
let mapScale = 1, mapX = 0, mapY = 0;

function selectRegion(regionId) {
    const region = HOTSPOT_REGIONS[regionId];
    if (!region) return;
    document.getElementById("selectedRegion").textContent = region.name;
    document.getElementById("selectedTemperature").textContent = region.temperature + "°C";
    document.getElementById("selectedBadge").innerHTML = '<span class="badge ' + region.className + '">' + region.level + '</span>';
    document.getElementById("selectedMessage").textContent = region.message;
    document.getElementById("hotspotInfo").style.borderTopColor = region.color;
    document.querySelectorAll(".region-button").forEach(function(button) {
        button.classList.toggle("active", button.dataset.region === regionId);
    });
}

function createRegionButtons() {
    const container = document.getElementById("regionList");
    Object.keys(HOTSPOT_REGIONS).forEach(function(regionId) {
        const region = HOTSPOT_REGIONS[regionId];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "region-button";
        button.dataset.region = regionId;
        button.style.borderLeftColor = region.color;
        button.innerHTML = '<strong>' + region.name + '</strong><span>' + region.temperature + '°C · ' + region.level + '</span>';
        button.addEventListener("click", function() { selectRegion(regionId); });
        container.appendChild(button);
    });
}

function updateMapTransform() { mapGroup.setAttribute("transform", "translate(" + mapX + " " + mapY + ") scale(" + mapScale + ")"); }

document.getElementById("zoomIn").addEventListener("click", function() { mapScale = Math.min(2.5, mapScale + 0.2); updateMapTransform(); });
document.getElementById("zoomOut").addEventListener("click", function() { mapScale = Math.max(0.7, mapScale - 0.2); updateMapTransform(); });
document.getElementById("resetMap").addEventListener("click", function() { mapScale = 1; mapX = 0; mapY = 0; updateMapTransform(); });

let dragging = false, dragStarted = false, lastX = 0, lastY = 0;
svg.addEventListener("pointerdown", function(event) { dragging = true; dragStarted = false; lastX = event.clientX; lastY = event.clientY; });
svg.addEventListener("pointermove", function(event) {
    if (!dragging) return;
    if (!dragStarted) {
        const distance = Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY);
        if (distance < 5) return;
        dragStarted = true;
        svg.setPointerCapture(event.pointerId);
    }
    mapX += event.clientX - lastX;
    mapY += event.clientY - lastY;
    lastX = event.clientX; lastY = event.clientY;
    updateMapTransform();
});
svg.addEventListener("pointerup", function() { dragging = false; });
svg.addEventListener("pointercancel", function() { dragging = false; });

const INDIA_GEOJSON_URL = "https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states-simplified.geojson";

async function loadIndiaMap() {
    try {
        const response = await fetch(INDIA_GEOJSON_URL);
        if (!response.ok) throw new Error("Could not load map.");
        drawIndiaMap(await response.json());
    } catch (error) {
        console.error(error);
        mapLoading.textContent = "Unable to load the interactive map. Use the regional buttons to inspect the demo data.";
        createRegionButtons();
        selectRegion("north");
    }
}

function drawIndiaMap(geojson) {
    mapGroup.innerHTML = "";
    const features = geojson.features || [];
    if (!features.length) { mapLoading.textContent = "No map data was found."; createRegionButtons(); selectRegion("north"); return; }

    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    function inspect(coordinates) {
        if (typeof coordinates[0] === "number") { minLon = Math.min(minLon, coordinates[0]); maxLon = Math.max(maxLon, coordinates[0]); minLat = Math.min(minLat, coordinates[1]); maxLat = Math.max(maxLat, coordinates[1]); return; }
        coordinates.forEach(inspect);
    }
    features.forEach(function(feature) { if (feature.geometry && feature.geometry.coordinates) inspect(feature.geometry.coordinates); });
    const width = 800, height = 850, padding = 35;
    const geographicWidth = maxLon - minLon, geographicHeight = maxLat - minLat;
    const scaleX = (width - padding * 2) / geographicWidth, scaleY = (height - padding * 2) / geographicHeight, scale = Math.min(scaleX, scaleY);
    function project(coordinate) { return [padding + (coordinate[0] - minLon) * scale, height - padding - (coordinate[1] - minLat) * scale]; }
    function polygonPath(polygon) { return polygon.map(function(ring) { return ring.map(function(coordinate, index) { const point = project(coordinate); return (index === 0 ? "M " : "L ") + point[0] + " " + point[1]; }).join(" ") + " Z"; }).join(" "); }
    features.forEach(function(feature) {
        const geometry = feature.geometry; if (!geometry) return;
        let pathData = "";
        if (geometry.type === "Polygon") pathData = polygonPath(geometry.coordinates);
        if (geometry.type === "MultiPolygon") geometry.coordinates.forEach(function(polygon) { pathData += polygonPath(polygon); });
        if (!pathData) return;
        const properties = feature.properties || {};
        const stateName = properties.name || properties.NAME_1 || properties.State_Name || properties.st_nm || properties.ST_NM || "Unknown";
        const regionId = findRegion(stateName);
        const region = HOTSPOT_REGIONS[regionId];
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData); path.classList.add("state"); path.dataset.state = stateName; path.dataset.region = regionId;
        path.style.fill = region ? region.color : "#d6cabd"; path.setAttribute("tabindex", "0"); path.setAttribute("role", "button"); path.setAttribute("aria-label", stateName);
        path.addEventListener("click", function() { selectRegion(regionId); });
        path.addEventListener("keydown", function(event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRegion(regionId); } });
        mapGroup.appendChild(path);
    });
    mapLoading.style.display = "none";
    selectRegion("north");
}

function findRegion(stateName) {
    if (STATE_REGIONS[stateName]) return STATE_REGIONS[stateName];
    const cleanName = stateName.toLowerCase().replace(/[^a-z]/g, "");
    for (const state in STATE_REGIONS) {
        const cleanState = state.toLowerCase().replace(/[^a-z]/g, "");
        if (cleanName === cleanState) return STATE_REGIONS[state];
    }
    return "central";
}

createRegionButtons();
loadIndiaMap();
