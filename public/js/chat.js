const socket = io();


// simple conventions
const $FormTagSelector = document.querySelector("#form1");
const $FormInputTagSelector = $FormTagSelector.querySelector("input");
const $SubmitButtonSelector = $FormTagSelector.querySelector("button");
const $SendLocationButton = document.querySelector("#location");


// for message-container
const $MessageContainer = document.querySelector("#message-container");
const $MessageTemplate = document.querySelector("#message-template").innerHTML;




// getting the welcome message from server
socket.on('welcome_message', (data) => {
    console.log(data.message, data.createdAt);
})


// sending message to everyone by one user - cooooooool
$FormTagSelector.addEventListener("submit", function (e) {
    e.preventDefault();
    if ($FormInputTagSelector.value === "") {
        return false;
    }

    // jab message send ho raha ho to disabling the submit button
    $SubmitButtonSelector.innerHTML = "Sending...";
    $SubmitButtonSelector.setAttribute("disabled", "disabled");


    socket.emit("sendMessage", $FormInputTagSelector.value, (callback_message) => {
        // enabling the button once submission completed

        $SubmitButtonSelector.removeAttribute("disabled");
        $SubmitButtonSelector.innerHTML = "Send";
        $FormInputTagSelector.value = "";
        $FormInputTagSelector.focus();
        console.log("Message Successfully delivered", callback_message);
    });
})

// any message comiing from the server
socket.on("message", (message) => {
    const html = Mustache.render($MessageTemplate, {
        messagetext: message.message,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $MessageContainer.insertAdjacentHTML('beforeend', html);
    console.log(message);
})




// event that accept the sharelocation data

socket.on("share_location_server", (message) => {

    const html = Mustache.render(document.querySelector("#share_location").innerHTML, {
        location_link: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    $MessageContainer.insertAdjacentHTML('beforeend', html);

    console.log(message);
})


// let's share the location with everyone in the room

$SendLocationButton.addEventListener('click', function () {
    if (!navigator.geolocation) {
        return alert("GeoLocation service is not avalable for this browser.");
    }
    $SendLocationButton.innerHTML = "sending Location...";
    $SendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        console.log("Latitude = ", position.coords.latitude);
        console.log("Longitude = ", position.coords.longitude);


        socket.emit("share_location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $SendLocationButton.removeAttribute("disabled");
            $SendLocationButton.innerHTML = "send Location";
            console.log("Location has been shared.");
        });

    })
})







// socket.on('updated_data', (count) => {
//     console.log("cnnection has been updated to : ", count);
// })

// socket.on('updated_string', (string1) => {
//     textarea1.value = string1;
// })

// document.addEventListener('DOMContentLoaded', init);
// function init() {
//     let x = document.getElementById('increment');
//     x.addEventListener('click', function () {
//         //console.log("Button clicked");
//         socket.emit('update_count');
//     })

//     // for textarea
//     let textarea1 = document.querySelector("#textarea1");
//     textarea1.addEventListener('keydown', function (e) {
//         //console.log(e.key);
//         socket.emit('text_data', e.key);
//     })

// }