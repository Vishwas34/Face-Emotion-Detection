let video = document.getElementById('video');
let canvas = document.body.appendChild(document.createElement("canvas"));
let ctx = canvas.getContext('2d');

let width = 720;
let height = 620;

let displaySize = { width, height }; // Define displaySize here

const startStream = () => {
    console.log(".... START STREAM ....");
    navigator.mediaDevices.getUserMedia({
        video: {width, height},
        audio: false
    }).then((stream) => {video.srcObject = stream});
}

console.log(faceapi.nets);
console.log("..... START LOAD MODEL.....");
Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('model'),
    faceapi.nets.faceExpressionNet.loadFromUri('model'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('model'),
    faceapi.nets.tinyFaceDetector.loadFromUri('model'),
]).then(startStream);

async function detect() {
    const detections = await faceapi.detectAllFaces(video)
                  .withFaceLandmarks()
                  .withFaceExpressions()
                  .withAgeAndGender();
                

            
     ctx.clearRect(0, 0, width, height);
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    console.log(resizedDetections);
    resizedDetections.forEach(result => {
        const { age, gender, genderProbability } = result;
        // Do something with age, gender, and genderProbability here
        new faceapi.draw.DrawTextField([
          `${Math.round(age,0)} Tahun`,
          `${gender} ${Math.round(genderProbability)}`
        ],
        result.detection.box.bottomRight
        ).draw(canvas);
    });
}
    

video.addEventListener('play', () => {
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(detect,100);
});
