document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("regional-alerts");
    if (!container) return;

    container.innerHTML = REGIONS.map(function (region) {
        const level = getLevel(region.t);
        const message = level.key === "severe"
            ? "Extreme heat conditions may pose significant health risks."
            : level.key === "warning"
            ? "High temperatures require additional precautions."
            : level.key === "watch"
            ? "Elevated temperatures are being monitored."
            : "No significant heatwave conditions are detected in this sample view.";
        return '<article class="alerts-card alerts-' + level.className + '">' +
            '<h3>' + region.name + '</h3>' +
            '<div class="alerts-label">Regional maximum</div>' +
            '<div class="alerts-temp">' + region.t + '°C</div>' +
            badge(region.t) +
            '<p>' + message + '</p></article>';
    }).join("");
});
