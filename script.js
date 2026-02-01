// ================= URL SERVER =================
const API = "https://ahli-gizi.biz.id/";


// ================= HITUNG IMT =================
function calculateBMI(){

    const name   = document.getElementById("name").value.trim();
    const stage  = document.getElementById("ageStage").value;
    const age    = Number(document.getElementById("age").value);
    const weight = Number(document.getElementById("weight").value);
    const height = Number(document.getElementById("height").value);

    if(!name||!stage||!age||!weight||!height){
        alert("Lengkapi semua data!");
        return;
    }

    const today = new Date();
    const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli",
                   "Agustus","September","Oktober","November","Desember"];

    const tanggal =
        today.getDate()+" "+
        bulan[today.getMonth()]+" "+
        today.getFullYear();


    document.getElementById("gizi_age").value    = age;
    document.getElementById("gizi_weight").value = weight;
    document.getElementById("gizi_height").value = height;


    const h = height/100;
    const bmi = weight/(h*h);


    let status="";
    let saran="";

    if(bmi<18.5){
        status="Underweight";
        saran="Konsultasi ke ahli gizi";
    }
    else if(bmi<23) status="Normal";
    else if(bmi<25) status="Overweight";
    else if(bmi<30) status="Obesitas I";
    else status="Obesitas II";


    let energi =
    655+(9.6*weight)+(1.8*height)-(4.7*age);

    energi*=1.2;


    document.getElementById("result").style.display="block";

    document.getElementById("result").innerHTML=`
    <h3>Hasil IMT</h3>
    <p>Nama: ${name}</p>
    <p>Tanggal: ${tanggal}</p>
    <p>IMT: ${bmi.toFixed(2)}</p>
    <p>Status: ${status}</p>
    <p>Energi: ${energi.toFixed(0)} kkal</p>
    ${saran?`<p style="color:red">${saran}</p>`:""}
    `;


    drawChart(bmi);


    simpanData(
        name,tanggal,stage,age,
        weight,height,bmi,status
    );
}



// ================= SIMPAN =================
function simpanData(nama,tgl,tahap,usia,bb,tb,bmi,status){

    const data={
        nama:nama,
        tanggal:tgl,
        tahap:tahap,
        usia:usia,
        bb:bb,
        tb:tb,
        imt:bmi,
        status:status
    };


    fetch(API+"save.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    .then(()=>tampilData());
}



// ================= TAMPIL =================
function tampilData(){

    fetch(API+"get.php")
    .then(r=>r.json())
    .then(data=>{

        const tbody=
        document.querySelector("#dataTable tbody");

        tbody.innerHTML="";

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
    });
}



// ================= RESET =================
function resetData(){

    const pass=prompt("Password admin:");

    if(pass!=="cihuy"){
        alert("Salah!");
        return;
    }

    fetch(API+"reset.php")
    .then(()=>{
        alert("Reset sukses");
        tampilData();
    });
}



// ================= SEARCH =================
function searchPasien(){

    const key=
    document.getElementById("searchInput")
    .value.toLowerCase();

    const rows=
    document.getElementById("dataTable").rows;

    for(let i=1;i<rows.length;i++){

        rows[i].style.display=
        rows[i].innerText.toLowerCase()
        .includes(key)
        ?"":"none";
    }
}



// ================= GRAFIK =================
function drawChart(bmi){

    const c=document.getElementById("bmiChart");
    if(!c)return;

    const ctx=c.getContext("2d");

    c.width=500;
    c.height=230;
    c.style.display="block";

    ctx.clearRect(0,0,c.width,c.height);


    const data=[
        {l:"Under",c:"#03a9f4"},
        {l:"Normal",c:"#4caf50"},
        {l:"Over",c:"#ffc107"},
        {l:"Obs I",c:"#ff9800"},
        {l:"Obs II",c:"#f44336"}
    ];

    const w=80,h=50,x=20,y=160;


    data.forEach((d,i)=>{

        ctx.fillStyle=d.c;
        ctx.fillRect(x+i*(w+10),y-h,w,h);

        ctx.fillStyle="#000";
        ctx.textAlign="center";

        ctx.fillText(
            d.l,
            x+i*(w+10)+w/2,
            y+20
        );
    });


    let pos=(bmi/40)*(c.width-40)+20;

    if(pos<20)pos=20;
    if(pos>c.width-20)pos=c.width-20;


    ctx.fillStyle="#000";

    ctx.beginPath();
    ctx.moveTo(pos,y-70);
    ctx.lineTo(pos-6,y-55);
    ctx.lineTo(pos+6,y-55);
    ctx.closePath();
    ctx.fill();


    ctx.fillText(
        "IMT "+bmi.toFixed(1),
        pos,
        y-80
    );
}



// ================= LOAD =================
window.onload=tampilData;
