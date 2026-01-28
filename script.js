const cdc = {
    male: { 18: { p5: 17.5, p85: 25.0, p95: 29.0 } },
    female: { 18: { p5: 17.0, p85: 24.5, p95: 28.5 } }
};

function calculateBMI() {

    const stage = document.getElementById("ageStage").value;
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);

    if (!weight || !heightCm) {
        alert("Mohon isi berat dan tinggi badan");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const bmiFix = bmi.toFixed(1);

    let status = "Normal";
    let cls = "normal";

    if (stage === "adult") {
        if (bmi < 18.5) { status="Gizi Kurang"; cls="low"; }
        else if (bmi < 25) { status="Normal"; }
        else if (bmi < 30) { status="Gizi Lebih"; cls="over"; }
        else { status="Obesitas"; cls="obese"; }
    } else {
        if (!cdc[gender][age]) {
            alert("Data usia ini belum tersedia");
            return;
        }
        const ref = cdc[gender][age];
        if (bmi < ref.p5) { status="Rendah"; cls="low"; }
        else if (bmi < ref.p85) { status="Sehat"; }
        else if (bmi < ref.p95) { status="Kegemukan"; cls="over"; }
        else { status="Obesitas"; cls="obese"; }
    }

    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = `
        <h3>IMT Anda: ${bmiFix}</h3>
        <span class="badge ${cls}">${status}</span>
        <div class="small">
            Hasil dihitung menggunakan standar WHO & CDC.
        </div>
    `;

    drawChart(bmi);
}

function drawChart(bmi) {
    const canvas = document.getElementById("bmiChart");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ranges = [
        { label: "Kurus", max: 18.5, color: "#00bcd4" },
        { label: "Normal", max: 25, color: "#4caf50" },
        { label: "Gemuk", max: 30, color: "#ffb300" },
        { label: "Obesitas", max: 40, color: "#f44336" }
    ];

    const barWidth = 120;
    const baseY = 160;
    const startX = 40;

    ranges.forEach((r, i) => {
        ctx.fillStyle = r.color;
        ctx.fillRect(startX + i * (barWidth + 10), baseY - 60, barWidth, 60);
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(r.label, startX + i * (barWidth + 10) + barWidth/2, baseY + 20);
    });

    const pos = Math.min(bmi, 40) / 40 * (barWidth * ranges.length + 30);
    ctx.fillStyle = "#0b5c9e";
    ctx.beginPath();
    ctx.moveTo(startX + pos, baseY - 80);
    ctx.lineTo(startX + pos - 6, baseY - 60);
    ctx.lineTo(startX + pos + 6, baseY - 60);
    ctx.closePath();
    ctx.fill();

    ctx.fillText("IMT Anda", startX + pos, baseY - 90);
}
