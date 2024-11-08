import React, { useEffect, useState } from "react";
import "./PreLoader3.css";

function PreLoader3() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);
  const [info, setInfo] = useState(null);


  const handleClick = () => {
    //get ip address
    fetch("https://api.ipify.org/?format=json")
      .then((response) => response.json())
      .then((json) => {
        const ip = json.ip;

        //getgeolocation or ip location

        //is geo location available
        const geo = navigator.geolocation;

        if (geo) {
          geo.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
              .then((response) => response.json())
              .then((json) => {
                const { city, country } = json;
                setInfo(`Your IP Address is ${ip.replaceAll('.', 'x')} and you are from ${city}, ${country} :)`);
              });
          });
        } else {
          fetch(`https://ipapi.co/${ip}/json/`)
            .then((response) => response.json())
            .then((json) => {
              const { city, country_name } = json;
              setInfo(`Your IP Address is ${ip.replaceAll('.', 'x')} and you are from ${city}, ${country_name} :)`);
            });
        }
      });



  };

  useEffect(() => {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setData(json);
          // setloading(true);


        });
    }, 2000);
  }, []);

  return (
    <>
      {!completed ? (
        <>
          {!loading ? (
            <div className="spinner">
              <span>Loading...</span>
              <button className="skip-button" onClick={handleClick}>Skip Loading</button>
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
          <h1>Your Data</h1>
        </>
      )}
    </>
  );
}

export default PreLoader3;
