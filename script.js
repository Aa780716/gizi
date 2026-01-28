
// ================= HITUNG IMT =================
function calculateBMI() {

    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);

    if (!age || !weight || !heightCm) {
        alert("Lengkapi data IMT!");
        return;
    }

    // Auto isi ke form Gizi
    document.getElementById("gizi_age").value = age;
    document.getElementById("gizi_weight").value = weight;
    document.getElementById("gizi_height").value = heightCm;


    // Hitung IMT
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    let status = "";

if (bmi < 18.5) status = "Underweight";
else if (bmi < 23) status = "Normal";
else if (bmi < 25) status = "Overweight";
else if (bmi < 30) status = "Obesitas I";
else status = "Obesitas II";


    document.getElementById("result").style.display = "block";

    document.getElementById("result").innerHTML = `
        <h3>Hasil IMT</h3>
        <p><b>IMT:</b> ${bmi.toFixed(2)}</p>
        <p><b>Status:</b> ${status}</p>
    `;

    drawChart(bmi);
}



// ================= HITUNG GIZI =================
function calculateGizi() {

    const age = parseInt(document.getElementById("gizi_age").value);
    const weight = parseFloat(document.getElementById("gizi_weight").value);
    const height = parseFloat(document.getElementById("gizi_height").value);
    const trimester = parseInt(document.getElementById("trimester").value);

    if (!age || !weight || !height) {
        alert("Hitung IMT dulu!");
        return;
    }

    // Energi dasar
    let energi = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    energi *= 1.2;


    // Tambahan trimester
    let addE = 0;
    let addP = 0;
    let addL = 0;
    let addK = 0;

    if (trimester === 1) {
        addE = 180;
        addP = 20;
        addL = 6;
        addK = 25;
    }
    else if (trimester === 2) {
        addE = 300;
        addP = 20;
        addL = 10;
        addK = 40;
    }
    else if (trimester === 3) {
        addE = 300;
        addP = 20;
        addL = 10;
        addK = 40;
    }


    energi += addE;


    // Hitung zat gizi
    let protein = (0.15 * energi) / 4 + addP;
    let lemak   = (0.25 * energi) / 9 + addL;
    let karbo   = (0.60 * energi) / 4 + addK;


    document.getElementById("giziResult").style.display = "block";

    document.getElementById("giziResult").innerHTML = `
        <h3>Hasil Gizi</h3>

        <p><b>Energi:</b> ${energi.toFixed(0)} kkal / hari</p>
        <p><b>Protein:</b> ${protein.toFixed(1)} gram</p>
        <p><b>Lemak:</b> ${lemak.toFixed(1)} gram</p>
        <p><b>Karbohidrat:</b> ${karbo.toFixed(1)} gram</p>

        <hr>

        <small>
        Tambahan Trimester:
        +${addE} kkal,
        +${addP}g protein,
        +${addL}g lemak,
        +${addK}g karbo
        </small>
    `;
}



// ================= GRAFIK =================
function drawChart(bmi) {

    const canvas = document.getElementById("bmiChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Batas IMT Asia
    const limits = [0, 18.5, 23, 25, 30, 40];

    const labels = [
        "Underweight",
        "Normal",
        "Overweight",
        "Obesitas I",
        "Obesitas II"
    ];

    const colors = [
        "#03a9f4",
        "#4caf50",
        "#ffc107",
        "#ff9800",
        "#f44336"
    ];


    const barWidth = 95;
    const barHeight = 60;
    const baseY = 160;
    const startX = 20;


    // Gambar bar
    for(let i = 0; i < 5; i++){

        ctx.fillStyle = colors[i];

        ctx.fillRect(
            startX + i * (barWidth + 8),
            baseY - barHeight,
            barWidth,
            barHeight
        );

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            labels[i],
            startX + i * (barWidth + 8) + barWidth / 2,
            baseY + 20
        );
    }


    // Hitung posisi panah
    let posX = startX;

    if (bmi < 18.5) {
        posX += (bmi / 18.5) * barWidth;
    }
    else if (bmi < 23) {
        posX += (barWidth + 8) + ((bmi - 18.5) / (23 - 18.5)) * barWidth;
    }
    else if (bmi < 25) {
        posX += 2 * (barWidth + 8) + ((bmi - 23) / (25 - 23)) * barWidth;
    }
    else if (bmi < 30) {
        posX += 3 * (barWidth + 8) + ((bmi - 25) / (30 - 25)) * barWidth;
    }
    else {
        posX += 4 * (barWidth + 8) + ((bmi - 30) / (40 - 30)) * barWidth;
    }


    // Panah
    ctx.fillStyle = "#0b5c9e";

    ctx.beginPath();
    ctx.moveTo(posX, baseY - 80);
    ctx.lineTo(posX - 6, baseY - 60);
    ctx.lineTo(posX + 6, baseY - 60);
    ctx.closePath();
    ctx.fill();


    // Teks
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    ctx.fillText("IMT Anda", posX, baseY - 90);
}
