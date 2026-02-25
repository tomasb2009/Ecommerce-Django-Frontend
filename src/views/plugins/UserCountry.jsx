import { useState, useEffect } from "react";

function GetCurrentAddress() {
  const [add, setAdd] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      // Navegador sin geolocalización: simplemente no devolvemos dirección
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(url, {
          headers: {
            Accept: "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Reverse geocoding failed with status ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if (!cancelled) {
              setAdd(data.address || null);
            }
          })
          .catch((error) => {
            // Evitamos que reviente la app si el servicio externo falla o CORS bloquea la petición
            console.warn("Could not fetch current address:", error);
            if (!cancelled) {
              setAdd(null);
            }
          });
      },
      (error) => {
        // Usuario denegó acceso o hubo error de geolocalización
        console.warn("Geolocation error:", error);
        if (!cancelled) {
          setAdd(null);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return add;
}

export default GetCurrentAddress;
