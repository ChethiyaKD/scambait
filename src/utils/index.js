

export function preventScreenshots() {
    // CSS class to blur content
    const style = document.createElement("style");
    style.innerHTML = `
      .blur-overlay {
        filter: blur(10px);
      }
    `;
    document.head.appendChild(style);

    // Function to temporarily blur the screen
    function applyBlur() {
        document.body.classList.add("blur-overlay");
        setTimeout(() => document.body.classList.remove("blur-overlay"), 3000);
    }

    // Detect Print Screen key (PrtSc)
    document.addEventListener("keydown", (e) => {
        if (e.key === "PrintScreen") {
            alert("Screenshots are disabled on this site.");
            document.body.style.visibility = "hidden"; // Temporarily hide content
            setTimeout(() => document.body.style.visibility = "visible", 100);
        }
    });

    // Prevent Developer Tools shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "S"))) {
            e.preventDefault();
            alert("Developer tools are disabled on this site.");
        }
    });

    // Apply blur when certain key combinations are detected
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "S") {
            applyBlur();
            alert("Screenshots are disabled on this site.");
        }
    });

    // Detect visibility change to apply blur
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.body.classList.add("blur-overlay");
        } else {
            setTimeout(() => document.body.classList.remove("blur-overlay"), 1000);
        }
    });

    document.addEventListener("keydown", (event) => {
        const content = document.body // Replace with your content's ID or class
        if (event.key === "Meta" || event.key === "Shift" || event.key === "6" || event.key === "4" || event.key === "5") {
            content.style.filter = "blur(10px)"; // Apply blur when 4, 5, or 6 are pressed
        }
    });
}




export function collectUserData() {
    return new Promise(async resolve => {
        const data = {
            // Device Information
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            os: getOS(),
            deviceType: getDeviceType(),
            screenResolution: `${window.screen.width}x${window.screen.height}`,

            // Network and Location Data
            ip: await getIP(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || navigator.userLanguage,
            location: await getLocation(),

            // Browser and Session Details
            referrer: document.referrer || "Direct",
            cookiesEnabled: navigator.cookieEnabled,
            storageEnabled: isLocalStorageAvailable(),

            // Hardware Details
            memory: navigator.deviceMemory || "Unknown",
            hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",

            // Battery Status (if available)
            battery: await getBatteryInfo(),
        };

        return resolve(data);
    })
}


// Fetch IP Address (using a public API)
async function getIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return "IP fetch failed";
    }
}

// Fetch location 
async function getLocation() {
    const geo = navigator.geolocation;

    return new Promise(async resolve => {
        try {
            const ip = await getIP();
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const locationData = await response.json();

            if (geo) {
                geo.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    locationData.latitude = latitude;
                    locationData.longitude = longitude;
                    locationData.geoLocation = true

                    return resolve({
                        city: locationData.city,
                        country: locationData.country_name,
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        geoLocation: locationData.geoLocation || false
                    });
                });
            } else {
                return resolve({
                    city: locationData.city,
                    country: locationData.country_name,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    geoLocation: false
                });
            }
        } catch (error) {
            return "Location fetch failed";
        }
    })

}

// Fetch battery status if available
async function getBatteryInfo() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        return {
            charging: battery.charging,
            level: `${battery.level * 100}%`,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
        };
    }
    return "Battery info not available";
}



// Helper function to detect OS
function getOS() {
    const platform = navigator.userAgent.toLowerCase();
    if (platform.includes("win")) return "Windows";
    if (platform.includes("mac")) return "MacOS";
    if (platform.includes("android")) return "Android";
    if (platform.includes("linux")) return "Linux";
    if (/iPhone|iPad|iPod/i.test(platform)) return "iOS";
    return "Unknown";
}

// Helper function to detect device type
function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile/i.test(userAgent)) return "Mobile";
    if (/tablet/i.test(userAgent)) return "Tablet";
    return "Desktop";
}

// Check localStorage availability
function isLocalStorageAvailable() {
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
    } catch (e) {
        return false;
    }
}

