let map;

// 🔊 FIXED TEXT-TO-SPEECH
function speak(text) {
    if (!('speechSynthesis' in window)) {
        alert("Speech not supported");
        return;
    }

    let speech = new SpeechSynthesisUtterance(text);

    let voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            let voices = window.speechSynthesis.getVoices();
            speech.voice = voices.find(v => v.lang.includes("en")) || voices[0];
            window.speechSynthesis.speak(speech);
        };
    } else {
        speech.voice = voices.find(v => v.lang.includes("en")) || voices[0];
        window.speechSynthesis.speak(speech);
    }

    speech.lang = "en-IN";
}

// Chatbot
function sendMessage() {
    let input = document.getElementById("userInput").value;

    fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: input})
    })
    .then(res => res.json())
    .then(data => {
        let chatbox = document.getElementById("chatbox");

        chatbox.innerHTML += "<p><b>You:</b> " + input + "</p>";
        chatbox.innerHTML += "<p><b>Bot:</b> " + data.response + "</p>";

        speak(data.response); // 🔊 SPEAK HERE

        document.getElementById("userInput").value = "";
        chatbox.scrollTop = chatbox.scrollHeight;
    });
}

// 🎤 Voice Input
function startVoice() {
    let recognition = new webkitSpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.start();

    recognition.onresult = function(event) {
        let speech = event.results[0][0].transcript;
        document.getElementById("userInput").value = speech;
        sendMessage();
    };
}

// 📍 Map + Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            loadMap(lat, lon);
            sendAlert(lat, lon);
        });
    }
}

function loadMap(lat, lon) {
    let userLocation = { lat: lat, lng: lon };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: userLocation
    });

    new google.maps.Marker({
        position: userLocation,
        map: map
    });

    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch({
        location: userLocation,
        radius: 2000,
        type: ["hospital"]
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            });
        }
    });
}

// 🚑 Call
function callAmbulance() {
    window.location.href = "tel:102";
}

// 🚨 Alert
function sendAlert(lat, lon) {
    fetch("/send_alert", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({location: lat + "," + lon})
    })
    .then(() => {
        alert("🚨 Emergency Alert Sent!");
    });
}