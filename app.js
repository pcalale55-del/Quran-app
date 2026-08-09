const surahs = [
["الفاتحة","مكية",7],["البقرة","مدنية",286],["آل عمران","مدنية",200],["النساء","مدنية",176],["المائدة","مدنية",120],["الأنعام","مكية",165],["الأعراف","مكية",206],["الأنفال","مدنية",75],["التوبة","مدنية",129],["يونس","مكية",109],
["هود","مكية",123],["يوسف","مكية",111],["الرعد","مدنية",43],["إبراهيم","مكية",52],["الحجر","مكية",99],["النحل","مكية",128],["الإسراء","مكية",111],["الكهف","مكية",110],["مريم","مكية",98],["طه","مكية",135],
["الأنبياء","مكية",112],["الحج","مدنية",78],["المؤمنون","مكية",118],["النور","مدنية",64],["الفرقان","مكية",77],["الشعراء","مكية",227],["النمل","مكية",93],["القصص","مكية",88],["العنكبوت","مكية",69],["الروم","مكية",60],
["لقمان","مكية",34],["السجدة","مكية",30],["الأحزاب","مدنية",73],["سبأ","مكية",54],["فاطر","مكية",45],["يس","مكية",83],["الصافات","مكية",182],["ص","مكية",88],["الزمر","مكية",75],["غافر","مكية",85],
["فصلت","مكية",54],["الشورى","مكية",53],["الزخرف","مكية",89],["الدخان","مكية",59],["الجاثية","مكية",37],["الأحقاف","مكية",35],["محمد","مدنية",38],["الفتح","مدنية",29],["الحجرات","مدنية",18],["ق","مكية",45],
["الذاريات","مكية",60],["الطور","مكية",49],["النجم","مكية",62],["القمر","مكية",55],["الرحمن","مدنية",78],["الواقعة","مكية",96],["الحديد","مدنية",29],["المجادلة","مدنية",22],["الحشر","مدنية",24],["الممتحنة","مدنية",13],
["الصف","مدنية",14],["الجمعة","مدنية",11],["المنافقون","مدنية",11],["التغابن","مدنية",18],["الطلاق","مدنية",12],["التحريم","مدنية",12],["الملك","مكية",30],["القلم","مكية",52],["الحاقة","مكية",52],["المعارج","مكية",44],
["نوح","مكية",28],["الجن","مكية",28],["المزمل","مكية",20],["المدثر","مكية",56],["القيامة","مكية",40],["الإنسان","مدنية",31],["المرسلات","مكية",50],["النبأ","مكية",40],["النازعات","مكية",46],["عبس","مكية",42],
["التكوير","مكية",29],["الانفطار","مكية",19],["المطففين","مكية",36],["الانشقاق","مكية",25],["البروج","مكية",22],["الطارق","مكية",17],["الأعلى","مكية",19],["الغاشية","مكية",26],["الفجر","مكية",30],["البلد","مكية",20],
["الشمس","مكية",15],["الليل","مكية",21],["الضحى","مكية",11],["الشرح","مكية",8],["التين","مكية",8],["العلق","مكية",19],["القدر","مكية",5],["البينة","مدنية",8],["الزلزلة","مدنية",8],["العاديات","مكية",11],
["القارعة","مكية",11],["التكاثر","مكية",8],["العصر","مكية",3],["الهمزة","مكية",9],["الفيل","مكية",5],["قريش","مكية",4],["الماعون","مكية",7],["الكوثر","مكية",3],["الكافرون","مكية",6],["النصر","مدنية",3],
["المسد","مكية",5],["الإخلاص","مكية",4],["الفلق","مكية",5],["الناس","مكية",6]
];

const $ = id => document.getElementById(id);
let currentSurah = Number(localStorage.getItem("quran_current_surah") || 1);

function toArabicDigits(n){ return String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]); }

function renderSurahs(filter=""){
  const q = filter.trim().toLowerCase();
  $("surahGrid").innerHTML = "";
  surahs.forEach((s,i)=>{
    const no=i+1;
    if(q && !s[0].includes(q) && !String(no).includes(q)) return;
    const b=document.createElement("button");
    b.className="surah";
    b.innerHTML=`<span class="num">${toArabicDigits(no)}</span>
      <span><span class="name">${s[0]}</span><br><span class="meta">${s[1]} • ${toArabicDigits(s[2])} آيات</span></span>`;
    b.onclick=()=>openSurah(no);
    $("surahGrid").appendChild(b);
  });
}

function showHome(){
  $("homeView").classList.remove("hidden");
  $("readerView").classList.add("hidden");
  $("audio").classList.add("hidden");
  $("audio").pause();
}

async function openSurah(no){
  currentSurah=no;
  localStorage.setItem("quran_current_surah", no);
  const s=surahs[no-1];
  $("homeView").classList.add("hidden");
  $("readerView").classList.remove("hidden");
  $("readerNumber").textContent=toArabicDigits(no);
  $("readerTitle").textContent=s[0];
  $("readerMeta").textContent=`${s[1]} • ${toArabicDigits(s[2])} آيات`;
  $("ayahs").innerHTML="";
  $("loading").classList.remove("hidden");
  try{
    const res=await fetch(`https://api.alquran.cloud/v1/surah/${no}/quran-uthmani-quran-academy`);
    if(!res.ok) throw new Error("network");
    const json=await res.json();
    json.data.ayahs.forEach(a=>{
      const div=document.createElement("div");
      div.className="ayah";
      div.innerHTML=`${a.text} <span class="ayah-num">﴿${toArabicDigits(a.numberInSurah)}﴾</span>`;
      div.addEventListener("click",()=>localStorage.setItem("quran_last_ayah",`${no}:${a.numberInSurah}`));
      $("ayahs").appendChild(div);
    });
    localStorage.setItem("quran_last_surah", no);
    updateContinue();
  }catch(e){
    $("ayahs").innerHTML='<div class="loading">تعذر تحميل السورة. تأكد من اتصال الإنترنت ثم حاول مرة أخرى.</div>';
  }finally{
    $("loading").classList.add("hidden");
  }
  window.scrollTo({top:0,behavior:"smooth"});
}

function updateContinue(){
  const no=Number(localStorage.getItem("quran_last_surah")||0);
  if(!no) return;
  const s=surahs[no-1];
  $("continueCard").classList.remove("hidden");
  $("continueTitle").textContent=`سورة ${s[0]}`;
  $("continueMeta").textContent=`${s[1]} • ${s[2]} آيات`;
}
function toggleTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("quran_theme",document.body.classList.contains("dark")?"dark":"light");
}
function init(){
  if(localStorage.getItem("quran_theme")==="dark") document.body.classList.add("dark");
  renderSurahs();
  updateContinue();
  $("searchInput").addEventListener("input",e=>renderSurahs(e.target.value));
  $("themeBtn").onclick=toggleTheme;
  $("backBtn").onclick=showHome;
  $("continueBtn").onclick=()=>openSurah(Number(localStorage.getItem("quran_last_surah")||1));
  $("saveBtn").onclick=()=>alert("تم حفظ موضع السورة. يمكنك متابعة القراءة من الصفحة الرئيسية.");
  $("prevSurah").onclick=()=>openSurah(Math.max(1,currentSurah-1));
  $("nextSurah").onclick=()=>openSurah(Math.min(114,currentSurah+1));
  $("audioBtn").onclick=()=>{
    const audio=$("audio");
    audio.src=`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${currentSurah}.mp3`;
    audio.classList.remove("hidden");
    audio.play().catch(()=>{});
  };
}
init();
// ===============================
// مواقيت الصلاة
// ===============================

async function loadPrayerTimes() {
  const locationText = document.getElementById("prayerLocation");

  if (!navigator.geolocation) {
    if (locationText) {
      locationText.textContent = "المتصفح لا يدعم تحديد الموقع";
    }
    return;
  }

  if (locationText) {
    locationText.textContent = "📍 جاري تحديد موقعك...";
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3`
        );

        const result = await response.json();
        const timings = result.data.timings;

        document.getElementById("fajr").textContent = timings.Fajr;
        document.getElementById("sunrise").textContent = timings.Sunrise;
        document.getElementById("dhuhr").textContent = timings.Dhuhr;
        document.getElementById("asr").textContent = timings.Asr;
        document.getElementById("maghrib").textContent = timings.Maghrib;
        document.getElementById("isha").textContent = timings.Isha;

        if (locationText) {
          locationText.textContent = "📍 تم تحديث المواقيت حسب موقعك";
        }

      } catch (error) {
        console.error("Prayer times error:", error);

        if (locationText) {
          locationText.textContent = "❌ تعذر تحميل مواقيت الصلاة";
        }
      }
    },

    () => {
      if (locationText) {
        locationText.textContent = "⚠️ اسمح للتطبيق بالوصول إلى موقعك";
      }
    }
  );
}


// زر تحديث الموقع والمواقيت
const locationBtn = document.getElementById("locationBtn");

if (locationBtn) {
  locationBtn.addEventListener("click", loadPrayerTimes);
}


// تحميل المواقيت تلقائياً عند فتح التطبيق
loadPrayerTimes();
