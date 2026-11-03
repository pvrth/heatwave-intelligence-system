const LEVELS = [
    { key: "normal", label: "Normal", className: "l0", min: -Infinity },
    { key: "watch", label: "Watch", className: "l1", min: 37 },
    { key: "warning", label: "Warning", className: "l2", min: 40 },
    { key: "severe", label: "Severe", className: "l3", min: 45 }
];

const REGIONS = [
    { id: "north", name: "North India", t: 39 },
    { id: "northwest", name: "Northwest India", t: 44 },
    { id: "east", name: "East India", t: 38 },
    { id: "west", name: "West India", t: 36 },
    { id: "central", name: "Central India", t: 42 },
    { id: "northeast", name: "Northeast India", t: 31 },
    { id: "south", name: "Southern Peninsula", t: 35 }
];

const FORECAST_DATA = [
    {
        id: "north",
        name: "North India",
        covers: "Jammu & Kashmir, Ladakh, Himachal Pradesh, Punjab, Haryana, Delhi, Uttarakhand, Uttar Pradesh",
        temps: [39, 41, 43, 44, 45, 43, 40]
    },
    {
        id: "northwest",
        name: "Northwest India",
        covers: "Rajasthan, Gujarat",
        temps: [44, 45, 46, 45, 44, 43, 42]
    },
    {
        id: "central",
        name: "Central India",
        covers: "Madhya Pradesh, Chhattisgarh",
        temps: [42, 43, 44, 45, 44, 42, 41]
    },
    {
        id: "east",
        name: "East India",
        covers: "Bihar, Jharkhand, West Bengal, Odisha",
        temps: [38, 39, 41, 42, 40, 38, 37]
    },
    {
        id: "northeast",
        name: "Northeast India",
        covers: "Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim",
        temps: [31, 32, 33, 32, 34, 33, 31]
    },
    {
        id: "west",
        name: "West India",
        covers: "Maharashtra, Goa",
        temps: [36, 37, 39, 40, 38, 37, 35]
    },
    {
        id: "south",
        name: "Southern Peninsula",
        covers: "Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, Kerala",
        temps: [35, 36, 38, 39, 37, 36, 34]
    }
];

const OPERATIONAL_FORECAST = [
    { region: "North Zone", station: "Delhi AWS-01", max: 47, departure: "+7.0°C", severity: "Severe Heatwave", severityClass: "severity-severe" },
    { region: "North Zone", station: "Chandigarh AWS-04", max: 44, departure: "+5.0°C", severity: "Heatwave", severityClass: "severity-heatwave" },
    { region: "Central Zone", station: "Nagpur AWS-11", max: 42, departure: "+4.0°C", severity: "Heatwave", severityClass: "severity-heatwave" },
    { region: "Central Zone", station: "Bhopal AWS-09", max: 38, departure: "+1.5°C", severity: "Normal", severityClass: "severity-normal" }
];

const HOTSPOT_REGIONS = {
    north: {
        name: "North India", temperature: 45, level: "Severe", className: "l3", color: "#ef4444",
        message: "Severe heat across the northern plains. Avoid unnecessary afternoon exposure and follow official heat-health guidance."
    },
    himalaya: {
        name: "Himalayan Region", temperature: 27, level: "Normal", className: "l0", color: "#10b981",
        message: "Mountain areas remain substantially cooler than the plains. No heatwave conditions are indicated in this demo view."
    },
    south: {
        name: "South India", temperature: 38, level: "Watch", className: "l1", color: "#f59e0b",
        message: "Elevated temperatures are being monitored. Stay hydrated and reduce prolonged midday exposure."
    },
    east: {
        name: "East India", temperature: 41, level: "Warning", className: "l2", color: "#f97316",
        message: "High heat conditions are present. Communities should follow heat-health guidance and monitor local alerts."
    },
    west: {
        name: "West India", temperature: 40, level: "Warning", className: "l2", color: "#f97316",
        message: "High heat conditions are present, strongest inland. Limit outdoor activity during the hottest hours."
    },
    central: {
        name: "Central India", temperature: 44, level: "Warning", className: "l2", color: "#f97316",
        message: "Very high temperatures are close to the severe threshold. Strong heat-protection measures are advised."
    },
    northeast: {
        name: "Northeast India", temperature: 31, level: "Normal", className: "l0", color: "#10b981",
        message: "Temperatures remain within the normal range for this monitoring dashboard."
    },
    coastal: {
        name: "Coastal India", temperature: 33, level: "Normal", className: "l0", color: "#10b981",
        message: "Sea breezes keep temperatures lower, although coastal humidity can increase perceived heat."
    }
};

const STATE_REGIONS = {
    "Jammu and Kashmir": "himalaya", "Jammu & Kashmir": "himalaya", "Ladakh": "himalaya",
    "Himachal Pradesh": "himalaya", "Uttarakhand": "himalaya", "Uttaranchal": "himalaya",
    "Punjab": "north", "Chandigarh": "north", "Haryana": "north", "Delhi": "north",
    "Rajasthan": "north", "Uttar Pradesh": "north",
    "Bihar": "east", "Jharkhand": "east", "Odisha": "east", "Orissa": "east", "West Bengal": "east",
    "Gujarat": "west", "Maharashtra": "west", "Goa": "west",
    "Madhya Pradesh": "central", "Chhattisgarh": "central",
    "Telangana": "south", "Andhra Pradesh": "south", "Karnataka": "south", "Tamil Nadu": "south", "Kerala": "south",
    "Assam": "northeast", "Arunachal Pradesh": "northeast", "Nagaland": "northeast", "Manipur": "northeast",
    "Mizoram": "northeast", "Tripura": "northeast", "Meghalaya": "northeast", "Sikkim": "northeast",
    "Dadra and Nagar Haveli and Daman and Diu": "coastal", "Puducherry": "coastal", "Lakshadweep": "coastal",
    "Andaman and Nicobar Islands": "coastal", "Dadra and Nagar Haveli": "coastal", "Daman and Diu": "coastal",
    "Andaman and Nicobar": "coastal"
};

function getLevel(temp) {
    return LEVELS.find(function (level) { return temp >= level.min; }) || LEVELS[0];
}

function badge(level) {
    const item = typeof level === "number" ? LEVELS[level] : getLevel(level);
    return '<span class="badge ' + item.className + '">' + item.label + '</span>';
}

function levelForRegion(temp) {
    return getLevel(temp);
}
