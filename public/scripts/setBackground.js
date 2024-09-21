if (navigator.geolocation) {
    setInterval(() => {
        navigator.geolocation.getCurrentPosition(async position => {
            try {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const response = await fetch(`/route/${longitude},${latitude}`, { method: 'POST' });
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
            } catch (error) { pass }
        }, error => { 
            console.error('Geolocation error:', error); 
        }, {
            enableHighAccuracy: true,
            maximumAge: 0
        });
    }, 20000);
} else {
    alert("Geolocation is not supported by this browser.");
}
