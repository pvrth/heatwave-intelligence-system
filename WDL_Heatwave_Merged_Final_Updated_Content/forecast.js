document.addEventListener("DOMContentLoaded", function () {
    const regionSelect = document.getElementById("region-select");
    const coversText = document.getElementById("region-covers");
    const grid = document.getElementById("forecast-grid");
    const summary = document.getElementById("forecast-summary");
    const tbody = document.querySelector("#forecast-table tbody");

    FORECAST_DATA.forEach(function (region) {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.name;
        regionSelect.appendChild(option);
    });

    OPERATIONAL_FORECAST.forEach(function (row) {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td>' + row.region + '</td><td>' + row.station + '</td><td>' + row.max + '°C</td><td>' + row.departure + '</td><td class="' + row.severityClass + '">' + row.severity + '</td>';
        tbody.appendChild(tr);
    });

    function updateHighestTemperature() {
        const visible = Array.from(tbody.querySelectorAll("tr")).filter(function (row) { return row.style.display !== "none"; });
        const values = visible.map(function (row) { return parseFloat(row.children[2].textContent); }).filter(function (value) { return !Number.isNaN(value); });
        document.getElementById("highest-temp").textContent = values.length ? Math.max.apply(null, values) + "°C" : "No data";
    }

    updateHighestTemperature();

    function dayLabel(index) { return index === 0 ? "Today" : "Day " + (index + 1); }

    function renderForecast(regionId) {
        const region = FORECAST_DATA.find(function (item) { return item.id === regionId; });
        if (!region) return;
        coversText.textContent = "Covers: " + region.covers;
        grid.innerHTML = region.temps.map(function (temp, index) {
            const level = getLevel(temp);
            return '<article class="forecast-card"><p class="forecast-day">' + dayLabel(index) + '</p><p class="forecast-temp">' + temp + '°C</p><span class="forecast-pill level-' + level.key + '">' + level.label + '</span></article>';
        }).join("");

        const peak = Math.max.apply(null, region.temps);
        const peakIndex = region.temps.indexOf(peak);
        const hotDays = region.temps.filter(function (temp) { return temp >= 40; }).length;
        summary.innerHTML = '<p>Peak of <strong>' + peak + '°C</strong> expected ' + (peakIndex === 0 ? 'today' : 'on <strong>' + dayLabel(peakIndex) + '</strong>') + '.</p>' +
            '<p>' + (hotDays === 0 ? 'No days are at Warning level this week.' : hotDays + ' of ' + region.temps.length + ' days are at Warning level or above.') + ' Check the <a href="alerts.html">advisories</a> and <a href="subscribe.html">subscribe</a> for updates.</p>';
    }

    regionSelect.addEventListener("change", function () { renderForecast(regionSelect.value); });
    renderForecast(regionSelect.value);
});
