
// ================= HITUNG IMT =================
function calculateBMI() {

    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);

    if (!age || !weight || !heightCm) {
        alert("Lengkapi data IMT!");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    let status = "";

    if (bmi < 18.5) status = "Kurus";
    else if (bmi < 25) status = "Normal";
    else if (bmi < 30) status = "Gemuk";
    else status = "Obesitas";

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
        alert("Lengkapi data Gizi!");
        return;
    }

    // ===== ENERGI DASAR =====
    let energi = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    energi *= 1.2;


    // ===== TAMBAHAN TRIMESTER =====
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


    // ===== TOTAL ENERGI =====
    energi += addE;


    // ===== HITUNG ZAT GIZI =====
    let protein = (0.15 * energi) / 4 + addP;
    let lemak   = (0.25 * energi) / 9 + addL;
    let karbo   = (0.60 * energi) / 4 + addK;


    // ===== OUTPUT =====
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

    // Cegah error kalau canvas tidak ketemu
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Tampilkan canvas
    canvas.style.display = "block";

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Data range IMT + warna
    const ranges = [
        { label: "Kurus", max: 18.5, color: "#00bcd4" },   // Biru
        { label: "Normal", max: 25, color: "#4caf50" },   // Hijau
        { label: "Gemuk", max: 30, color: "#ffb300" },    // Kuning
        { label: "Obesitas", max: 40, color: "#f44336" }  // Merah
    ];

    const barWidth = 120;
    const baseY = 160;
    const startX = 40;


    // Gambar bar warna
    for (let i = 0; i < ranges.length; i++) {

        const r = ranges[i];

        ctx.fillStyle = r.color;

        ctx.fillRect(
            startX + i * (barWidth + 10),
            baseY - 60,
            barWidth,
            60
        );

        // Label
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            r.label,
            startX + i * (barWidth + 10) + barWidth / 2,
            baseY + 20
        );
    }


    // Hitung posisi panah
    const maxBMI = 40;
    const totalWidth = barWidth * ranges.length + 30;

    const pos = Math.min(bmi, maxBMI) / maxBMI * totalWidth;


    // Gambar panah penunjuk
    ctx.fillStyle = "#0b5c9e";

    ctx.beginPath();
    ctx.moveTo(startX + pos, baseY - 80);
    ctx.lineTo(startX + pos - 7, baseY - 60);
    ctx.lineTo(startX + pos + 7, baseY - 60);
    ctx.closePath();
    ctx.fill();


    // Teks IMT
    ctx.font = "13px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "IMT Anda",
        startX + pos,
        baseY - 90
    );
}
