/**
 * getPlaceData - description
 *
 * @param  {object.<GooglePlace>} place description
 * @return {object.<any>}      returns formatted location data
 */
export default function getPlaceData(place) {
    const data = {
        google_address: place.formatted_address,
        place_id: place.place_id,
    }

    // extract the rest of location data (city, state, zip)
    const components = place.address_components
        .map(component => {
            switch (component.types[0]) {
                case 'street_number':
                    return { street_number: component.long_name }
                case 'route':
                    return { address: component.long_name }
                case 'locality':
                    return { city: component.long_name }
                case 'administrative_area_level_1':
                    return { state: component.long_name }
                case 'postal_code':
                    return { state: component.long_name }
                case 'country':
                    return {
                        country: component.long_name,
                        country_code: component.short_name,
                    }
                default:
                    return
            }
        })
        .reduce((acc, component) => Object.assign(acc, component), {})

    // extract geo location data (lat, lng)
    data.latitude = place.geometry.location.lat()
    data.longitude = place.geometry.location.lng()

    return {
        ...data,
        ...components,
    }
}
