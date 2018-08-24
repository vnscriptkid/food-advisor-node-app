function autocomplete(address, latitude, longitude) {
    if (!address) return;
    const autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        latitude.value = place.geometry.location.lat();
        longitude.value = place.geometry.location.lng();
    });

    address.on('keydown', (e) => {
        if (e.keyCode === 13) e.preventDefault();
    })
}

export default autocomplete;