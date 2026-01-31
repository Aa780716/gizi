
// ================= HITUNG IMT =================
function calculateBMI(){

    const name = document.getElementById("name").value.trim();
    const stage = document.getElementById("ageStage").value;
    const age = Number(document.getElementById("age").value);
    const weight = Number(document.getElementById("weight").value);
    const height = Number(document.getElementById("height").value);

    if(!name || !stage || !age || !weight || !height){
        alert("Lengkapi semua data!");
        return;
    }


    // ================= TANGGAL =================
    const today = new Date();

    const bulan = [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
    ];

    const tanggal =
        today.getDate() + " " +
        bulan[today.getMonth()] + " " +
        today.getFullYear();


    // Auto isi Gizi
    document.getElementById("gizi_age").value = age;
    document.getElementById("gizi_weight").value = weight;
    document.getElementById("gizi_height").value = height;


    // ================= BMI =================
    const h = height / 100;
    const bmi = weight / (h*h);


    let status = "";
    let saran = "";

    if(bmi < 18.5){
        status = "Underweight";
        saran = "Konsultasi ke ahli gizi/faskes terdekat";
    }
    else if(bmi < 23){
        status = "Normal";
    }
    else if(bmi < 25){
        status = "Overweight";
    }
    else if(bmi < 30){
        status = "Obesitas I";
    }
    else{
        status = "Obesitas II";
    }


    // ================= ENERGI =================
    let energi =
        655 +
        (9.6 * weight) +
        (1.8 * height) -
        (4.7 * age);

    energi *= 1.2;


    localStorage.setItem("energiDasar", energi);
    localStorage.removeItem("hasilGizi");


    document.getElementById("result").style.display = "block";

    document.getElementById("result").innerHTML = `
        <h3>Hasil IMT</h3>

        <p><b>Nama:</b> ${name}</p>
        <p><b>Tanggal:</b> ${tanggal}</p>
        <p><b>IMT:</b> ${bmi.toFixed(2)}</p>
        <p><b>Status:</b> ${status}</p>
        <p><b>Tahapan:</b> ${stage}</p>
        <p><b>Energi:</b> ${energi.toFixed(0)} kkal</p>

        ${saran ? `<p style="color:red;"><b>${saran}</b></p>` : ""}
    `;


    drawChart(bmi);

    simpanData(
        name,
        tanggal,
        stage,
        age,
        weight,
        height,
        bmi,
        status
    );
}



// ================= HITUNG GIZI =================
function calculateGizi(){

    const t = Number(document.getElementById("trimester").value);

    let energi = localStorage.getItem("energiDasar");

    if(!energi){
        alert("Hitung IMT dulu!");
        return;
    }

    energi = Number(energi);


    let e=0,p=0,l=0,k=0;

    if(t===1){
        e=180;p=20;l=6;k=25;
    }
    else if(t===2){
        e=300;p=20;l=10;k=40;
    }
    else if(t===3){
        e=300;p=20;l=10;k=40;
    }


    let total = energi + e;


    let protein = (0.15*total)/4 + p;
    let lemak   = (0.25*total)/9 + l;
    let karbo   = (0.60*total)/4 + k;


    const hasil = {
        trimester:t,
        energiDasar:energi,
        tambahan:e,
        total:total,
        protein:protein,
        lemak:lemak,
        karbo:karbo
    };

    localStorage.setItem("hasilGizi",JSON.stringify(hasil));


    document.getElementById("giziResult").style.display="block";

    document.getElementById("giziResult").innerHTML=`
        <h3>Hasil Gizi</h3>

        <p>Energi Dasar: ${energi.toFixed(0)} kkal</p>
        <p>Tambahan: +${e} kkal</p>

        <hr>

        <p>Total: ${total.toFixed(0)} kkal</p>
        <p>Protein: ${protein.toFixed(1)} g</p>
        <p>Lemak: ${lemak.toFixed(1)} g</p>
        <p>Karbo: ${karbo.toFixed(1)} g</p>
    `;
}



// ================= SIMPAN DATA =================
function simpanData(nama,tgl,tahap,usia,bb,tb,bmi,status){

    let data = localStorage.getItem("dataPasien");

    if(!data){
        data=[];
    }else{
        data=JSON.parse(data);
    }


    data.push({
        nama:nama,
        tanggal:tgl,
        tahap:tahap,
        usia:usia,
        bb:bb,
        tb:tb,
        imt:bmi.toFixed(2),
        status:status
    });


    localStorage.setItem("dataPasien",JSON.stringify(data));

    tampilData();
}



// ================= TAMPIL =================
function tampilData(){

    const tbody =
        document
        .getElementById("dataTable")
        .querySelector("tbody");

    tbody.innerHTML="";


    let data=localStorage.getItem("dataPasien");

    if(!data)return;

    data=JSON.parse(data);


    data.forEach((p,i)=>{

        const tr=document.createElement("tr");

        tr.innerHTML=`
            <td>${i+1}</td>
            <td>${p.nama}</td>
            <td>${p.tanggal}</td>
            <td>${p.tahap}</td>
            <td>${p.usia}</td>
            <td>${p.bb}</td>
            <td>${p.tb}</td>
            <td>${p.imt}</td>
            <td>${p.status}</td>

            <td>
                <button onclick="downloadPDFSingle(${i})">
                    PDF
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}



// ================= SEARCH =================
function searchPasien(){

    const key=
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();


    const rows=
        document
        .getElementById("dataTable")
        .rows;


    for(let i=1;i<rows.length;i++){

        if(rows[i].innerText.toLowerCase().includes(key)){
            rows[i].style.display="";
        }else{
            rows[i].style.display="none";
        }
    }
}



// ================= PDF =================
function downloadPDFSingle(index){

    if(!window.jspdf){
        alert("Library PDF belum dimuat!");
        return;
    }


    const {jsPDF}=window.jspdf;


    let data=localStorage.getItem("dataPasien");

    if(!data){
        alert("Data kosong!");
        return;
    }


    data=JSON.parse(data);

    if(!data[index]){
        alert("Data tidak ada!");
        return;
    }


    const p=data[index];

    let gizi=localStorage.getItem("hasilGizi");

    if(gizi)gizi=JSON.parse(gizi);


    const doc=new jsPDF();

    let y=20;


    doc.setFontSize(16);
    doc.text("Laporan Pasien",14,y);

    y+=15;

    doc.setFontSize(12);


    doc.text(`No: ${index+1}`,14,y);y+=8;
    doc.text(`Nama: ${p.nama}`,14,y);y+=8;
    doc.text(`Tanggal: ${p.tanggal}`,14,y);y+=8;
    doc.text(`Tahap: ${p.tahap}`,14,y);y+=8;
    doc.text(`Usia: ${p.usia}`,14,y);y+=8;
    doc.text(`BB: ${p.bb} kg`,14,y);y+=8;
    doc.text(`TB: ${p.tb} cm`,14,y);y+=8;
    doc.text(`IMT: ${p.imt}`,14,y);y+=8;
    doc.text(`Status: ${p.status}`,14,y);y+=8;


    if(Number(p.imt)<18.5){
        y+=5;
        doc.setTextColor(255,0,0);
        doc.text("Konsultasi ke ahli gizi",14,y);
        doc.setTextColor(0,0,0);
        y+=8;
    }


    if(gizi){

        y+=5;
        doc.text("----------------------",14,y);
        y+=8;

        doc.text("Hasil Gizi",14,y);
        y+=8;

        doc.text(`Trimester: ${gizi.trimester}`,14,y);y+=8;
        doc.text(`Energi: ${gizi.total.toFixed(0)} kkal`,14,y);y+=8;
        doc.text(`Protein: ${gizi.protein.toFixed(1)} g`,14,y);y+=8;
        doc.text(`Lemak: ${gizi.lemak.toFixed(1)} g`,14,y);y+=8;
        doc.text(`Karbo: ${gizi.karbo.toFixed(1)} g`,14,y);y+=8;
    }


    doc.save(`pasien-${index+1}.pdf`);
}



// ================= GRAFIK =================
function drawChart(bmi){

    const c=document.getElementById("bmiChart");

    if(!c)return;

    const ctx=c.getContext("2d");

    c.style.display="block";

    ctx.clearRect(0,0,c.width,c.height);


    const col=["#03a9f4","#4caf50","#ffc107","#ff9800","#f44336"];

    const w=90,h=60,x=20,y=160;


    for(let i=0;i<5;i++){

        ctx.fillStyle=col[i];

        ctx.fillRect(x+i*(w+8),y-h,w,h);

        ctx.fillStyle="#000";
        ctx.textAlign="center";

        ctx.fillText(
            i===0?"Underweight":
            i===1?"Normal":
            i===2?"Overweight":
            i===3?"Obesitas I":"Obesitas II",
            x+i*(w+8)+w/2,
            y+20
        );
    }


    let pos=x;

    if(bmi<18.5)pos+=bmi/18.5*w;
    else if(bmi<23)pos+=(w+8)+(bmi-18.5)/4.5*w;
    else if(bmi<25)pos+=2*(w+8)+(bmi-23)/2*w;
    else if(bmi<30)pos+=3*(w+8)+(bmi-25)/5*w;
    else pos+=4*(w+8)+(bmi-30)/10*w;


    ctx.fillStyle="#0b5c9e";

    ctx.beginPath();

    ctx.moveTo(pos,y-80);
    ctx.lineTo(pos-6,y-60);
    ctx.lineTo(pos+6,y-60);

    ctx.closePath();
    ctx.fill();

    ctx.fillText("IMT",pos,y-90);
}



// ================= LOAD =================
window.onload=function(){
    tampilData();
};

// ================= RESET DATA (ADMIN) =================
function resetData(){

    const pass = prompt("Masukkan password admin:");

    // Kalau klik Cancel
    if(pass === null) return;


    // GANTI password di sini kalau mau
    const adminPassword = "cihuy";


    if(pass !== adminPassword){
        alert("❌ Password salah!");
        return;
    }


    if(confirm("Yakin ingin menghapus SEMUA data pasien?")){

        localStorage.clear();

        alert("✅ Data berhasil direset!");

        location.reload();
    }
}

// ================= AUTO COPYRIGHT YEAR =================
document.addEventListener("DOMContentLoaded", function () {
    const yearEl = document.getElementById("year");
    if(yearEl){
        yearEl.innerText = new Date().getFullYear();
    }
});
