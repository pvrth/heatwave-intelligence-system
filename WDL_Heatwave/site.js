$(function () {
    const COLLAPSE_KEY = "his-sidebar-collapsed";

    $(".current-year").text(new Date().getFullYear());

    function setSidebarState(collapsed) {
        $("body").toggleClass("sidebar-collapsed", collapsed);
        $("#sidebar-toggle").attr("aria-expanded", String(!collapsed));
        $("#sidebar-toggle .toggle-label").text(collapsed ? "Expand sidebar" : "Collapse sidebar");
        $("#sidebar-toggle .toggle-icon").text(collapsed ? "›" : "‹");
        try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch (e) {}
    }

    let savedCollapsed = false;
    try { savedCollapsed = localStorage.getItem(COLLAPSE_KEY) === "1"; } catch (e) {}
    setSidebarState(savedCollapsed);

    $("#sidebar-toggle").on("click", function () {
        setSidebarState(!$('body').hasClass("sidebar-collapsed"));
    });
    $(".sidebar nav a").on("click", function () {
        if (window.innerWidth <= 820) setSidebarState(false);
    });

    if ($("#status-time").length) {
        function updateClock() {
            $("#status-time").text(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    $("#dismiss-alert").on("click", function () {
        $(".status-banner").fadeOut(250);
    });

    function updateHighestTemperature() {
        const output = $("#highest-temp");
        if (!output.length) return;
        let max = null;
        $("#forecast-table tbody tr:visible").each(function () {
            const value = parseFloat($(this).find("td").eq(2).text());
            if (!Number.isNaN(value) && (max === null || value > max)) max = value;
        });
        output.text(max === null ? "No data" : max + "°C");
    }

    $("#forecast-filter").on("change", function () {
        const selected = $(this).val();
        $("#forecast-table tbody tr").each(function () {
            const region = $(this).find("td:first").text().trim().toLowerCase();
            $(this).toggle(selected === "all" || region === selected);
        });
        updateHighestTemperature();
    });
    updateHighestTemperature();

    $("#subscribe-form").on("submit", function (event) {
        event.preventDefault();
        const form = this;
        const message = $("#form-message");
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if ($('input[name="calerts"]:checked').length === 0) {
            message.text("Please select at least one alert type.").removeClass("success").addClass("error").hide().fadeIn(200);
            return;
        }
        const name = $("#cname").val().trim();
        message.text("Thank you, " + name + "! Your advisory preferences have been saved for this demo.").removeClass("error").addClass("success").hide().fadeIn(200);
    });

    $("#subscribe-form").on("reset", function () {
        $("#form-message").text("").removeClass("success error");
    });

    $("main").hide().fadeIn(320);
});
