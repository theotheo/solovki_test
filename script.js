let lastPos = { latitude: 91, longitude: 181 };
const NEAR = 0.23

window.onload = () => {
    let state = 0,
        lastTime = 0,
        places = staticLoadPlaces();
    // renderPlaces(places);

    navigator.geolocation.getCurrentPosition((pos) => {
        // alert(pos.coords.longitude)
        lastPos = { longitude: pos.coords.longitude, latitude: pos.coords.latitude }
        renderHUD({ longitude: pos.coords.longitude, latitude: pos.coords.latitude })
    });

    id = navigator.geolocation.watchPosition((pos) => {
        // if (pos.coords) {
        // alert('!!!!!' + JSON.stringify(pos.coords.latitude))
        // const curTime = new Date().getTime();
        lastPos = { longitude: pos.coords.longitude, latitude: pos.coords.latitude }

        renderPlaces(places)
            // renderHUD({ longitude: pos.coords.longitude, latitude: pos.coords.latitude })

    }, (err) => {

    }, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    })


    // window.addEventListener('gps-camera-update-position', async(e) => {
    //     const curTime = new Date().getTime();
    //     console.log(e.detail)
    //     renderHUD(e.detail.position)
    //     if (curTime - lastTime > 5000 &&
    //         jsfreemaplib.haversineDist(
    //             e.detail.position.longitude,
    //             e.detail.position.latitude,
    //             lastPos.longitude,
    //             lastPos.latitude) > 10) {
    //         lastTime = curTime;
    //         lastPos.latitude = e.detail.position.latitude;
    //         lastPos.longitude = e.detail.position.longitude;
    //         hikarElement.setAttribute('lon', e.detail.position.longitude);
    //         hikarElement.setAttribute('lat', e.detail.position.latitude);
    //     }
    // });
}

function haversineDistance(coords1, coords2, isMiles) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if (isMiles) d /= 1.60934;

    return d;
}

function staticLoadPlaces() {
    return [{
            name: "Your place name",
            location: {
                lat: 65.022363, // add here latitude if using static data
                lng: 35.703792, // add here longitude if using static data
            }
        },
        {
            name: 'Another place name',
            location: {
                lat: 65.022363,
                lng: 35.704795,
            }
        }
    ];
}

function renderHUD(pos) {
    let el = document.querySelector('#hud');
    var template = document.getElementById('hud-template').innerHTML;
    var render = Handlebars.compile(template);
    let l = render({...pos })
        // alert(l)
    el.innerHTML = l
}

function renderDIST(pos, dists) {
    let el = document.querySelector('#hud');
    var template = document.getElementById('hud-template').innerHTML;
    var render = Handlebars.compile(template);
    let l = render({...pos })
        // alert(l)
    el.innerHTML = l + ` ${dists[0]}, ${dists[1]}`
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    var template = document.getElementById('places-template').innerHTML;
    var renderPlaces = Handlebars.compile(template);
    let dists = []
    places = places.map((place) => {
        let dist = haversineDistance([place.location.lng, place.location.lat], [lastPos.longitude, lastPos.latitude])
        dist = parseFloat(dist.toFixed(4))
        let isFar = dist < NEAR
        dists.push(dist)
        return {...place, dist, isFar }
    })
    renderDIST(lastPos, dists)


    // alert(JSON.stringify(places))
    var html = renderPlaces({
        places: places,
    });

    var el = document.getElementsByTagName('a-camera')[0];
    console.log(el)
    console.log(html)
    el.insertAdjacentHTML('beforebegin', html);
}
//     places.forEach((place) => {
//         console.log(place)


//         scene.appendChild(icon);

//     }

// var source = document.getElementById('text-template').innerHTML;
//             var template = Handlebars.compile(source);
//             var context = {
//                 first_name: fname,
//                 last_name: lname
//             };
//             var html = template(context);

//             document.getElementById('result').innerHTML = html;