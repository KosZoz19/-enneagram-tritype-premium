import React,{useEffect,useState,useCallback}from"react";
import{createRoot}from"react-dom/client";
import{ArrowLeft,ArrowRight,Check,Download,RotateCcw,Share2,Sparkles,Brain,Heart,Shield,Leaf,HeartHandshake,Star}from"lucide-react";
import"./styles.css";

const TYPES={
1:["Reformator","Gut","#c8a66b","Być dobrym, integralnym i postępować właściwie","Być złym, niepoprawnym lub nieetycznym"],
2:["Pomocnik","Heart","#d88ca8","Być kochanym i potrzebnym","Być niekochanym lub niepotrzebnym"],
3:["Osiągający","Heart","#e1b15b","Osiągać wartość i być skutecznym","Być bezwartościowym lub ponieść porażkę"],
4:["Indywidualista","Heart","#ad83d8","Odnaleźć autentyczne „ja”","Nie mieć własnej tożsamości"],
5:["Obserwator","Head","#6e9fd5","Być kompetentnym i rozumieć świat","Być bezradnym lub niekompetentnym"],
6:["Lojalista","Head","#78b9aa","Mieć oparcie i poczucie bezpieczeństwa","Brak bezpieczeństwa i pewności"],
7:["Entuzjasta","Head","#e7a45f","Doświadczać wolności i satysfakcji","Być ograniczonym lub cierpieć"],
8:["Wyzwanie","Gut","#d66d65","Być niezależnym i silnym","Być kontrolowanym lub zdominowanym"],
9:["Mediator","Gut","#7eaa82","Mieć wewnętrzny spokój i stabilność","Utrata harmonii lub konflikt"]
};
const CENTERS={Head:{name:"Głowa",types:[5,6,7],icon:Brain},Heart:{name:"Serce",types:[2,3,4],icon:Heart},Gut:{name:"Ciało",types:[8,9,1],icon:Shield}};
const WINGS={1:[9,2],2:[1,3],3:[2,4],4:[3,5],5:[4,6],6:[5,7],7:[6,8],8:[7,9],9:[8,1]};

const blocks=[
[1,["Często zauważam, co jest niepoprawne lub niedopracowane.","Mam silne poczucie tego, jak coś powinno być zrobione.","Trudno mi ignorować standardy, które uważam za ważne.","Potrafię długo poprawiać szczegóły.","Wewnętrznie oceniam swoje zachowanie.","Błędy i niesprawiedliwość wywołują we mnie napięcie.","Czuję odpowiedzialność za uporządkowanie sytuacji.","Wolałbym zrobić coś właściwie niż szybko.","Powstrzymuję impulsy, gdy uznaję je za niewłaściwe.","Kiedy widzę problem, myślę jak go naprawić.","Cenię uczciwość, konsekwencję i samodyscyplinę.","Bywam dla siebie bardziej wymagający niż dla innych."]],
[2,["Łatwo zauważam, czego druga osoba potrzebuje.","Pomaganie daje mi poczucie, że jestem potrzebny.","Dostosowuję zachowanie do emocji innych.","Trudno mi odmówić bliskiej osobie.","Pamiętam szczegóły ważne dla innych.","Chcę być osobą, do której inni przychodzą po wsparcie.","Czasem daję więcej, niż mam energii.","Potrzebuję czuć, że moja obecność ma znaczenie.","Odrzucenie lub brak docenienia mocno przeżywam.","Buduję relacje przez troskę i zaangażowanie.","Zdarza mi się pomagać bez prośby.","W relacjach ważne jest dla mnie poczucie bycia kochanym."]],
[3,["Lubię konkretne cele i mierzalny postęp.","Zależy mi na wizerunku osoby kompetentnej.","Potrafię mocno skupić się na wyniku.","Szybko widzę zachowanie potrzebne do osiągnięcia celu.","Porażka uderza w moje poczucie wartości.","Porównuję swoje osiągnięcia z innymi.","Mam tendencję do pokazywania się od najlepszej strony.","W pracy przechodzę w tryb zadaniowy.","Trudno mi długo pozostawać bez celu.","Potrafię odłożyć emocje, by wykonać zadanie.","Doceniam uznanie za wyniki.","Gdy coś nie wychodzi, szybko szukam rozwiązania."]],
[4,["Mam silną potrzebę bycia sobą.","Moje emocje bywają intensywne i złożone.","Zastanawiam się, kim naprawdę jestem.","Zauważam subtelne różnice w atmosferze.","Czasem czuję, że inni mają coś, czego mnie brakuje.","Pociągają mnie rzeczy wyjątkowe i nieoczywiste.","Nie chcę udawać kogoś, kim nie jestem.","Doświadczenia emocjonalne mocno wpływają na moje poczucie siebie.","Potrzebuję głębi w relacjach.","Ważne rzeczy przeżywam bardzo osobiście.","Porównuję swoje życie wewnętrzne z życiem innych.","Mam skłonność do nostalgii i tęsknoty."]],
[5,["Najpierw chcę zrozumieć, potem działać.","Potrzebuję prywatnej przestrzeni, żeby odzyskać energię.","Gdy nie znam odpowiedzi, zbieram informacje.","Nie lubię natychmiastowej presji emocjonalnej.","Czuję się bezpieczniej, gdy mam wiedzę i przygotowanie.","Potrafię długo zgłębiać temat z ciekawości.","W stresie wycofuję się i analizuję.","Wolę być samodzielny niż zależny.","Obserwuję ludzi przed bliższym kontaktem.","Nie lubię marnować czasu i zasobów.","Pewność siebie rośnie wraz z kompetencją.","Silne emocje innych są trudniejsze niż problemy logiczne."]],
[6,["Wyobrażam sobie, co może pójść nie tak.","Zanim zaufam, sprawdzam wiarygodność osoby.","Ważny jest dla mnie plan awaryjny.","Pytam, gdy coś jest niejasne lub ryzykowne.","Długo analizuję, czy decyzja była właściwa.","Lojalność i zaufanie są dla mnie bardzo ważne.","Czasem szukam potwierdzenia u innych.","Reaguję na sygnały nieprzewidywalności.","Zwracam uwagę na zasady i ryzyko.","Nawet gdy jest dobrze, widzę możliwy problem.","Wolę być przygotowany na najgorsze.","Gdy zaufam, jestem bardzo lojalny."]],
[7,["Gdy coś mnie ogranicza, szukam alternatywy.","Łatwo przychodzą mi nowe pomysły.","Lubię kilka opcji zamiast jednej ścieżki.","Nuda szybko skłania mnie do zmiany.","Planuję kolejne ciekawe doświadczenia.","Nie lubię długo pozostawać w negatywnym nastroju.","Szybko uczę się rzeczy, które mnie interesują.","Zaczynam wiele projektów naraz.","W konflikcie szukam sposobu na odzyskanie swobody.","Rutyna bez wyboru mnie męczy.","Widzę pozytywne możliwości w problemach.","Przyszłość i nowe doświadczenia dają mi energię."]],
[8,["Gdy ktoś przekracza moje granice, reaguję bezpośrednio.","Nie boję się koniecznej konfrontacji.","Wolę mówić wprost.","Cenię niezależność i nie lubię kontroli.","Przeciwstawiam się niesprawiedliwości.","Przejmuję inicjatywę, gdy nikt tego nie robi.","Wolę wyglądać na silnego niż bezradnego.","Chronię osoby, które uważam za swoje.","Gdy podejmę decyzję, trudno mnie odwieść.","Potrafię być bardzo ochronny.","Gniew pojawia się u mnie szybko i wyraźnie.","Nie udaję, że wszystko jest dobrze, gdy nie jest."]],
[9,["Próbuję łagodzić napięcia między ludźmi.","Potrzebuję spokoju i stabilności.","Czasem zgadzam się, choć mam inne zdanie.","Konflikty odbierają mi dużo energii.","Łatwo dostosowuję się do rytmu innych.","Przy wielu priorytetach odkładam je na później.","Potrzebuję czasu, żeby rozpoznać własne potrzeby.","Lubię spokojną atmosferę.","Bagatelizuję własne potrzeby, żeby nie komplikować sytuacji.","Gdy ktoś jest zdenerwowany, przywracam spokój.","Długo toleruję niedogodności.","Najlepiej działam bez nadmiernej presji."]]
];
const Q=blocks.flatMap(([t,a])=>a.map(x=>[t,x]));

const TYPE_NOTES={1:"Standardy, uczciwość i chęć poprawiania tego, co można zrobić lepiej.",2:"Bliskość, troska i uważność na potrzeby ważnych osób.",3:"Cele, działanie i poczucie satysfakcji z własnych osiągnięć.",4:"Autentyczność, wrażliwość i poszukiwanie osobistego znaczenia.",5:"Ciekawość, zrozumienie i przestrzeń na własne przemyślenia.",6:"Zaufanie, przygotowanie i szukanie oparcia w relacjach.",7:"Możliwości, spontaniczność i energia do odkrywania nowych rzeczy.",8:"Niezależność, szczerość i odwaga w stawianiu po swojej stronie.",9:"Spokój, akceptacja i troska o harmonię w codziennym życiu."};

function score(ans){
  const s=Object.fromEntries(Object.keys(TYPES).map(Number).map(x=>[x,0]));
  Q.forEach(([t],i)=>s[t]+=ans[i]||0);
  const cb={};Object.entries(CENTERS).forEach(([c,v])=>cb[c]=v.types.slice().sort((a,b)=>s[b]-s[a]||a-b)[0]);
  const core=Object.keys(s).map(Number).sort((a,b)=>s[b]-s[a]||a-b)[0];
  const wing=WINGS[core].slice().sort((a,b)=>s[b]-s[a])[0];
  const tri=[cb.Head,cb.Heart,cb.Gut].sort((a,b)=>a-b).join("");
  return{s,cb,core,wing,tri};
}

function Confetti(){
  const pieces=useCallback(()=>Array.from({length:50},(_,i)=>({
    id:i,
    left:Math.random()*100,
    delay:Math.random()*2,
    duration:2+Math.random()*3,
    color:['#80677f','#d88ca8','#e7b9ac','#c8a66b','#6e9fd5','#7eaa82'][Math.floor(Math.random()*6)]
  })),[]);
  const [items]=useState(pieces);
  return <div className="confetti" aria-hidden="true">
    {items.map(p=>(
      <div key={p.id} className="confetti-piece" style={{
        left:`${p.left}%`,
        backgroundColor:p.color,
        animationDelay:`${p.delay}s`,
        animationDuration:`${p.duration}s`
      }}/>
    ))}
  </div>;
}

function App(){
  const[page,setPage]=useState("home");
  const[i,setI]=useState(0);
  const[ans,setAns]=useState(()=>JSON.parse(localStorage.getItem("ennea-premium")||"[]"));
  const[r,setR]=useState(null);
  const[copied,setCopied]=useState(false);
  const[showConfetti,setShowConfetti]=useState(false);

  useEffect(()=>localStorage.setItem("ennea-premium",JSON.stringify(ans)),[ans]);

  useEffect(()=>{
    if(page==="result"&&r){
      setShowConfetti(true);
      const t=setTimeout(()=>setShowConfetti(false),5000);
      return()=>clearTimeout(t);
    }
  },[page,r]);

  const choose=v=>{let a=[...ans];a[i]=v;setAns(a)};
  const finish=useCallback(()=>{
    const x=score(ans);
    setR(x);
    setPage("result");
    scrollTo({top:0,behavior:'smooth'});
  },[ans]);

  const goToTest=useCallback(()=>{
    setPage("test");
    scrollTo({top:0,behavior:'smooth'});
  },[]);

  const quit=useCallback(()=>{
    setPage("home");
    setI(0);
    scrollTo({top:0,behavior:'smooth'});
  },[]);

  const next=useCallback(()=>{
    if(!ans[i])return;
    if(i<Q.length-1){
      setI(i+1);
      scrollTo({top:0,behavior:'smooth'});
    } else finish();
  },[i,ans,finish]);

  const back=useCallback(()=>{
    setI(Math.max(0,i-1));
    scrollTo({top:0,behavior:'smooth'});
  },[i]);

  const reset=useCallback(()=>{
    localStorage.removeItem("ennea-premium");
    setAns([]);
    setI(0);
    setR(null);
    setPage("home");
    setShowConfetti(false);
    scrollTo({top:0,behavior:'smooth'});
  },[]);

  const share=useCallback(async()=>{
    try{
      await navigator.clipboard.writeText(`Mój wynik Enneagramu: ${r.core}w${r.wing} · Tritype ${r.tri}`);
      setCopied(true);
      setTimeout(()=>setCopied(false),1500);
    }catch{}
  },[r]);

  if(page==="home")return <Home saved={ans.some(Boolean)} go={goToTest}/>;
  if(page==="test")return <Test i={i} ans={ans} choose={choose} next={next} back={back} quit={quit}/>;
  return <><Result r={r} copied={copied} share={share} reset={reset}/>{showConfetti&&<Confetti/>}</>;
}

function Header(){return <nav className="nav"><a className="logo" href="#top" aria-label="Enneagram — początek"><b>ennea</b>gram<span>✳</span></a><div className="pill"><span/> MAŁA PODRÓŻ DO SIEBIE</div></nav>}

function SkyIllustration(){return <div className="sky-card" aria-hidden="true"><div className="sky-caption">CZUŁE SERCE · SZEROKI HORYZONT <Sparkles/></div><svg className="sky-art" viewBox="0 0 440 390" fill="none"><defs><radialGradient id="moonGlow"><stop stopColor="#fff8dc" stopOpacity=".95"/><stop offset="1" stopColor="#fff8dc" stopOpacity="0"/></radialGradient><linearGradient id="planet" x1="100" y1="80" x2="330" y2="320"><stop stopColor="#f6c9b9"/><stop offset="1" stopColor="#d9b5d9"/></linearGradient></defs><circle cx="219" cy="188" r="147" stroke="#fff" strokeOpacity=".25"/><ellipse cx="219" cy="188" rx="190" ry="78" transform="rotate(-27 219 188)" stroke="#fff" strokeOpacity=".48"/><circle cx="218" cy="188" r="78" fill="url(#moonGlow)"/><circle cx="218" cy="188" r="51" fill="url(#planet)"/><path d="M194 179c8-13 19-18 33-15M204 208c15 9 30 7 42-3" stroke="#fff8ee" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round"/><path d="m319 77 31-29m-31 29 39 3m-39-3-4-37" stroke="#fff7e8" strokeWidth="2" strokeLinecap="round"/><path d="m92 271 19-20m-19 20 25 2m-25-2-3-25" stroke="#fff7e8" strokeWidth="1.5" strokeLinecap="round"/><path d="M125 109 140 94m-15 15 19 1m-19-1-2-18" stroke="#fff7e8" strokeWidth="1.5" strokeLinecap="round"/><circle cx="334" cy="288" r="3" fill="#fff7e8"/><circle cx="110" cy="139" r="2" fill="#fff7e8"/><circle cx="289" cy="91" r="2" fill="#fff7e8"/><circle cx="146" cy="317" r="2" fill="#fff7e8"/><circle cx="352" cy="168" r="2" fill="#fff7e8"/><circle cx="76" cy="207" r="2" fill="#fff7e8"/></svg><div className="sky-note"><span className="sky-note-icon"><Leaf/></span><span><b>Czułe serce,<br/>wolny duch.</b><small>W swoim tempie, po swojemu.</small></span></div><div className="sky-star">✳</div></div>}

function Home({saved,go}){return <main className="shell" id="top"><Header/><section className="hero"><div className="hero-copy"><div className="eyebrow animate-fade-in"><Sparkles/> TWOJA MAŁA PODRÓŻ DO SIEBIE</div><h1 className="animate-fade-in-delay-1">Poznaj siebie<br/><i>trochę lepiej.</i></h1><p className="animate-fade-in-delay-2">108 krótkich pytań, dziewięć osobowości i mapa, która pomoże Ci nazwać to, co już w sobie czujesz.</p><div className="actions animate-fade-in-delay-3"><button className="primary" onClick={go}>{saved?"Wznów test":"Zaczynamy"} <ArrowRight/></button><small><span>♡</span> Około 12 minut · Twoje tempo</small></div><div className="hero-footnote animate-fade-in-delay-3">Bez oceniania. Bez złych odpowiedzi. Po prostu Ty.</div></div><SkyIllustration/></section><div className="section-kicker"><span>MAŁY PRZEWODNIK</span><i/></div><div className="features"><Feature icon={<Brain/>}n="01" t="Dziewięć perspektyw" p="Przyjrzyj się motywacjom i potrzebom, które mogą stać za Twoimi wyborami."/><Feature icon={<Heart/>}n="02" t="Trzy części układanki" p="Głowa, serce i ciało — poznaj wzorce, które wnosisz do każdej z nich."/><Feature icon={<Sparkles/>}n="03" t="Wynik tylko dla Ciebie" p="Zobacz swój typ, skrzydło i osobistą kombinację. Weź z niej to, co z Tobą rezonuje."/></div><section className="info"><div className="info-heading"><div className="info-flower">✿</div><div><label>NA SPOKOJNIE</label><h2>Jak podejść do pytań?</h2></div></div><div className="info-items"><article><span>01</span><div><b>Myśl o sobie na co dzień.</b><p>Wybieraj odpowiedź, która pasuje do Ciebie zazwyczaj — nie do Twojej idealnej wersji.</p></div></article><article><span>02</span><div><b>Ufaj pierwszej myśli.</b><p>Nie ma tu punktów za „dobrą” odpowiedź. Zaznacz to, co naprawdę czujesz.</p></div></article><article><span>03</span><div><b>Wynik potraktuj jak wskazówkę.</b><p>To zaproszenie do refleksji, nie szufladka. Ty znasz siebie najlepiej.</p></div></article></div></section><footer><div className="personal-note"><HeartHandshake/> Stworzono z czułością</div><br/><br/>Enneagram to narzędzie autorefleksji, nie diagnoza psychologiczna. <span>✳</span> Odkryj siebie z łagodnością.</footer></main>}

function Feature({icon,n,t,p}){return <article className="feature"><div className="feature-top"><div className="icon">{icon}</div><span>{n}</span></div><h3>{t}</h3><p>{p}</p></article>}

function Test({i,ans,choose,next,back,quit}){
  const[t,q]=Q[i];
  const labels=["Zdecydowanie nie","Raczej nie","Nie wiem / trudno powiedzieć","Raczej tak","Zdecydowanie tak"];
  const pct=((i+1)/Q.length)*100;
  const isLast=i===Q.length-1;
  return <main className="test page-enter"><header><button className="exit" onClick={quit} aria-label="Wróć na początek"><ArrowLeft/> Wróć</button><div className="logo"><b>ennea</b>gram<span>✳</span></div><strong>{String(i+1).padStart(2,"0")} <i>/ {Q.length}</i></strong></header><div className="progress-wrap"><div className="progress-copy"><span>Twoja chwila dla siebie</span><span>{Math.round(pct)}%</span></div><div className="bar" role="progressbar" aria-label="Postęp testu" aria-valuenow={i+1} aria-valuemin="0" aria-valuemax={Q.length}><i style={{width:`${pct}%`}}/></div></div><section className="question"><div className="question-spark">✳</div><div className="meta"><span>PYTANIE {String(i+1).padStart(2,"0")}</span><span>CENTRUM · {CENTERS[Object.keys(CENTERS).find(c=>CENTERS[c].types.includes(t))].name}</span></div><h2>{q}</h2><p>Jak często to zdanie pasuje do Ciebie?</p><div className="choices" role="group" aria-label="Wybierz odpowiedź">{labels.map((x,n)=><button aria-pressed={ans[i]===n+1} className={ans[i]===n+1?"active":""} onClick={()=>choose(n+1)} key={x}><span>{ans[i]===n+1?<Check/>:n+1}</span>{x}</button>)}</div><div className="qnav"><button onClick={back} disabled={!i}><ArrowLeft/> Wstecz</button><button className="primary" onClick={next} disabled={!ans[i]}>{isLast?"Zobacz mój wynik":"Dalej"} <ArrowRight/></button></div><div className="autosave"><span/> Odpowiedzi zapisują się automatycznie</div></section></main>
}

const TYPE_COLORS={1:"#c8a66b",2:"#d88ca8",3:"#e1b15b",4:"#ad83d8",5:"#6e9fd5",6:"#78b9aa",7:"#e7a45f",8:"#d66d65",9:"#7eaa82"};

function Result({r,share,copied,reset}){
  const sorted=Object.keys(r.s).map(Number).sort((a,b)=>r.s[b]-r.s[a]);
  const topType=TYPES[r.core];
  const topColor=TYPE_COLORS[r.core]||"#80677f";
  return <main className="shell result page-enter" id="top"><Header/><section className="rhero"><div className="orb" style={{borderColor:`${topColor}40`}}><span className="orb-spark">✳</span><small>TWÓJ TYP</small><b style={{color:topColor}}>{r.core}<em style={{color:topColor,opacity:0.7}}>w{r.wing}</em></b><span className="orb-name">{TYPES[r.core][0]}</span></div><div className="rhero-copy"><label>MAŁY ODCZYT DLA CIEBIE</label><h1>Twoja wrażliwość<br/><i>ma swój wzór.</i></h1><p>Najmocniej wybrzmiewa u Ciebie typ {r.core} — {TYPES[r.core][0].toLowerCase()}. Może Cię ciekawić temat: <b>{TYPES[r.core][3].toLowerCase()}</b>.</p><div className="result-note"><span>✿</span> Potraktuj ten opis jak początek rozmowy ze sobą.</div></div></section><section className="tri"><div className="tri-intro"><label>GŁOWA · SERCE · CIAŁO</label><strong>{r.tri.split("").join(" · ")}</strong><h2>Twoja kombinacja</h2><p>Po jednym typie z każdego centrum — trzy perspektywy, które razem tworzą Twój wynik.</p></div><div className="centers">{Object.entries(CENTERS).map(([c,v])=>{let x=r.cb[c],I=v.icon;return <div key={c}><span className="center-icon"><I/></span><span>{v.name}</span><b>{x} · {TYPES[x][0]}</b></div>})}</div></section><div className="grid"><section className="panel"><label>TWÓJ ROZKŁAD</label><h2>Dziewięć typów, różne odcienie</h2><p className="panel-intro">To mapa Twoich odpowiedzi — każdy typ pokazuje się w innym natężeniu.</p>{sorted.map((x,n)=><div className={`score ${n===0?"top-score":""}`} key={x}><b>{x}</b><span>{TYPES[x][0]}</span><i><em style={{width:`${r.s[x]/60*100}%`,background:TYPES[x][2]}}/></i><strong>{r.s[x]}</strong></div>)}</section><section className="panel"><label>CO MOŻE BYĆ WAŻNE</label><h2>Motywacje, do których warto zajrzeć</h2><Driver a="GŁÓWNA POTRZEBA" b={TYPES[r.core][3]}/><Driver a="WRAŻLIWY PUNKT" b={TYPES[r.core][4]}/><Driver a="TWOJE SKRZYDŁO" b={`Typ ${r.wing} · ${TYPES[r.wing][0]}`}/><p className="panel-footnote">Skrzydło to sąsiedni typ, którego odpow...</p></section></div><section className="centers-panel panel"><label>POZNAJ SWOJE CENTRA</label><h2>Trzy części Ciebie</h2><div className="centergrid">{Object.entries(CENTERS).map(([c,v])=>{let x=r.cb[c];return <article key={c}><strong>{x}</strong><div><small>{v.name}</small><h3>{TYPES[x][0]}</h3><p>{TYPE_NOTES[x]}</p></div></article>})}</div></section><div className="actions end"><button className="primary" onClick={share}>{copied?"Skopiowano!":"Udostępnij wynik"} {copied?<Check/>:<Share2/>}</button><button onClick={reset}><RotateCcw/> Zrób test ponownie</button></div><footer><div className="personal-note"><HeartHandshake/> Stworzono z czułością dla ciekawości siebie</div><br/><br/>Enneagram to narzędzie autorefleksji, nie diagnoza psychologiczna. <span>✳</span> Odkryj siebie z łagodnością.</footer></main>
}

function Driver({a,b}){return <div className="driver"><small>{a}</small><p>{b}</p></div>}

createRoot(document.getElementById("root")).render(<App/>);
