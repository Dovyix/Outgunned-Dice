import{r as R,u as f,b as L,O as g,C as T,t as N,M as y,c as k,o as H,d as S,a as w}from"./shared-U1rEp5hv.js";import{f as $}from"./faces-B5vy8ePg.js";import{c as E,d as D,w as C}from"./log-C0alzyCC.js";const V=document.getElementById("app"),e={count:3,dice:[],last:null,selected:new Set,spin:null,locked:!1,rerolls:0,finished:!1,tab:"roll",log:[]};V.innerHTML=`
  <header class="top">
    <h1>Outgunned dice</h1>
    <div class="tabs" role="tablist">
      <button role="tab" id="tabRoll" aria-selected="true">Roll</button>
      <button role="tab" id="tabLog" aria-selected="false">Log</button>
    </div>
  </header>
  <div id="rollView" class="view">
    <p class="hint">Roll 2 or more dice. Matching dice are successes, and they stack.</p>
    <section class="setup">
      <span class="stepper-label">Dice</span>
      <div class="stepper">
        <button id="minus" aria-label="Fewer dice">−</button>
        <output id="count" aria-live="polite"></output>
        <button id="plus" aria-label="More dice">+</button>
      </div>
      <button class="btn-roll" id="roll">Roll</button>
    </section>
    <section class="tray" id="tray" aria-label="Your dice"></section>
    <section class="result" id="result" aria-live="polite"></section>
    <section class="actions">
      <button class="btn-reroll" id="reroll">Reroll selected</button>
      <button class="btn-ghost" id="unmatched" title="Select every die that is not part of a match">Pick unmatched</button>
      <button class="btn-allin" id="allin" hidden>All In</button>
      <p class="allin-note" id="allinNote" hidden>Rerolls every unmatched die. If the result is not better than now, the roll fails with no successes.</p>
    </section>
  </div>
  <div id="logView" class="view" hidden>
    <ol class="log-list" id="logList"></ol>
    <button class="btn-ghost" id="clearLog">Clear my rolls</button>
  </div>
`;const i=l=>document.getElementById(l),t={minus:i("minus"),plus:i("plus"),count:i("count"),roll:i("roll"),tray:i("tray"),result:i("result"),reroll:i("reroll"),unmatched:i("unmatched"),allin:i("allin"),allinNote:i("allinNote"),tabRoll:i("tabRoll"),tabLog:i("tabLog"),rollView:i("rollView"),logView:i("logView"),logList:i("logList"),clearLog:i("clearLog")};t.minus.onclick=()=>v(e.count-1);t.plus.onclick=()=>v(e.count+1);t.roll.onclick=()=>m({dice:R(e.count),prev:null,spin:null,kind:"roll"});t.reroll.onclick=_;t.unmatched.onclick=O;t.allin.onclick=j;t.tabRoll.onclick=()=>I("roll");t.tabLog.onclick=()=>I("log");t.clearLog.onclick=()=>E().catch(()=>{});function I(l){e.tab=l,b()}const p=()=>!e.locked&&!e.finished&&e.dice.length>0;function v(l){e.count=Math.max(y,Math.min(k,l)),b()}function x(l){p()&&(e.selected.has(l)?e.selected.delete(l):e.selected.add(l),b())}function O(){p()&&(e.selected=new Set(f(e.dice)),b())}function _(){if(!p()||!e.selected.size)return;const l=[...e.dice],n=[...l],a=l.map((s,o)=>e.selected.has(o));a.forEach((s,o)=>s&&(n[o]=L())),m({dice:n,prev:l,spin:a,kind:"reroll"})}function j(){const l=f(e.dice);if(!p()||e.rerolls<1||!l.length)return;const n=[...e.dice],a=[...n],s=n.map((o,r)=>l.includes(r));l.forEach(o=>a[o]=L()),m({dice:a,prev:n,spin:s,kind:"allin"})}async function m({dice:l,prev:n,spin:a,kind:s}){const o=a||l.map(()=>!0),r={id:crypto.randomUUID(),player:await g.player.getName(),pid:await g.player.getId(),dice:l,spin:o,prev:n,reroll:s==="reroll",allIn:s==="allin"};e.dice=l,e.last={dice:l,prev:n,allIn:s==="allin"},e.selected=new Set,e.rerolls=s==="roll"?0:s==="reroll"?e.rerolls+1:e.rerolls,e.finished=s==="allin",e.locked=!0,e.spin=o,b(),await g.broadcast.sendMessage(T,r,{destination:"ALL"}),setTimeout(()=>{e.locked=!1,e.spin=null,b()},N(o)+150)}function b(){t.count.textContent=e.count,t.minus.disabled=e.locked||e.count<=y,t.plus.disabled=e.locked||e.count>=k,t.roll.disabled=e.locked;const l=e.last?H(e.last):null;if(!e.dice.length)t.tray.innerHTML='<p class="tray-empty">Your dice show up here after you roll.</p>';else{const r=new Map;l&&!e.locked&&l.sets.forEach(u=>u.indices.forEach(d=>r.set(d,u.tier.key))),t.tray.innerHTML="",e.dice.forEach((u,d)=>{var h;const c=document.createElement("button");c.className="chip",e.locked&&((h=e.spin)!=null&&h[d])?(c.classList.add("rolling"),c.disabled=!0,c.setAttribute("aria-label","Rolling")):(c.innerHTML=$(u),c.setAttribute("aria-label",`Die ${d+1}: face ${u}`),c.setAttribute("aria-pressed",e.selected.has(d)),r.has(d)&&c.classList.add("matched",`tier-${r.get(d)}`),e.selected.has(d)&&c.classList.add("selected"),c.disabled=!p()),c.onclick=()=>x(d),t.tray.append(c)})}if(t.result.className="result",!l)t.result.innerHTML="";else if(e.locked)t.result.innerHTML='<p class="sub">Spinning…</p>';else if(l.failed)t.result.innerHTML=`<p class="headline">Failed</p><p class="sub">${l.allInLost?"The All In did not beat your roll. No successes.":"No two dice match. Select dice to try again."}</p>`;else{t.result.classList.add(`tier-${l.sets[0].tier.key}`);const r=l.sets.map(u=>S(u.count));t.result.innerHTML=`
      <p class="headline">${w(l.sets)}</p>
      <p class="sub">${r.join(" · ")}${l.allInWon?" · All In paid off":""}${e.rerolls?` · ${e.rerolls} ${e.rerolls===1?"reroll":"rerolls"}`:""}</p>`}const n=e.selected.size;t.reroll.textContent=n?`Reroll ${n} ${n===1?"die":"dice"}`:"Reroll selected",t.reroll.disabled=!p()||n===0,t.unmatched.disabled=!p();const a=e.dice.length?f(e.dice).length:0,s=e.rerolls>=1&&!e.finished;t.allin.hidden=!s,t.allinNote.hidden=!s,t.allin.disabled=!p()||a===0,t.allin.textContent=a?`All In (${a} ${a===1?"die":"dice"})`:"All In";const o=e.tab==="log";t.rollView.hidden=o,t.logView.hidden=!o,t.tabRoll.setAttribute("aria-selected",String(!o)),t.tabLog.setAttribute("aria-selected",String(o)),o&&M()}function M(){if(!e.log.length){t.logList.innerHTML='<li class="log-empty">No rolls yet. Rolls from everyone in the room show up here.</li>';return}t.logList.innerHTML=e.log.map(l=>{const{dice:n,changed:a,out:s,kind:o}=D(l),r=n.map((h,A)=>`<span class="log-die${a[A]?" changed":""}">${$(h,"log-face")}</span>`).join(""),u=s.failed?"failed":s.sets[0].tier.key,d=s.failed?"Failed":w(s.sets),c=new Date(l.t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`<li class="entry tier-${u}">
        <div class="entry-top"><strong>${B(l.n)}</strong><span class="kind">${o}</span><time>${c}</time></div>
        <div class="entry-dice">${r}</div>
        <div class="entry-result">${d}${s.allInLost?" · All In did not beat the roll":""}</div>
      </li>`}).join("")}function B(l){return String(l??"Someone").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}g.onReady(()=>{C(l=>{e.log=l,e.tab==="log"&&M()}),b()});b();
