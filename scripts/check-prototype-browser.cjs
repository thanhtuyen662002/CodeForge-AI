// Optional local browser QA using an already installed Playwright/Chromium. No dependency install.
const {chromium}=require(process.env.CODEFORGE_PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const http=require('node:http');const path=require('node:path');
const root=path.resolve(__dirname,'../docs/blueprint/prototype');
const files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js','/i18n.js':'i18n.js','/messages.js':'messages.js'};
const server=http.createServer((req,res)=>{
 const file=files[new URL(req.url,'http://127.0.0.1').pathname];
 if(req.method!=='GET'||!file){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');
 res.end(fs.readFileSync(path.join(root,file)));
});
let base;
const output=path.resolve(__dirname,'../docs/blueprint/qa');
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({headless:true,...(process.env.CODEFORGE_CHROMIUM_PATH ? {executablePath:process.env.CODEFORGE_CHROMIUM_PATH} : {})});
 const errors=[],external=[];let count=0;
 try{
  const page=await browser.newPage({locale:'en-US'});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url())});
  const locales=['en','vi','ja','ko','zh-Hans','de','fr','es','pt-BR'];const screens=['offer','demo','order','library','lab','results','debrief','help','operations'];
  await page.goto(base);assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('href'),'#content');
  for(const locale of locales){
   await page.selectOption('#language-picker',locale);assert.equal(new URL(page.url()).searchParams.get('lang'),locale);
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:900});
    for(const state of ['ready','pending','withdrawn'])for(const screen of screens){
     await page.selectOption('#scenario-picker',state);await page.selectOption('#screen-picker',screen);
     assert.equal(await page.locator('html').getAttribute('lang'),locale);
     assert.equal(await page.locator('#content h1').count(),1);
     assert.equal(await page.locator('#locale-fallback').isHidden(),true);
     const widthInfo=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,expected:innerWidth}));
     assert.ok(widthInfo.actual<=widthInfo.expected+1,`${locale}/${width}/${state}/${screen} overflow ${JSON.stringify(widthInfo)}`);
     if(state!=='ready'&&['lab','results','debrief'].includes(screen))assert.equal(await page.locator('#reflection,[data-action="download"]').count(),0);
     const untranslated=await page.evaluate(locale=>{
      if(locale==='vi')return [];
      const originals=new Set(Object.values(CodeForgeCopy.messages).filter(m=>m.vi!==m[locale]).map(m=>m.vi));
      const out=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
      while(n=walker.nextNode())if(!n.parentElement.closest('[translate="no"],textarea,script,style')&&originals.has(n.textContent.trim()))out.push(n.textContent);
      for(const e of document.querySelectorAll('[placeholder],[aria-label]'))for(const a of ['placeholder','aria-label'])if(originals.has(e.getAttribute(a)))out.push(e.getAttribute(a));
      return out;
     },locale);assert.deepEqual(untranslated,[],`${locale}/${state}/${screen}: untranslated copy`);
     const unknown=await page.evaluate(locale=>{
      const translated=new Set(Object.values(CodeForgeCopy.messages).map(m=>m[locale]));
      const allowed=new Set(['[·]','codeforge','.','/','✓','!','LAB A / 01','LAB B / 02']);
      const out=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
      while(n=walker.nextNode()){
       if(n.parentElement.closest('script,style,textarea,[translate="no"],[data-price-usd]'))continue;
       const value=n.textContent.trim();
      if(value&&!translated.has(value)&&!allowed.has(value)&&!/^\d+$/.test(value))out.push(value);
      }
      for(const e of document.querySelectorAll('[placeholder],[aria-label]'))for(const a of ['placeholder','aria-label']){
       const value=e.getAttribute(a);if(value&&!translated.has(value))out.push(`${a}: ${value}`);
      }
      return out;
     },locale);assert.deepEqual(unknown,[],`${locale}/${state}/${screen}: uncatalogued prose`);
     count++;
    }
   }
   await page.selectOption('#scenario-picker','ready');await page.selectOption('#screen-picker','order');
   assert.match(await page.locator('[data-price-usd]').textContent(),/USD/);
   await page.locator('[data-action="payment"]').click();assert.equal(await page.locator('#scenario-picker').inputValue(),'pending');
   assert.equal(await page.locator('#notice').textContent(),await page.evaluate(l=>CodeForgeCopy.messages.copy097[l],locale));
   await page.selectOption('#screen-picker','help');assert.equal(await page.locator('#request-kind option').count(),4);
  }
  await page.selectOption('#scenario-picker','ready');await page.selectOption('#screen-picker','results');
  await page.locator('#reflection').fill('Private draft stays on my machine');
  await page.selectOption('#language-picker','ja');await page.selectOption('#language-picker','en');
  assert.equal(await page.locator('#reflection').inputValue(),'Private draft stays on my machine');
  assert.equal(await page.locator('#screen-picker').inputValue(),'results');
  await page.selectOption('#screen-picker','help');await page.locator('#help-note').fill('Another private draft');
  await page.selectOption('#request-kind',{index:2});await page.selectOption('#language-picker','ko');
  assert.equal(await page.locator('#request-kind').evaluate(e=>e.selectedIndex),2);
  assert.equal(await page.locator('#help-note').inputValue(),'Another private draft');
  assert.deepEqual(await page.evaluate(()=>[localStorage.length,sessionStorage.length,document.cookie]),[0,0,'']);
  await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'ko');assert.equal(await page.locator('#screen-picker').inputValue(),'offer');
  await page.goto(base+'?lang=not-a-locale');assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.goto(base+'?lang=zh-Hant');assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.goto(base+'?lang=ja');
  await page.evaluate(()=>{delete CodeForgeCopy.messages.copy022.ja;CodeForgeI18n.apply()});
  assert.equal(await page.locator('#locale-fallback').isVisible(),true);
  assert.match(await page.locator('#content h1').textContent(),/The code runs/);
  assert.equal(await page.locator('#content h1 span[lang="en"]').textContent(),'The code runs.');
  await page.goto(base+'?lang=ja');
  await page.selectOption('#screen-picker','help');
  const nativePlaceholder=await page.locator('#help-note').getAttribute('placeholder');
  await page.evaluate(()=>{delete CodeForgeCopy.messages.copy173.ja;CodeForgeI18n.apply()});
  assert.equal(await page.locator('#help-note').getAttribute('lang'),'en');
  assert.match(await page.locator('#help-note').getAttribute('placeholder'),/Do not include company code/);
  await page.evaluate(value=>{CodeForgeCopy.messages.copy173.ja=value;CodeForgeI18n.apply()},nativePlaceholder);
  assert.equal(await page.locator('#help-note').getAttribute('placeholder'),nativePlaceholder);
  assert.equal(await page.locator('#help-note').getAttribute('lang'),'ja');
  assert.equal(await page.locator('#locale-fallback').isHidden(),true);
  const nativeAria=await page.locator('#screen-picker').getAttribute('aria-label');
  const ariaId=await page.evaluate(value=>Object.keys(CodeForgeCopy.messages).find(id=>CodeForgeCopy.messages[id].ja===value),nativeAria);
  assert.ok(ariaId);
  await page.evaluate(id=>{delete CodeForgeCopy.messages[id].ja;CodeForgeI18n.apply()},ariaId);
  assert.equal(await page.locator('#screen-picker').getAttribute('lang'),'en');
  assert.equal(await page.locator('#screen-picker').getAttribute('aria-label'),await page.evaluate(id=>CodeForgeCopy.messages[id].en,ariaId));
  assert.equal(await page.locator('#locale-fallback').isVisible(),true);
  await page.evaluate(({id,value})=>{CodeForgeCopy.messages[id].ja=value;CodeForgeI18n.apply()},{id:ariaId,value:nativeAria});
  assert.equal(await page.locator('#screen-picker').getAttribute('aria-label'),nativeAria);
  assert.equal(await page.locator('#screen-picker').getAttribute('lang'),'ja');
  assert.equal(await page.locator('#locale-fallback').isHidden(),true);
  for(const [locale,width,name] of [['en',1280,'english-desktop'],['ja',390,'japanese-mobile'],['ko',390,'korean-mobile'],['zh-Hans',390,'chinese-mobile'],['vi',390,'vietnamese-mobile'],['de',390,'german-mobile'],['fr',390,'french-mobile'],['es',390,'spanish-mobile'],['pt-BR',390,'portuguese-mobile']]){
   await page.goto(base+'?lang='+locale);await page.setViewportSize({width,height:900});await page.screenshot({path:`${output}/${name}.png`,fullPage:true});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  fs.writeFileSync(`${output}/locales-result.json`,JSON.stringify({checked_at:new Date().toISOString(),browser:browser.version(),locales,screen_state_viewport_cases:count,viewport_widths:[1280,390,320],external_requests:external,errors,checks:['uncatalogued prose guard','text and attribute fallback language','complete rendered translations','placeholder/ARIA text','language URL/reload','unsupported locale fallback','missing message fallback disclosure','preserve unsent input and selected request','four help options','USD price invariant','localized notices','no persistence','keyboard skip'],limits:'Structural/browser checks only; translations are drafts, not native-speaker or instructional approval.'},null,2)+'\n');
  console.log(`PASS: ${count} locale/screen/state/viewport cases; no external requests or browser errors.`);
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
