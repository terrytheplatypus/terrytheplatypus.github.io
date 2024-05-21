// Set initial background to black
document.body.style.backgroundColor = "black";

// Create a container for the canvas elements
const canvasContainer = document.createElement("div");
canvasContainer.style.position = "absolute";
canvasContainer.style.left = "0";
canvasContainer.style.top = "0";
canvasContainer.style.width = "100%";
canvasContainer.style.height = "100%";
canvasContainer.style.pointerEvents = "none"; // Make sure the container doesn't block clicks

document.body.appendChild(canvasContainer);

// Create a reverb effect with longer decay time
const reverb = new Tone.Reverb({
    decay: 12, // Longer reverb decay time
}).toDestination();
reverb.generate();

// Set up a loop to play random notes and draw circles every 2 seconds
setInterval(playRandomNoteAndDrawCircle, 2000);

document.addEventListener("click", (event) => {
    // Get the mouse click position
    const x = event.clientX;
    const y = event.clientY;

    // Draw a circle where the user clicked
    drawCircle(x, y);

    // Calculate the note based on the mouse click position
    const noteIndex = Math.floor((x / window.innerWidth) * 14); // Divide the screen into 14 equal parts for 14 notes in C major scale
    const notesInCMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"]; // C major scale starting from C4
    const note = notesInCMajor[noteIndex];

    // Play the calculated note with shorter duration
    playNoteWithReverb(note, "16n");
});

function playRandomNoteAndDrawCircle() {
    // Generate a random position for the circle
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // Draw a circle at the random position with random size
    drawCircle(x, y, Math.random() * 100 + 50); // Random size between 50 and 150

    // Generate a random note from the C major scale in the range of C4 to B5
    const notesInCMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"]; // C major scale starting from C4
    const randomIndex = Math.floor(Math.random() * notesInCMajor.length);
    const randomNote = notesInCMajor[randomIndex];

    // Play the random note with shorter duration
    playNoteWithReverb(randomNote, "16n");
}

function drawCircle(x, y, radius) {
    const canvas = document.createElement("canvas");
    const maxRadius = Math.random() * 100 + 50; // Random maximum circle radius between 50 and 150
    const growthRate = 2; // Rate at which the circle grows

    canvas.width = maxRadius * 2;
    canvas.height = maxRadius * 2;
    canvas.style.position = "absolute";
    canvas.style.left = x - maxRadius + "px";
    canvas.style.top = y - maxRadius + "px";
    canvas.style.pointerEvents = "none"; // Make sure the canvas doesn't block clicks

    const ctx = canvas.getContext("2d");

    // Generate a random RGB color
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

    // Append canvas to the container
    canvasContainer.appendChild(canvas);

    // Increase circle radius over time
    let currentRadius = radius || 10; // Initial circle radius

    function animate() {
        currentRadius += growthRate;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a circle
        ctx.beginPath();
        ctx.arc(maxRadius, maxRadius, Math.min(currentRadius, maxRadius), 0, Math.PI * 2);
        ctx.fillStyle = randomColor;
        ctx.fill();

        if (currentRadius < maxRadius) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function playNoteWithReverb(note, duration) {
    // Create a synth with reverb effect and play the note
    const synth = new Tone.Synth({
        oscillator: {
            type: "sine" // Adjust oscillator type if needed
        },
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 1
        }
    }).connect(reverb);
    synth.triggerAttackRelease(note, duration || "2n"); // Change duration to 16n (shorter note)
}
