/* Public, versioned growth guidance. Saved execution plans remain in Studio state. */
(() => {
  'use strict';

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const language = value => value === 'en' ? 'en' : 'zh';
  const localize = (value, lang) => value && typeof value === 'object'
    ? String(value[lang] ?? value.zh ?? value.en ?? '') : String(value ?? '');
  const choose = (lang, zh, en) => lang === 'en' ? en : zh;
  const content = () => window.CalDockGrowthContent || {version: '', sections: [], sources: []};
  const lines = value => escapeHTML(value).replace(/\n/g, '<br>');
  const paragraphs = value => String(value || '').split(/\n\s*\n/).filter(Boolean)
    .map(paragraph => `<p>${lines(paragraph)}</p>`).join('');
  const safeURL = value => {
    try {
      const url = new URL(String(value));
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const sectionID = index => `growth-section-${index + 1}`;

  function tableHTML(block, lang) {
    const columns = Array.isArray(block.columns) ? block.columns : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    if (!columns.length || !rows.length) return '';
    const title = localize(block.title, lang);
    const mobileClass = columns.length <= 4 ? ' growth-table--cards' : '';
    return `<div class="growth-table-scroll" role="region" aria-label="${escapeHTML(title)}" tabindex="0">
      <table class="growth-table${mobileClass}" role="table">
        <caption class="growth-sr-only">${escapeHTML(title)}</caption>
        <thead role="rowgroup"><tr role="row">${columns.map(column => `<th scope="col" role="columnheader">${lines(localize(column, lang))}</th>`).join('')}</tr></thead>
        <tbody role="rowgroup">${rows.map(row => `<tr role="row">${columns.map((column, index) => `<td role="cell" data-label="${escapeHTML(localize(column, lang))}">${lines(localize(row[index], lang))}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  }

  function blockHTML(block, lang, index, sectionIndex) {
    const title = localize(block.title, lang);
    const items = Array.isArray(block.items) ? block.items : [];
    return `<section class="growth-block" aria-labelledby="growth-block-${sectionIndex + 1}-${index + 1}">
      <h4 id="growth-block-${sectionIndex + 1}-${index + 1}">${escapeHTML(title)}</h4>
      ${block.body ? `<div class="growth-prose">${paragraphs(localize(block.body, lang))}</div>` : ''}
      ${tableHTML(block, lang)}
      ${items.length ? `<ul class="growth-list">${items.map(item => `<li>${lines(localize(item, lang))}</li>`).join('')}</ul>` : ''}
    </section>`;
  }

  function sourcesHTML(sources, lang) {
    if (!sources.length) return '';
    return `<aside class="growth-sources" aria-labelledby="growth-sources-heading">
      <div class="growth-sources-heading"><span class="growth-eyebrow">SOURCE NOTES</span><h3 id="growth-sources-heading">${choose(lang, '依据与核验', 'Sources & verification')}</h3></div>
      <ol>${sources.map(source => {
        const url = safeURL(source.url);
        const title = escapeHTML(localize(source.title, lang));
        return `<li>${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${title}<span aria-hidden="true"> ↗</span></a>` : `<span>${title}</span>`}${source.note ? `<p>${lines(localize(source.note, lang))}</p>` : ''}</li>`;
      }).join('')}</ol>
    </aside>`;
  }

  function render(requestedLanguage, options = {}) {
    const lang = language(requestedLanguage);
    const plan = content();
    const sections = Array.isArray(plan.sections) ? plan.sections : [];
    const sources = Array.isArray(plan.sources) ? plan.sources : [];
    const canEdit = options.canEdit !== false;
    return `<section class="growth-playbook" aria-labelledby="growth-title">
      <header class="growth-hero">
        <div class="growth-hero-top"><span class="growth-eyebrow">CALDOCK / GROWTH PLAYBOOK</span><span class="growth-version">${escapeHTML(plan.version || '90D')}</span></div>
        <div class="growth-hero-body">
          <div class="growth-hero-copy"><h2 id="growth-title">${choose(lang, '从第一位客户，<br>走到持续增长。', 'From the first customer<br>to repeatable growth.')}</h2><p>${choose(lang, '把合作、内容、企业销售和 AI 辅助拓展，连成一套能执行、能成交、能复盘的增长方案。', 'Connect partnerships, content, enterprise sales and AI-assisted outreach with a sales process you can execute and improve.')}</p></div>
          <div class="growth-priorities" aria-label="${choose(lang, '执行原则', 'Operating priorities')}">
            <div><span>01</span><p><strong>${choose(lang, '找到值得服务的任务', 'Qualify the work')}</strong>${choose(lang, '按需求、预算与交付条件筛选客户', 'Confirm the task, budget and delivery fit')}</p></div>
            <div><span>02</span><p><strong>${choose(lang, '让获客接上成交', 'Connect acquisition to sales')}</strong>${choose(lang, '每条渠道都有下一步与负责人', 'Give every channel a next step and an owner')}</p></div>
            <div><span>03</span><p><strong>${choose(lang, '用留存判断增长质量', 'Measure durable value')}</strong>${choose(lang, '从首次任务完成，跟到续费和转介绍', 'Track the first task, retention and referrals')}</p></div>
          </div>
        </div>
        <div class="growth-hero-foot"><div class="growth-chips"><span>${choose(lang, '90 天执行计划', '90-day operating plan')}</span><span>${sections.length} ${choose(lang, '个专题', 'chapters')}</span><span>${choose(lang, '中 / English', '中文 / English')}</span></div><p>${choose(lang, '预算、转化率与销售目标均为待验证的规划假设。', 'Budgets, conversion rates and sales targets are planning assumptions to validate.')}</p></div>
      </header>

      <div class="growth-controls" role="group" aria-label="${choose(lang, '增长方案操作', 'Growth plan actions')}">
        <button class="btn primary" data-action="growth-export">${choose(lang, '导出完整增长方案', 'Export full growth plan')}</button>
        <button class="btn" data-action="growth-template" ${canEdit ? '' : `disabled title="${choose(lang, '修改共享执行计划需要编辑权限', 'Editing the shared execution plan requires access')}"`}>${choose(lang, '采用新版执行模板', 'Adopt execution template')}</button>
        <button class="btn" data-action="growth-crm">${choose(lang, '下载销售跟进表', 'Download sales tracker')}</button>
        <button class="btn" data-action="growth-expand">${choose(lang, '展开 / 收起全部', 'Expand / collapse all')}</button>
        <a class="growth-execution-link" href="#growth-execution">${choose(lang, '进入我的执行计划', 'Go to my execution plan')} <span aria-hidden="true">↓</span></a>
      </div>

      <nav class="growth-nav" aria-label="${choose(lang, '增长方案目录', 'Growth playbook contents')}">${sections.map((section, index) => `<a href="#${sectionID(index)}" data-growth-target="${sectionID(index)}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHTML(localize(section.title, lang))}</a>`).join('')}</nav>

      <div class="growth-chapters">${sections.map((section, index) => `<details class="growth-section" id="${sectionID(index)}" data-growth-section="${escapeHTML(section.id || String(index + 1))}" ${index === 0 ? 'open' : ''}>
        <summary><span class="growth-section-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h3>${escapeHTML(localize(section.title, lang))}</h3><span class="growth-section-toggle" aria-hidden="true"></span></summary>
        <div class="growth-section-body">${section.intro ? `<div class="growth-section-intro">${paragraphs(localize(section.intro, lang))}</div>` : ''}${(section.blocks || []).map((block, blockIndex) => blockHTML(block, lang, blockIndex, index)).join('')}</div>
      </details>`).join('')}</div>

      ${sourcesHTML(sources, lang)}
      <div class="growth-handoff"><div><span class="growth-eyebrow">PLAN → ACTION</span><h3>${choose(lang, '把策略变成本周的下一步。', 'Turn the strategy into this week’s next steps.')}</h3><p>${choose(lang, '下方执行计划保留已保存的预算、话术与任务。采用新版建议前，请先核对团队已有安排。', 'The execution plan below keeps your saved budgets, copy and tasks. Review existing commitments before applying the recommendations.')}</p></div><a href="#growth-execution" class="growth-execution-link">${choose(lang, '查看执行计划', 'View execution plan')} <span aria-hidden="true">↓</span></a></div>
    </section>`;
  }

  function exportMarkdown(requestedLanguage) {
    const lang = language(requestedLanguage);
    const plan = content();
    const sections = Array.isArray(plan.sections) ? plan.sections : [];
    const sources = Array.isArray(plan.sources) ? plan.sources : [];
    const cell = value => localize(value, lang).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
    const output = [
      choose(lang, '# CalDock · 90 天销售增长方案', '# CalDock · 90-day Sales Growth Playbook'),
      '',
      choose(lang, `版本：${plan.version || '90D'}`, `Version: ${plan.version || '90D'}`),
      '',
      choose(lang, '预算、转化率与销售目标均为待验证的规划假设；本文件为增长建议，不代表已发生的销售或已授权的外联。', 'Budgets, conversion rates and sales targets are planning assumptions. This playbook is guidance, not a record of actual sales or authorization to contact anyone.'),
      ''
    ];
    sections.forEach((section, index) => {
      output.push(`## ${String(index + 1).padStart(2, '0')} · ${localize(section.title, lang)}`, '');
      if (section.intro) output.push(localize(section.intro, lang), '');
      (section.blocks || []).forEach(block => {
        output.push(`### ${localize(block.title, lang)}`, '');
        if (block.body) output.push(localize(block.body, lang), '');
        if (Array.isArray(block.columns) && block.columns.length && Array.isArray(block.rows) && block.rows.length) {
          output.push(`| ${block.columns.map(cell).join(' | ')} |`, `| ${block.columns.map(() => '---').join(' | ')} |`);
          block.rows.forEach(row => output.push(`| ${block.columns.map((_, index) => cell(row[index])).join(' | ')} |`));
          output.push('');
        }
        if (Array.isArray(block.items) && block.items.length) {
          block.items.forEach(item => output.push(`- ${localize(item, lang).replace(/\n/g, '\n  ')}`));
          output.push('');
        }
      });
    });
    if (sources.length) {
      output.push(choose(lang, '## 依据与核验', '## Sources & verification'), '');
      sources.forEach((source, index) => {
        const url = safeURL(source.url).replace(/\(/g, '%28').replace(/\)/g, '%29');
        const title = localize(source.title, lang).replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        output.push(`${index + 1}. ${url ? `[${title}](${url})` : title}${source.note ? ` — ${localize(source.note, lang)}` : ''}`, '');
      });
    }
    return output.join('\n').trimEnd() + '\n';
  }

  // In-page navigation opens its chapter; print always includes collapsed chapters.
  if (typeof document !== 'undefined') {
    document.addEventListener('click', event => {
      const link = event.target?.closest?.('[data-growth-target]');
      if (!link) return;
      const section = document.getElementById(link.dataset.growthTarget);
      if (section?.matches('details[data-growth-section]')) section.open = true;
    });
    let printState = [];
    window.addEventListener('beforeprint', () => {
      printState = [...document.querySelectorAll('details[data-growth-section]')].map(section => [section, section.open]);
      printState.forEach(([section]) => { section.open = true; });
    });
    window.addEventListener('afterprint', () => {
      printState.forEach(([section, wasOpen]) => { section.open = wasOpen; });
      printState = [];
    });
  }

  window.CalDockGrowth = {render, exportMarkdown};
})();
