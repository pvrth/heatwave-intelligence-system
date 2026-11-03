let sortKey = "t";
let asc = false;

function drawTable() {
    const rows = REGIONS.slice().sort(function (a, b) {
        if (a[sortKey] > b[sortKey]) return asc ? 1 : -1;
        if (a[sortKey] < b[sortKey]) return asc ? -1 : 1;
        return 0;
    });

    document.querySelector("#tbl tbody").innerHTML = rows.map(function (region) {
        return '<tr><td>' + region.name + '</td><td>' + region.t + '°C</td><td>' + badge(region.t) + '</td></tr>';
    }).join("");
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("th.sort").forEach(function (th) {
        th.addEventListener("click", function () {
            const key = th.dataset.k;
            if (key === sortKey) asc = !asc;
            else { sortKey = key; asc = true; }
            drawTable();
        });
    });
    drawTable();
});
