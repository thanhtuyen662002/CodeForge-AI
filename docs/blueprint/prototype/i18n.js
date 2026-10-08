'use strict';
// Local-only prototype localization. No network, geolocation or persisted profile.
(() => {
  const catalog = window.CodeForgeCopy;
  const tags = catalog.languages.map(item => item.tag);
  const sourceIds = new Map(Object.entries(catalog.messages).map(([id, copy]) => [copy.vi, id]));
  const textIds = new WeakMap();
  const attributeIds = new WeakMap();
  const picker = document.getElementById('language-picker');
  const supported = value => tags.find(tag => tag.toLowerCase() === String(value).toLowerCase());
  function browserMatch(value) {
    const exact = supported(value); if (exact) return exact;
    if (/^zh-(?:hans(?:-|$)|cn$|sg$)/i.test(value)) return 'zh-Hans';
    if (/^zh(?:-|$)/i.test(value)) return undefined; // Do not treat Traditional Chinese as Simplified.
    return supported(String(value).split('-')[0]);
  }
  const requested = new URL(location.href).searchParams.get('lang');
  let locale = requested !== null ? supported(requested) || 'en'
    : (navigator.languages || [navigator.language]).map(browserMatch).find(Boolean) || 'en';
  for (const item of catalog.languages) {
    const option = document.createElement('option');
    option.value = item.tag; option.lang = item.tag; option.textContent = item.name; picker.append(option);
  }
  function copyFor(id) {
    const message = catalog.messages[id];
    const native = message?.[locale];
    return { value: native || message?.en || '', fallback: !native, language: native ? locale : 'en' };
  }
  function text(source) {
    const id = sourceIds.get(source);
    return id ? copyFor(id).value : source;
  }
  function apply() {
    let fallbackCount = 0;
    const fallbackFragments = [];
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, textarea, [translate="no"], [data-price-usd]')) continue;
      let record = textIds.get(node);
      if (!record) {
        const raw = node.textContent;
        const id = sourceIds.get(raw.trim());
        if (!id) continue;
        record = { id, prefix: raw.match(/^\s*/)[0], suffix: raw.match(/\s*$/)[0] };
        textIds.set(node, record);
      }
      const copy = copyFor(record.id);
      node.textContent = record.prefix + copy.value + record.suffix;
      parent.lang = copy.language;
      if (copy.fallback && parent.childNodes.length > 1 && parent.tagName !== 'OPTION') {
        fallbackFragments.push({ node, language: copy.language });
      }
      if (copy.fallback) fallbackCount++;
    }
    // A heading can contain both an English fallback and a translated sentence.
    // Annotate just the fallback fragment after walking, without changing form values.
    for (const fragment of fallbackFragments) {
      const wrapper = document.createElement('span'); wrapper.lang = fragment.language;
      fragment.node.replaceWith(wrapper); wrapper.append(fragment.node);
    }
    for (const element of document.querySelectorAll('[aria-label], [placeholder]')) {
      let records = attributeIds.get(element);
      if (!records) {
        records = {};
        for (const name of ['aria-label', 'placeholder']) {
          const id = sourceIds.get(element.getAttribute(name)); if (id) records[name] = id;
        }
        attributeIds.set(element, records);
      }
      // HTML cannot tag individual attributes. Keep an element's localized
      // attributes in one language if any of them needs an English fallback.
      const useEnglish = Object.values(records).some(id => copyFor(id).fallback);
      for (const [name, id] of Object.entries(records)) {
        const copy = copyFor(id);
        element.setAttribute(name, useEnglish ? catalog.messages[id].en : copy.value);
        if (copy.fallback) fallbackCount++;
      }
      if (Object.keys(records).length) {
        element.lang = useEnglish ? 'en' : locale;
        if (useEnglish && element.tagName !== 'TEXTAREA') {
          // Visible translated captions keep their own language when an ARIA
          // attribute falls back. Text input values are never translated.
          for (const child of [...element.childNodes]) {
            const record = textIds.get(child); if (!record) continue;
            const language = copyFor(record.id).language;
            if (language === 'en') continue;
            const wrapper = document.createElement('span'); wrapper.lang = language;
            child.replaceWith(wrapper); wrapper.append(child);
          }
        }
      }
    }
    for (const price of document.querySelectorAll('[data-price-usd]')) {
      price.textContent = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(49);
    }
    document.getElementById('locale-fallback').hidden = fallbackCount === 0;
    picker.value = locale;
  }
  picker.addEventListener('change', () => {
    locale = supported(picker.value) || 'en';
    const url = new URL(location.href); url.searchParams.set('lang', locale);
    history.replaceState(null, '', url);
    apply();
    document.dispatchEvent(new Event('codeforge:language'));
    // No rerender: preserve screen, scenario, open details and unsent form input.
  });
  window.CodeForgeI18n = { apply, text };
})();
