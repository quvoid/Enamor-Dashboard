/* Strategy report view: the DeepSolv report structure, rebuilt for Enamor from report.json (live Meta ads).
   Numbers are read from report.json at render time; analyst readings are marked as such. */
let R=null;
var CP=window.CP||null;
const RP=()=>R?Promise.resolve(R):Promise.all([fetch('report.json').then(r=>r.json()),fetch('campaigns.json').then(r=>r.json())]).then(([j,c])=>{CP=c;return R=j});
const adById=id=>ITEMS.find(x=>x.src==='ad'&&x.id===id);
const exLink=(e,txt)=>e?`<a href="#" class="exl" data-ad="${e.id}">${e.poster?`<img src="media/${e.poster}" alt="">`:''}<span>${esc(txt||'View ad')}</span></a>`:'<span class="note">–</span>';
const tbl=(head,rows,cls='')=>`<div class="scroll"><table class="tbl rt ${cls}"><tr>${head.map((h,i)=>`<th class="${i?'':'l'}">${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i?'':'l'}">${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
const sec=(id,t,sub,body)=>`<section class="card rsec" id="r_${id}"><h2>${t}</h2>${sub?`<div class="sub">${sub}</div>`:''}<div class="rbody">${body}</div></section>`;
const reading=t=>`<div class="reading"><b>Analyst reading</b> ${t}</div>`;
const N=n=>(n??0).toLocaleString();

function report(){
  T('Strategy report','Enamor Meta ads strategy report');
  $('#page').innerHTML='<div class="card"><div class="note">Loading the report…</div></div>';
  RP().then(()=>draw());
}
function draw(){
  const B_=R.brands, H=B_['Enamor'], riv=Object.values(B_).filter(b=>b.brand!=='Enamor');
  const all=Object.values(B_), tot=all.reduce((s,b)=>s+b.ads,0);
  const by=(k,arr=riv)=>[...arr].sort((a,b)=>b[k]-a[k]);
  const pd=[...new Set(Object.values(R.pull))].sort(), pull=pd.length>1?`${pd[0]} to ${pd[pd.length-1]}`:pd[0];
  const ul=B_['Underneat'], nk=B_['Nykd by Nykaa'], wc=B_['Wacoal'], vs=B_['Victoria\'s Secret'], zv=B_['Zivame'], jw=B_['Jockey Woman'];
  const share=(b,c)=>{const x=b.categories.find(z=>z[0]===c);return x?x[1]:0};
  const top2=H.top_collab.slice(0,2), top2n=top2.reduce((s,x)=>s+x[1],0);
  const talk=b=>(b.hooks.find(h=>h[0]==='Talking head')||[0,0,0])[2];
  const shapeTot=R.market.find(m=>m.category==='Shapewear / bodysuits')||{ads:0,brands:[]};
  const fragVS=share(vs,'Fragrance / beauty'), brideVS=share(vs,'Bridal / lingerie sets');
  const celebWC=(wc.celebrities[0]||['',0])[1];
  const hindiMax=by('ads',all).map(b=>[b.brand,b.languages['Hindi / Hinglish']]).sort((a,b)=>b[1]-a[1])[0];
  const lg=(b)=>bname(b.brand,'s');
  const nav=[['exec','Executive summary'],['market','Market overview'],['land','Competitive landscape'],['enamor','Enamor today'],['angles','Ad angles'],['format','Format & style'],['msg','Messaging'],['cat','Product categories'],['lang','Language'],['price','Pricing & offers'],['cta','Calls to action'],['camp','Campaign setup'],['celeb','Celebrities & creators'],['hidden','Hidden insights'],['method','Method']];

  const exec=`<ol class="rlist">
    <li><b>The category splits into clear lanes.</b> Underneat owns shapewear and creator volume; Nykd owns problem-solving bras told by creators; Victoria's Secret sells fragrance and bridal glamour; Wacoal sells one celebrity and Japanese craft; Zivame runs catalogue ads and app installs for shoppers already looking; Jockey Woman runs dynamic creative image mixes with almost no creators. Enamor's lane today is <b>everyday comfort</b>: ${H.categories[0][1]} of its ${H.ads} live ads sell everyday bras.</li>
    <li><b>Creator ads are the dividing line.</b> ${pctS(ul.creator_ads,ul.ads)} of Underneat's live ads and ${pctS(nk.creator_ads,nk.ads)} of Nykd's run with a creator. Enamor: ${pctS(H.creator_ads,H.ads)} (${H.creator_ads} ads). Victoria's Secret, Wacoal, Zivame and Jockey Woman together: ${vs.creator_ads+wc.creator_ads+zv.creator_ads+jw.creator_ads}.</li>
    <li><b>Enamor has a hero, which most rivals don't.</b> "${esc(H.hero)}" carries ${H.hero_share} in every 100 Enamor ads. The risk is the opposite of a scattered launch: one message, two creators, one language.</li></ol>
    <p>This report covers <b>${N(tot)} live Meta ads</b> across Enamor and six direct competitors (Amante has no Facebook ad page we could find). Every number below is a count of live ads, never spend.</p>`;

  const market=tbl(['Brand','Live ads','Creator ads','Launched in last 14 days','Instagram followers','Primary focus'],
    by('ads',all).map(b=>[lg(b),N(b.ads),N(b.creator_ads),N(b.new14),fmtF(b.followers),esc(b.focus)]))+
    `<p class="note">Total live ads across all ${all.length} brands: ${N(tot)}. Ad Library pull dates: ${esc(pull)}.</p>`+
    reading(`The market is consolidating around models: creator-volume D2C (Underneat, Nykd), glamour and gifting (Victoria's Secret), celebrity plus heritage (Wacoal), catalogue and app retargeting (Zivame), and low-key image mixes (Jockey Woman). Enamor, a legacy brand, runs its ads like a D2C brand (${H.formats.Video} in every 100 are video) but with a fraction of the creator count.`);

  const dims=[['Live ads',b=>N(b.ads)],['Core category',b=>esc(b.focus)],['Hero angle',b=>esc(b.hero)+` <span class="note">(${b.hero_share} in 100)</span>`],
    ['Celebrity / face',b=>b.celebrities.length?esc(b.celebrities.map(c=>c[0]).slice(0,2).join(', ')):b.top_collab.length?'Creators: '+esc(b.top_collab.slice(0,2).map(c=>c[0]).join(', ')):'None'],
    ['How ads open',b=>esc((b.hooks[0]||['–'])[0])+` <span class="note">(${(b.hooks[0]||[0,0,0])[2]} in 100)</span>`],
    ['Entry bra price',b=>b.entry_price?'₹'+N(b.entry_price):'<span class="miss">Not publicly available</span>'],
    ['Status',b=>b.new14/b.ads>=.8?'Mostly new ads':b.new14/b.ads>=.4?'Refreshing fast':'Steady, long-running']];
  const land=tbl(['Dimension',...all.map(b=>lg(b))],dims.map(([k,f])=>[`<b>${k}</b>`,...all.map(f)]),'wide')+
    `<h3>Key observations</h3><ul class="rul">
     <li>${pctS(ul.new14,ul.ads)} of Underneat's ads went live in the last two weeks: it replaces ads fast and tests constantly (its creator ads live about 10 days on average).</li>
     <li>Wacoal is the slowest mover: only ${wc.new14} of ${wc.ads} ads are new; its message is fixed around Rakul Preet Singh.</li>
     <li>Jockey Woman's ${jw.ads} ads are all new and ${jw.formats['Dynamic creative / carousel']} in 100 are dynamic creative (Meta mixes several images and texts): a fresh, low-cost test, not a brand story.</li></ul>`;

  const ex=H.angles.filter(a=>a.example).slice(0,8);
  const enamor=tbl(['Dimension','Detail'],[['Total live ads',`${N(H.ads)} (${N(H.new14)} launched in the last 14 days)`],
     ['Products advertised',H.categories.map(c=>`${esc(c[0])} ${c[1]}`).join(' · ')],
     ['Format split',`Video ${H.formats.Video} · Dynamic creative ${H.formats['Dynamic creative / carousel']} · Catalogue ${H.formats['Catalogue (product feed)']} · Image ${H.formats.Image} (out of 100)`],
     ['Language',`English ${H.languages.English} · Hindi / Hinglish ${H.languages['Hindi / Hinglish']} · Regional ${H.languages.Regional} (out of 100)`],
     ['Creators',`${H.collaborators} creators in ${H.creator_ads} creator ads; top: ${H.top_collab.slice(0,3).map(c=>`${esc(c[0])} (${c[1]})`).join(', ')}`],
     ['Main offer',H.offers.length?`${esc(H.offers[0][0])}: ${H.offers[0][1]} ads, e.g. "${esc(H.offers_raw[0]||'')}"`:'No offer in the ad text'],
     ['Entry bra price (own site)',H.entry_price?`₹${N(H.entry_price)}; typical bra ₹${N(H.median_bra)}`:'–']])+
    `<div class="grid2r"><div><h3>What Enamor does well</h3><ol class="rlist">
      <li><b>One clear hero message.</b> "${esc(H.hero)}" is ${H.hero_share} in 100 ads. Shoppers get one reason to remember the brand, which most rivals (Underneat's ${ul.angles.length}+ angles, Victoria's Secret's mix of fragrance and bridal) don't give.</li>
      <li><b>Video first.</b> ${H.formats.Video} in 100 Enamor ads are video, more than any legacy rival (Victoria's Secret ${vs.formats.Video}, Wacoal ${wc.formats.Video}, Zivame ${zv.formats.Video}, Jockey Woman ${jw.formats.Video}).</li>
      <li><b>Creator codes make creators measurable.</b> ${H.offers.length?H.offers[0][1]:0} ads carry a creator's own code (e.g. ${esc((H.offers_raw[0]||'').replace(/^Use /,''))}), so each creator's sales can be counted.</li></ol></div>
     <div><h3>Where the gaps are</h3><ol class="rlist">
      <li><b>Two creators carry the creator ads.</b> ${top2.map(c=>esc(c[0])).join(' and ')} are in ${top2n} of Enamor's ${H.creator_ads} creator ads. Underneat runs ${ul.collaborators} different creators, Nykd ${nk.collaborators}. If either creator's audience tires, Enamor's creator ads tire with them.</li>
      <li><b>The product talks, people don't.</b> ${(H.hooks[0]||['',0,0])[2]} in 100 Enamor ads open on a product close-up; ${talk(H)} in 100 open on a person talking. Nykd opens ${talk(nk)} in 100 and Underneat ${talk(ul)} in 100 with a creator talking to camera.</li>
      <li><b>English only, comfort only.</b> ${H.languages.English} in 100 ads are English, and the comfort promise frames ${(H.frames[0]||['',0])[1]} of ${H.ads}. Shapewear (${shapeTot.ads} ads in the market) gets ${share(H,'Shapewear / bodysuits')} from Enamor.</li></ol></div></div>
     <h3>Enamor ad reference gallery</h3><div class="gal">${ex.map(a=>{const it=adById(a.example.id);return it?tile(it).replace('<div class="tile">',`<div class="tile" data-ad="${it.id}">`):''}).join('')}</div>
     <div class="note">One ad per angle: the longest-running live ad with a saved preview.</div>`;

  const angleCards=riv.filter(b=>b.angles.length).map(b=>`<div class="angcard"><h3>${lg(b)} <span class="tagline">${esc(angTag(b))}</span></h3>${tbl(['Angle','Live ads','Out of 100','Trend','Example'],
     b.angles.map(a=>[esc(a.angle),N(a.ads),a.share,trendCell(a.trend),exLink(a.example,'View')]))}</div>`).join('');
  const angles=`<p class="sub">Each brand's live ads grouped into its main selling angles. Trend = share of an angle's live ads launched in the last 14 days (80+ in 100 = New, 40+ = Growing fast, else Consistent).</p>${angleCards}
    <h3>Angles seen across the market</h3>`+tbl(['Angle pattern','Where it appears','Signal'],[
     ['Invisible under clothes / no lines',`Nykd (${(nk.angles[0]||{}).ads||0} ads), Underneat`,'The most-shown product benefit in creator ads'],
     ['Shapewear and body sculpting',`Underneat (${share(ul,'Shapewear / bodysuits')} ads)`,'One brand owns the whole shapewear conversation'],
     ['Problem-specific bras (heavy bust, summer sweat, strapless)','Nykd, Underneat','Specific problems beat general comfort for D2C brands'],
     ['Soft fabric comfort',`Enamor (${H.hero_share} in 100), Jockey Woman`,'Enamor\'s lane; Jockey Woman says it too, without creators'],
     ['Celebrity endorsement',`Wacoal (Rakul Preet Singh, ${celebWC} ads)`,'Awareness, but one face carries the brand'],
     ['Fragrance and bridal glamour',`Victoria's Secret (${fragVS} fragrance, ${brideVS} bridal ads)`,'Gifting and occasions, not daily wear'],
     ['Price and % off in catalogue ads',`Zivame`,'Retargeting shoppers who already browsed']]);

  const format=tbl(['Brand','Video','Dynamic creative / carousel','Catalogue (product feed)','Image','Dominant format'],all.map(b=>[lg(b),b.formats.Video,b.formats['Dynamic creative / carousel'],b.formats['Catalogue (product feed)'],b.formats.Image,
     esc(Object.entries(b.formats).sort((x,y)=>y[1]-x[1])[0][0])]))+`<p class="note">Out of every 100 live ads. Dynamic creative = Meta's DCO format: several images, videos and texts that Meta mixes and tests. Catalogue = product-feed ads (DPA). A video ad counts as video even when it is dynamic creative.</p>
    <h3>How ads open (first frame)</h3>`+tbl(['Opening',...all.map(b=>lg(b))],['Product close-up','Product on body / try-on','Talking head','Problem scene','Price or offer first','Lifestyle scene','Text-led'].map(h=>[esc(h),...all.map(b=>{const x=b.hooks.find(z=>z[0]===h);return x?`${x[2]}`:'–'})]),'wide')+
    `<p class="note">Out of every 100 live ads, read from each ad's opening words and format.</p>`+
    reading(`Enamor's creative is recognisable but quiet: product close-ups and comfort copy. The brands growing fastest in creator ads (Underneat, Nykd) open on a person talking about a specific problem.`);

  const msg=tbl(['Brand','Primary frame','Secondary frame','Tone','Example'],all.map(b=>[lg(b),esc((b.frames[0]||['–'])[0]),esc((b.frames[1]||['–'])[0]),esc(b.registers.map(r=>r[0]).join(' / ')||'–'),exLink(b.frame_example,'View')]))+
    reading(`Across the set, comfort is the default promise: it is the primary frame for Enamor, Underneat, Nykd and Jockey Woman. Underneat and Nykd add a second, sharper frame (product capability, a problem solved). Enamor's second frame is product capability too, but its creative rarely shows the problem first.`);

  const cat=tbl(['Product category','Brands present','Live ads','Competition','Enamor','Example'],R.market.filter(m=>m.category!=='Other').map(m=>[esc(m.category),
     m.brands.map(([b,k])=>`${esc(b)} ${k}`).join(', '),N(m.ads),esc(m.level),m.home?`Yes (${m.home})`:'<span class="miss">Not present</span>',exLink(m.example,'View')]))+
    `<h3>White spaces for Enamor</h3><ul class="rul">${R.market.filter(m=>!m.home&&m.ads>=5&&!['Fragrance / beauty','Other','Brand / multi-product'].includes(m.category)).map(m=>`<li><b>${esc(m.category)}</b>: ${N(m.ads)} live ads in the set${m.brands[0]?`, led by ${esc(m.brands[0][0])} (${m.brands[0][1]})`:''}. Enamor runs none.</li>`).join('')}
     <li><b>Shapewear</b>: ${N(shapeTot.ads)} live ads, ${shapeTot.brands[0]?`${esc(shapeTot.brands[0][0])} runs ${shapeTot.brands[0][1]}`:''}. Enamor: ${share(H,'Shapewear / bodysuits')}.</li></ul>`+
    reading('A white space here means few live Meta ads, not proven demand. Check search volume and Enamor\'s own sell-through before moving budget.');

  const lang=tbl(['Brand','English','Hindi / Hinglish','Regional'],all.map(b=>[lg(b),b.languages.English,b.languages['Hindi / Hinglish'],b.languages.Regional]))+
    `<p class="note">Out of every 100 live ads, from the ad text and, for transcribed videos, the spoken language.</p><h3>What this means</h3>`+
    reading(`Unlike men's grooming, lingerie advertising on Meta is almost all English. The most Hindi any brand runs is ${hindiMax[0]} at ${hindiMax[1]} in 100. Enamor at ${H.languages['Hindi / Hinglish']} in 100 is in line with the market, so Hindi and regional creator ads are open ground: no rival owns them yet.`);

  const price=tbl(['Brand','Entry bra price','Typical bra price','Main offer type','Offer as written','Ads with an offer'],all.map(b=>[lg(b),b.entry_price?'₹'+N(b.entry_price):'<span class="miss">Not publicly available</span>',
     b.median_bra?'₹'+N(b.median_bra):'<span class="miss">Not publicly available</span>',esc((b.offers[0]||['None'])[0]),esc(b.offers_raw[0]||'–'),`${b.offer_ads} of ${b.ads}`]))+
    `<p class="note">Prices: each brand's own site product feed on ${esc(pull.split(' to ').pop())} (selling price, women's bras; typical = the middle product). Victoria's Secret, Zivame and Nykd don't publish a feed; see the research workbook for samples.</p>`+
    reading(`Discount codes, not bundles, are this market's offer language, and in creator ads they are the creator's own code (Enamor, Nykd, Underneat). Wacoal uses a free gift above ₹3,999; Zivame and Jockey Woman call out prices in catalogue sliders. Nobody runs a lingerie "starter kit" bundle at scale.`);

  const igAsks=['Comment for the link (DM)','Use my code','Link in bio / story',"Shop on the brand's site",'Shop on a marketplace','Visit a store','No ask'];
  const igDest=['A DM with the link (comment automation)',"Brand checkout, tracked by the creator's code","The creator's or brand's bio link","The brand's website",'A marketplace listing','A physical store','No path: awareness only'];
  const igAll=[...all,...(R.ig.Amante?[{brand:'Amante'}]:[])].filter(b=>R.ig[b.brand]);
  function igEx(g){const e=g.examples['Comment for the link (DM)']||g.examples['Use my code']||Object.values(g.examples)[0];const it=e&&ITEMS.find(x=>x.src==='ig'&&x.code===e.code);
    return it?`<a href="#" class="exl" data-ig="${it.code}">${it.poster?`<img src="media/${it.poster}">`:''}<span>View</span></a>`:'–'}
  const cell3=(arr,k)=>{const x=(arr||[]).find(z=>z[0]===k);return x?x[2]:'–'};
  const lands=['Product page','Collection / category','Campaign page','Homepage','Store finder / map','Social profile / chat','Marketplace'];
  const spk=['Comment to get the link (DM funnel)','Shop now / tap the link','Link in bio','Use my code','Visit a store'];
  const cta=`<h3>The button</h3>`+tbl(['Brand','Main button','Out of 100','Other buttons'],all.map(b=>[lg(b),esc((b.cta_button[0]||['–'])[0]),(b.cta_button[0]||[0,0,'–'])[2],
     esc(b.cta_button.slice(1).map(c=>`${c[0]} (${c[1]})`).join(', ')||'–')]))+
    `<h3>What the creator says</h3><p class="note">Out of every 100 transcribed creator videos with a spoken call to action.</p>`+tbl(['Brand','Videos with a spoken CTA',...spk,'Said, for example','Example'],
     all.map(b=>[lg(b),N(b.spoken_n),...spk.map(k=>cell3(b.cta_spoken,k)),esc(b.cta_spoken_raw.slice(0,2).join(' · ')||'–'),exLink(b.cta_example,'View')]),'wide')+
    `<h3>Where the click lands</h3><p class="note">Out of every 100 live ads, from each ad's link.</p>`+tbl(['Brand',...lands],all.map(b=>[lg(b),...lands.map(k=>cell3(b.landing,k))]),'wide')+
    `<ul class="rul"><li><b>The button barely differs.</b> Almost every brand uses "Shop Now"; Jockey Woman uses "Learn More" on all ${jw.ads} ads, and Victoria's Secret sends ${cell3(vs.cta_button,'Visit Instagram Profile')} in 100 to its Instagram profile.</li>
     <li><b>The spoken CTA is where brands differ.</b> Nykd's creators say "comment for the link" in ${cell3(nk.cta_spoken,'Comment to get the link (DM funnel)')} in 100 videos, so the comment section becomes a DM funnel. Enamor does the same (${cell3(H.cta_spoken,'Comment to get the link (DM funnel)')} in 100, e.g. "${esc(H.cta_spoken_raw[0]||'')}"). Underneat mostly says "shop now" (${cell3(ul.cta_spoken,'Shop now / tap the link')} in 100).</li>
     <li><b>Landing is the biggest gap.</b> Nykd sends ${cell3(nk.landing,'Product page')} in 100 ads straight to a product page. Enamor sends ${cell3(H.landing,'Campaign page')} in 100 to a campaign page and ${cell3(H.landing,'Collection / category')} to a collection, so the shopper still has to find the product.</li>
     <li><b>Zivame pushes stores.</b> ${cell3(zv.landing,'Store finder / map')} in 100 of its ads open a store finder, which fits its 170+ store roll-out.</li></ul>`+
    `<h3>Instagram creator posts: what they ask for (inferred)</h3>
     <p class="note">Instagram collab posts have no button or link, so the ask is read from what the creator says (transcript) and, if they say nothing, the caption. Destination is our assumption of where that ask sends the shopper. Tagged handles, hashtags and brand names don't count.</p>`+
    tbl(['Brand','Posts','Ask to buy (any)','Paid label vs plain collab',...igAsks,'Example'],igAll.map(b=>{const g=R.ig[b.brand];return [lg(b),N(g.posts),g.shop_ask+' in 100',
      `${g.shop_ask_paid??'–'} vs ${g.shop_ask_collab??'–'} <span class="note">(${g.paid_n} / ${g.collab_n} posts)</span>`,...igAsks.map(k=>cell3(g.asks,k)),igEx(g)]}),'wide')+
    `<h3>Where those asks send the shopper (assumption)</h3>`+tbl(['Brand',...igDest],igAll.map(b=>{const g=R.ig[b.brand];return [lg(b),...igDest.map(k=>cell3(g.dest,k))]}),'wide')+
    `<ul class="rul"><li><b>Enamor's creators ask to buy in ${R.ig.Enamor.shop_ask} in 100 posts</b>, mostly "comment for the link" (${cell3(R.ig.Enamor.asks,'Comment for the link (DM)')} in 100) or a creator code (${cell3(R.ig.Enamor.asks,'Use my code')} in 100). Several also point to Amazon ratings as proof.</li>
     <li><b>Nykd turns almost every collab into a DM funnel:</b> ${cell3(R.ig['Nykd by Nykaa'].asks,'Comment for the link (DM)')} in 100 posts say "comment for the link".</li>
     <li><b>Underneat mixes DM links (${cell3(R.ig.Underneat.asks,'Comment for the link (DM)')} in 100) with per-creator codes (${cell3(R.ig.Underneat.asks,'Use my code')} in 100, e.g. "11% off with my code").</b> ${cell3(R.ig.Underneat.asks,'No ask')} in 100 posts ask for nothing.</li>
     <li><b>Victoria's Secret and Jockey Woman collabs are pure awareness:</b> ${cell3(R.ig["Victoria's Secret"].asks,'No ask')} and ${cell3(R.ig['Jockey Woman'].asks,'No ask')} in 100 posts ask for nothing. Zivame sends ${cell3(R.ig.Zivame.asks,'Visit a store')} in 100 to a store.</li></ul>`+
    reading(`On Instagram, Enamor's creators already sell hard; the paid ads then carry the same "comment for the link" line. The open question is the landing: the DM link and the ad link should both open the product in the video.`)+
    reading(`Enamor's "comment for the link" line is good for reach (comments lift distribution) but it only pays if the DM lands on the exact product in the video. Test sending creator ads to the product page itself, as Nykd does, and compare sales per click.`);
  const C=CP.brands, cv=CP.validation, cc=(b,k,key)=>{const x=((C[b.brand]||{})[key]||[]).find(z=>z[0]===k);return x?x[2]:'–'};
  const OBJ=['Sales (catalogue)','Sales (website)','Sales or traffic (website)','Awareness / reach','Awareness / video views','Traffic to Instagram profile','Store traffic (local awareness)','App promotion','Awareness'];
  const objs=OBJ.filter(k=>all.some(b=>cc(b,k,'objectives')!=='–'));
  const STG=['Prospecting','Retargeting','Retargeting or Advantage+ broad','Unclear'];
  const camp=`<p>The Ad Library in India shows no objective, budget or targeting. But every choice in Ads Manager leaves a mark on the ad: the button, the format, the link, the placements and the number of versions. Reading those marks gives a likely setup for each ad. These are <b>inferences, not facts</b>; each ad's evidence is listed when you open it.</p>
    <h3>How each clue is read</h3>`+tbl(['Clue in the ad','What it implies in Ads Manager','Confidence'],[
     ['Catalogue ad (DPA, product feed)','Sales objective with a product catalogue; most often shown to people who viewed products','High'],
     ['Dynamic creative (DCO)','Meta mixes several images, videos and texts; works with any objective, so it says nothing about the goal','–'],
     ['"Install now" button or app link','App promotion objective','High'],
     ['"Visit Instagram profile" button','Traffic objective, destination = Instagram profile','High'],
     ['Store finder or map link','Store traffic / local awareness','High'],
     ['"Shop Now" to a product or collection page','Sales (or Traffic) objective to the website','Medium'],
     ['Brand video on one platform only','Awareness / reach, bought platform by platform','Low'],
     ['Every placement incl. Audience Network, Messenger','Automatic (Advantage+) placements: retargeting or an Advantage+ broad campaign','Low'],
     ['"First purchase", NEW10-style codes','Prospecting new customers','Medium'],
     ['"Still thinking?", "back in stock"','Retargeting past visitors','High'],
     ['Several versions of one ad','Dynamic / Advantage+ creative testing','Medium'],
     ['A city or store address in the ad','Local radius targeting','Medium']])+
    `<h3>Likely objective</h3><p class="note">Out of every 100 live ads.</p>`+tbl(['Brand',...objs],all.map(b=>[lg(b),...objs.map(k=>cc(b,k,'objectives'))]),'wide')+
    `<h3>Likely funnel stage</h3>`+tbl(['Brand',...STG],all.map(b=>[lg(b),...STG.map(k=>cc(b,k,'stages'))]),'wide')+
    `<h3>Placements, versions and geography</h3>`+tbl(['Brand','Automatic placements (Advantage+)','Facebook + Instagram','Instagram only','Ads with several versions','Local signals'],
      all.map(b=>{const x=C[b.brand]||{};return [lg(b),cc(b,'Automatic placements (Advantage+)','placements'),cc(b,'Facebook + Instagram (manual or Advantage+)','placements'),cc(b,'Instagram only (manual)','placements'),
        x.multi_version??'–',(x.cities||[]).length?esc(x.cities.map(c=>c[0]+' ('+c[1]+')').join(', ')):(b.brand==='Zivame'?`${cell3(zv.landing,'Store finder / map')} in 100 link to a store finder`:'None stated')]}))+
    `<div class="reading"><b>How sure is this?</b> Only Wacoal names its campaigns in its links (e.g. <i>pr_wacoal_p1_perf_meta_sales_lookalike_oct26</i>, <i>wacoal-bof-rtgs-19-feb-26</i>, <i>prxwacoal-meta_awareness_oct-2026</i>). On those ${cv.ads} ads the rules got the objective right ${cv.objective_right} of ${cv.objective_checked} times and the stage ${cv.stage_right} of ${cv.stage_checked}. Two placement rules were learned from these same ads, so this is a sanity check, not proof. Wacoal's tagged ads are shown with their real label.</div>
    <ul class="rul"><li><b>Enamor looks like a website sales account.</b> ${cc(H,'Sales or traffic (website)','objectives')} in 100 of its ads send "Shop Now" to campaign pages and ${cc(H,'Sales (website)','objectives')} in 100 to collection pages. It runs almost no catalogue ads (${cc(H,'Sales (catalogue)','objectives')}) and no awareness-style ads stand out. ${cc(H,'Automatic placements (Advantage+)','placements')} in 100 use automatic placements; the rest run on Facebook + Instagram only.</li>
     <li><b>Underneat runs a full funnel:</b> creator ads to find new shoppers on website sales (${cc(ul,'Sales (website)','objectives')} in 100), with ${cc(ul,'Automatic placements (Advantage+)','placements')} in 100 on automatic placements, which is how Advantage+ campaigns usually run. Catalogue ads are a small layer (${cc(ul,'Sales (catalogue)','objectives')} in 100).</li>
     <li><b>Nykd splits its buys:</b> ${cc(nk,'Instagram only (manual)','placements')} in 100 of its ads run on Instagram only (creator ads, placed by hand) and the rest on automatic placements.</li>
     <li><b>Victoria's Secret buys Instagram profile visits</b> (${cc(vs,'Traffic to Instagram profile','objectives')} in 100): it is building followers, not sending shoppers to a site. <b>Zivame pushes its app</b> (${cc(zv,'App promotion','objectives')} in 100) and stores. <b>Jockey Woman is the softest buyer:</b> ${cc(jw,'Awareness or traffic','objectives')} in 100 of its ads use "Learn More" to a campaign page, with no catalogue ads.</li></ul>`+
    reading(`What this means for Enamor: its paid mix is weighted to the bottom of the funnel. Underneat and Nykd keep a steady flow of creator ads that find new people, alongside their brand ads. Enamor's ${H.creator_ads} creator ads are the only clear prospecting layer, which ties back to the creator-depth gap.`);
  const celeb=tbl(['Brand','Celebrity / face','Creators in ads','Top creators (ads)','Example'],all.map(b=>[lg(b),b.celebrities.length?esc(b.celebrities.map(c=>`${c[0]} (${c[1]})`).slice(0,2).join(', ')):'None',
     N(b.collaborators),esc(b.top_collab.slice(0,4).map(c=>`${c[0]} (${c[1]})`).join(', ')||'–'),exLink(b.celeb_example||b.collab_example,'View')]))+
    `<h3>Two creator playbooks</h3><ul class="rul"><li><b>Underneat: wide.</b> ${ul.collaborators} creators across ${ul.creator_ads} creator ads; the biggest, ${esc((ul.top_collab[0]||[''])[0])}, has ${(ul.top_collab[0]||[0,0])[1]}. No single creator carries the brand.</li>
     <li><b>Enamor: deep.</b> ${H.collaborators} creators; ${top2.map(c=>`${esc(c[0])} (${c[1]})`).join(' and ')} make ${top2n} of ${H.creator_ads}. Each has a personal code, which makes results clean to read but leaves little room to learn which creator types work.</li>
     <li><b>Wacoal: one face.</b> Rakul Preet Singh is named in ${celebWC} of ${wc.ads} ads. Like a celebrity-founder brand, the message needs her to work.</li></ul>`;

  const hidden=`<ol class="rlist big">
    <li><b>Victoria's Secret India is selling gifts, not bras.</b> ${fragVS} of its ${vs.ads} live ads are fragrance or beauty and ${brideVS} are bridal or sets; only ${share(vs,'Everyday bras')} sell everyday bras. It competes with Enamor for the special occasion, not the daily drawer.</li>
    <li><b>Shapewear is a one-brand category on Meta.</b> Underneat runs ${share(ul,'Shapewear / bodysuits')} of the ${shapeTot.ads} shapewear ads. If Enamor enters, it enters Underneat's conversation, so it needs a distinct angle (comfort shapewear for all-day wear fits Enamor's lane).</li>
    <li><b>The legacy brands have stepped back from creators in paid.</b> Victoria's Secret, Wacoal, Zivame and Jockey Woman run ${vs.creator_ads+wc.creator_ads+zv.creator_ads+jw.creator_ads} creator ads between them. Their organic Instagram collabs exist (see Overview), but they don't put them behind paid media. Enamor is already ahead of them here.</li>
    <li><b>Nykd wins on specific problems.</b> Its angles name the situation: fitted tops, any neckline, heavy busts, summer sweat. Talking-head creators open ${talk(nk)} in 100 of its ads. That is the clearest template for scaling Enamor's comfort story into many specific stories.</li>
    <li><b>Underneat's volume is its strategy.</b> ${N(ul.ads)} live ads, ${N(ul.new14)} launched in two weeks, ${ul.collaborators} creators. It treats creative like a test pipeline, not a campaign. Matching its volume is expensive; matching its testing habit (many creators, short runs, keep winners) is not.</li>
    <li><b>Zivame chases shoppers who already browsed.</b> ${zv.formats['Catalogue (product feed)']} in 100 of its ads are catalogue ads and ${cc(zv,'App promotion','objectives')} in 100 push its app. It harvests demand; Underneat and Nykd create it. Jockey Woman runs dynamic creative image mixes (${jw.formats['Dynamic creative / carousel']} in 100) and has no creators in paid.</li></ol>`;

  const method=`<ul class="rul"><li>Source: Meta Ad Library, each brand's Facebook page, ads live in India on the pull date (${esc(pull)}). The Library gives no spend or reach; every number is a count of live ads.</li>
    <li>Each ad's angle, product category, offer, frame, tone, opening and any celebrity were read by an AI model (Groq) from the ad text and, for creator videos, the transcript. Angles were then grouped into at most 8 per brand.</li>
    <li>"Trend" uses launch dates of ads live today; the Library does not show stopped ads, so it signals refresh speed, not proven growth. Underneat swaps ads within about two weeks, so most of its angles read "Growing fast".</li>
    <li>Example ads are the longest-running live ad in each row, the Library's closest sign of an ad that keeps working.</li>
    <li>Prices come from each brand's own site product feed; Amante has no Facebook ad page we could find, so it has no ad rows.</li></ul>`;

  $('#page').innerHTML=`<div class="card rhero"><div><div class="eyebrow">Competitive intelligence · Meta ads</div><h1>Enamor Meta Ads Strategy Report</h1>
     <p>Enamor vs Underneat, Nykd by Nykaa, Victoria's Secret, Wacoal, Zivame and Jockey Woman: what each runs on Meta right now, and what it means for Enamor.</p></div>
     <div class="rstats"><a class="btn primary" style="align-self:center" href="research/Enamor_Competitive_Analysis_Nov2026.xlsx" download>Download research workbook (.xlsx)</a><div><b>${N(tot)}</b><small>Live ads tracked</small></div><div><b>${all.length}</b><small>Brands analysed</small></div><div><b>Nov 2026</b><small>Report period</small></div></div></div>
    <nav class="rtoc">${nav.map(([k,t])=>`<a href="#" data-s="${k}">${t}</a>`).join('')}</nav>
    ${sec('exec','Executive summary','Three things define the market right now',exec)}
    ${sec('market','Market overview','',market)}
    ${sec('land','Competitive landscape','',land)}
    ${sec('enamor','Enamor: the current strategy','What Enamor runs on Meta today',enamor)}
    ${sec('angles','Ad angle strategy','What angles each rival is running',angles)}
    ${sec('format','Content format & style','',format)}
    ${sec('msg','Messaging architecture','How each brand frames its story',msg)}
    ${sec('cat','Product category map','Which products each brand advertises, and where nobody does',cat)}
    ${sec('lang','Language strategy','',lang)}
    ${sec('price','Pricing & offers','',price)}
    ${sec('cta','Calls to action','The button, what creators say, and where the click lands',cta)}
    ${sec('camp','Campaign setup (inferred)','What each brand is probably running, read from how its ads are built',camp)}
    ${sec('celeb','Celebrity & creator strategy','',celeb)}
    ${sec('hidden','Hidden insights','What the numbers say that the ads don\'t',hidden)}
    ${sec('method','Method & limits','',method)}`;
  $('#page').querySelectorAll('.rtoc a').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('r_'+a.dataset.s).scrollIntoView({behavior:'smooth',block:'start'})});
  $('#page').querySelectorAll('[data-ig]').forEach(e=>e.onclick=ev=>{ev.preventDefault();open(ITEMS.find(x=>x.src==='ig'&&x.code===e.dataset.ig))});
  $('#page').querySelectorAll('[data-ad]').forEach(e=>e.onclick=ev=>{ev.preventDefault();open(adById(e.dataset.ad))});
}
const pctS=(n,d)=>d?`${Math.round(100*n/d)} in every 100`:'–';
const fmtF=n=>n?fmt(n):'–';
const trendCell=t=>`<span class="trend ${t==='New'?'t-new':t==='Growing fast'?'t-up':'t-flat'}">${esc(t)}</span>`;
function angTag(b){return {"Underneat":"Creator volume machine","Nykd by Nykaa":"Problem-specific creator stories","Victoria's Secret":"Fragrance, bridal and glamour","Wacoal":"One celebrity plus heritage","Zivame":"Catalogue deals","Jockey Woman":"Fresh catalogue push"}[b.brand]||''}
