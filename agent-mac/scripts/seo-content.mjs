export const siteUrl = 'https://wodemac.com';
export const verifiedDate = '2026-11-07';
export const guides = [
  {
    slug: 'mac-mini-rental',
    title: '美国加州 Mac mini 租赁：费用、用途与选型',
    description: '了解 wodeMac 美国加州独享 Mac mini 的租赁范围、四种付款周期、模型费用边界、远程开发与测试用途，以及下单前要确认的配置和交付事项。',
    answer: 'wodeMac 提供位于美国加州、由一位客户独享的实体 Mac mini，用于软件开发与测试。租机费用与第三方 AI 账号、订阅和模型用量分开；应先确认项目、配置、远程连接和账号资格，再选择付款周期。',
    sections: [
      ['租到的是整台机器，还是共享虚拟机？', '<p>服务条款说明，每台 Mac mini 只租给一位客户，不拆分给不同客户共用。你通过远程桌面或相应开发工具使用这台机器，可以为团队选择多台。具体芯片、内存、存储、远程访问方式和可交付台数，应以下单页面及确认的交付清单为准。</p><p>独享机器不等于只有客户能以任何方式访问：为了维护与排障，wodeMac 和托管服务商保留管理权限。涉及客户代码、密钥或商业数据时，应先确认访问权限、备份和团队共享安排。</p>'],
      ['可以用来做什么？', '<p>当前服务范围为软件开发与测试，例如制作产品原型、开发网页或小工具、运行自动化脚本、安装开发依赖，以及执行构建与测试。选择环境时，先列出操作系统、依赖、内存和存储需求，再用实际项目验证。</p><p>加州机器不是第三方 AI 服务的资格替代品。Claude Code、Codex 等工具使用客户本人或企业持有的账号，并遵守各自的地区、年龄、付款和使用规则。</p>'],
      ['租金和模型费用怎样区分？', '<p>下表为当前单台基础租赁方案，币种为美元，按所选周期一次支付。它不是完整 AI 订阅套餐，也不代表模型调用额度。第三方账号、订阅及其他约定服务的费用需单独确认。</p>{{PRICE_TABLE}}<p>需要多台、合同或配套支持时，请查看当前结算页与服务条款，另行确认报价、续订和退款条件。本指南不把合作方案中的测算数字作为实际成交价。</p>'],
      ['下单前的核对清单', '<ol><li>确定一个需要交付的开发任务，以及谁负责验收。</li><li>确认芯片、内存、磁盘、系统和依赖是否满足该项目。</li><li>确认远程连接方式及你所在网络到加州的实际体验。</li><li>确认第三方工具账号、订阅、地区与年龄资格。</li><li>核对一次支付金额、计费起点、交付期限、续订及退款条款。</li><li>确定代码、权限、备份和服务结束时的数据处理方式。</li></ol><p>官网当前说明通常 24 小时内交付，最迟 3 个工作日，计费从付款当天开始。以当前订单和服务条款为准；“已提交订单”不等于付款或交付完成。</p>'],
    ],
    faqs: [
      ['租 Mac mini 是否包含 Claude 订阅？', '机器租金与第三方 AI 账号、订阅及模型用量分开。下单前逐项确认费用，不把机器租赁当作 Claude 订阅或使用资格。'],
      ['国内用户可以远程连接吗？', '能否顺畅连接取决于你所在网络、所用远程工具和项目要求。应先确认连接方式和实际体验；本指南不承诺所有国内网络具有相同延迟或可用性。'],
      ['可以先只租一台吗？', '可以从一台和一个真实开发任务开始，确认配置、付款周期与验收要求，再决定是否为团队增加机器。实际可预订台数以当前服务信息为准。'],
    ],
  },
  {
    slug: 'claude-code-remote-mac',
    title: '用远程 Mac 运行 Claude Code：准备与验收指南',
    description: '在租用远程 Mac 前，确认 Claude Code 账号与地区资格、项目权限、开发依赖、远程连接、构建测试及验收方式。机器与模型订阅分别核算。',
    answer: '远程 Mac 的作用是提供持续的开发与测试环境，保留项目、依赖和任务上下文。使用 Claude Code 前仍须具备符合官方规则的账号及服务资格；机器所在地、网络出口或租赁付款不能代替这些条件。',
    sections: [
      ['先确认账号与项目条件', '<p>先检查你本人或企业能否按 Anthropic 当前规则使用 Claude Code，账号是否由正确主体持有，以及订阅或 API 计费是否满足项目需要。wodeMac 提供机器与约定的环境支持，不转售、代持或共享第三方账号。</p><p>准备一个获得授权的代码仓库，写清项目负责人、要完成的任务和可以修改的范围。不要把生产密钥、客户数据或管理员权限直接塞进第一次试验；按照项目实际权限与数据要求配置。</p>'],
      ['连接与环境准备', '<ol><li>按交付说明完成首次远程登录，确认 macOS 和开发工具版本。</li><li>在客户授权范围内设置仓库访问，核实依赖安装与项目目录。</li><li>由客户通过官方流程登录自己的 Claude Code 账号或配置适用的服务方式。</li><li>先运行项目原有的构建、测试或检查命令，保存开始时的状态。</li><li>把需求拆成一个能验证的小任务，确认预期结果和禁止修改的内容。</li></ol><p>具体安装方式和系统要求会更新，执行前阅读 Claude Code 官方文档。不要把某一份安装命令长期当作唯一正确做法。</p>'],
      ['用真实任务验收', '<p>适合第一轮验收的任务包括：修复一个可复现问题、增加一项小功能、补齐一组有实际意义的测试，或把原型推进到可演示状态。记录任务输入、修改内容、检查命令、人工审查和可采用的结果。</p><p>同一项目应比较可复核的用时、返工与成果质量，不用未经验证的“提效几倍”代替验收。构建通过也不代表生产环境已经部署，更不代表业务收入发生变化。</p>'],
      ['持续运行与交接', '<p>远程机器可保留代码与依赖，但任务能否持续运行仍取决于电源、网络、进程、账号额度和工具状态。重要任务应保留日志、版本提交和明确的停止条件。不要把“全天候机器”表述为每个 Agent 任务都保证不中断。</p><p>验收后由负责人检查代码差异、权限和数据处理，再按项目流程决定是否合并或部署。服务结束前按条款安排导出、备份与数据清理。</p>'],
    ],
    faqs: [
      ['租一台美国 Mac 就一定能使用 Claude Code 吗？', '不能。客户仍须符合 Anthropic 当前的账号、地区、年龄及其他使用条件。机器所在地或网络出口不能替代资格。'],
      ['机器租金是否增加 Claude 的模型额度？', '不会因租用机器自动增加第三方订阅或模型额度。机器、第三方订阅和模型用量应分别核算。'],
      ['怎样判断这个环境适不适合我的项目？', '使用已获授权的真实项目，先跑原有构建与测试，再完成一个边界清楚的小任务，检查连接体验、结果质量与成本。'],
    ],
  },
  {
    slug: 'teams-and-educators',
    title: '出海开发团队与 AI 编程老师怎样选择远程 Mac',
    description: '按出海开发团队、成年 AI 编程老师和实施服务商的真实项目，确认独享远程 Mac 的任务、权限、交付物、验收及支持边界。',
    answer: '出海开发团队应先选择影响开发交付的真实任务；AI 编程老师应先跑通自己的可复现课程项目。两类客户都需要先核对账号资格、代码权限、环境配置和验收方式，再讨论机器数量和服务费用。',
    sections: [
      ['出海开发团队：先选一个项目', '<p>如果团队正在开发海外产品，可从产品原型、已有项目的一项功能、自动化脚本或构建测试开始。指定一个负责业务判断和代码验收的人，确定哪些结果可以被直接采用，哪些仍需要人工审查。</p><p>多台机器的需求应来自项目隔离、并行任务、权限或配置要求，而不是简单按团队人数推算。先核实单台机器的实际适配，再扩展到更多岗位和项目。</p>'],
      ['AI 编程老师：先完成自己的课程作品', '<p>选择一个老师本人有权使用、可以反复演示的编程项目，例如小网页、互动工具或自动化脚本。把需求、版本、操作过程、常见错误和验收命令一起整理，课程价值来自可复现的方法与真实作品。</p><p>老师认可环境和支持后，再讨论是否适合向有真实需求的成年学员或企业客户介绍。推广与教学分开表达，说明合作关系和费用，不承诺招生、收入或学习效果。</p>'],
      ['实施伙伴：先划清责任', '<p>业务诊断、代码开发、机器配置、第三方订阅、客户支持和故障处理，分别由谁承担，应写入交付清单。wodeMac 的机器租赁不自动包含第三方账号、应用开发合同或无限支持。</p><p>使用客户代码和业务数据之前，确认授权范围和共享方式。只有经客户授权的案例才能对外展示；没有授权或还未完成的项目，不能写成成功案例。</p>'],
      ['家庭编程场景如何沟通？', '<p>如涉及家庭共同创作，咨询和工具操作先由成年家长负责，并确认第三方工具的年龄、地区和账号条件。先选择一个适合共同完成的编程作品，再确认参与时间、环境与支持范围。</p><p>远程机器不能替代教师或家长的判断，也不保证学习成绩、升学、收入或某种能力提升。不要以未成年人的个人资料作为营销线索。</p>'],
    ],
    faqs: [
      ['老师是否必须先成为推广伙伴？', '不必。可以先按客户身份确认自己的项目和环境是否适合，认可价值后再单独讨论推广合作。'],
      ['能否把示意图当成客户成果？', '不能。场景示意、演示数据和真实客户案例应明确区分；公开客户成果需要授权和可核对的事实。'],
      ['团队采购前需要准备什么？', '准备项目负责人、实际任务、所需配置、代码和数据授权、账号资格、预算范围及验收方法，再确认机器台数和服务清单。'],
    ],
  },
  {
    slug: 'partners',
    title: 'Mac mini 租赁渠道合作：推广、经销与常见问题',
    description: '了解 wodeMac 推广伙伴与经销商的区别、客户首单佣金、归属与结算核对、交付分工、合作内容披露和联系入口。',
    answer: 'wodeMac 面向拥有开发团队、AI 编程教学或实施客户资源的伙伴开放合作。推广伙伴通过专属链接介绍客户，按符合规则的客户首单真实付款计佣；经销商的合作方式、价格和支持边界另行确认。',
    sections: [
      ['推广伙伴与经销商有什么区别？', '<p>推广伙伴登录后生成专属链接，介绍有真实开发或测试需求的客户，佣金以系统归属和有效首单为依据。经销商则需要单独确认客户关系、报价、合同、交付责任和支持安排。没有签约或确认合作前，候选对象不能称为已合作伙伴。</p><p>适合先讨论的对象包括 AI 编程老师、出海开发服务商、企业 IT 与 AI 实施团队。先选一个真实需求，明确服务能否交付，再决定是否持续推荐。</p>'],
      ['首单佣金怎样计算？', '<p>官网当前公布的客户首单佣金为：月付 5%、季付 7.5%、半年付 10%、年付 15%。续费、注册、未付款和退款订单不计佣，只有一级推广奖励。实际明细由账户中的有效订单与归属记录确认，每月对账，人工结算。</p><p>这些比例不保证任何人会获得收入。链接发出、客户访问或订单创建，都不等于已付费或已产生可结算佣金。管理员配置及正式规则如有更新，应先核对再传播。</p>'],
      ['合作前应确认哪些事？', '<ol><li>伙伴主要服务谁，是否存在明确的开发或测试任务。</li><li>客户同意由谁联系，代码、资料和账号怎样授权。</li><li>机器、环境、项目实施、第三方订阅及售后各由谁负责。</li><li>客户归属、链接有效条件、退款处理、结算凭据与争议处理如何核对。</li><li>经销价格、整套服务费用及合同条款是否已书面确认。</li></ol><p>批量报价与整套配套服务费用需要按当前官网结算和确认报价处理，不把营销方案测算当成自动生效的商业协议。</p>'],
      ['怎样开始一场有效的合作沟通？', '<p>提供你服务的客户类型和一个真实项目即可开始。第一轮先讨论客户要完成什么、现有环境缺什么、谁负责验收，以及双方能够承担的交付环节；不需要先发送私人客户表或账号密码。</p><p>推广内容应如实说明合作关系，遵守所在平台规则。对方拒绝或要求停止后，不继续追发；不买私人通讯录、不群发、不用虚构案例或收入承诺吸引伙伴。</p>'],
    ],
    faqs: [
      ['发了推广链接就会有佣金吗？', '不会。需要符合归属规则并有真实、有效的客户首单付款；访问、注册、未付款、退款和续费都不能直接记为首单佣金。'],
      ['经销商价格和整套支持费用是多少？', '需要根据客户任务、配置、支持清单及双方责任单独沟通，不能把机器基础租金或方案测算视为完整服务报价。'],
      ['如何联系 wodeMac 讨论合作？', '可通过官网合作区的微信或公开联系邮箱说明客户类型和真实项目；推广伙伴的专属链接从官网账户入口生成。'],
    ],
  },
  {
    slug: 'codex-remote-mac',
    title: '用远程 Mac 运行 OpenAI Codex：预装环境、账号与验收',
    description: '在美国加州独享 Mac mini 上使用 OpenAI Codex CLI 或 Codex 应用：机器已预装 Codex，客户用自己的 ChatGPT 或 API 账号登录。了解账号条件、项目准备、持续运行和验收方法。',
    answer: 'wodeMac 的独享 Mac mini 交付时已预装 OpenAI Codex 和 Claude Code，管理员权限归客户。Codex 使用客户本人或企业的 ChatGPT 账号或 OpenAI API 登录，wodeMac 不另收模型费用，也不提供或共享 OpenAI 账号；客户需自行符合 OpenAI 当前的地区与使用规则。',
    sources: 'openai',
    sections: [
      ['Codex 在这台 Mac 上怎样工作？', '<p>Codex 是 OpenAI 的编程 Agent，可以在终端里读写代码、运行命令和测试。机器交付时已经装好 Codex，你通过远程桌面打开终端，进入项目目录即可启动。它运行在这台加州 Mac 上，代码、依赖和任务记录都留在这台独享机器里，不占用你自己电脑的资源。</p><p>同一台 Mac 也预装了 Claude Code，可以在不同项目或不同终端里分别使用两种工具，再按真实结果决定团队的主力工具。</p>'],
      ['账号和费用怎样分开？', '<p>租金只含机器。Codex 用这台 Mac 上客户自己的登录：可以是客户的 ChatGPT 订阅账号，也可以是客户的 OpenAI API Key，按 OpenAI 的计费规则结算。wodeMac 不转售、代持或共享 OpenAI 账号，也不因租用机器增加任何模型额度。</p>{{PRICE_TABLE}}<p>机器所在地或网络出口不能替代 OpenAI 对地区、年龄和付款方式的要求；使用前请自行核对 OpenAI 当前支持的国家和地区。</p>'],
      ['第一次使用的准备步骤', '<ol><li>按交付说明远程登录，确认 macOS、Codex 和 Git 版本。</li><li>把有授权的代码仓库克隆到这台 Mac，安装项目依赖。</li><li>由客户本人通过官方流程登录 Codex，或在环境变量里配置自己的 API Key。</li><li>先运行项目原有的构建和测试，保存起点状态。</li><li>给 Codex 一个边界清楚的小任务，并说明不能修改的目录和密钥。</li></ol><p>Codex 的安装方式、权限模式和配置项会更新，执行前阅读 OpenAI 官方文档。</p>'],
      ['适合交给 Codex 的任务', '<p>适合第一轮验证的任务有：修复一个能复现的问题、补一组测试、重构一个模块、把原型推进到可演示状态，或者在 macOS 上跑 iOS 与 Mac 应用的构建。记录任务描述、改动、检查命令和人工审查结论，用可复核的结果判断是否扩展到团队。</p><p>长时间任务仍会受账号额度、网络和进程状态影响。重要任务要保留日志和版本提交，设好停止条件。</p>'],
    ],
    faqs: [
      ['wodeMac 的 Mac mini 预装了 Codex 吗？', '预装了。交付时 Claude Code 和 Codex 都已装好，管理员权限归客户，其他 Agent 可以自己安装。'],
      ['租机器包含 ChatGPT 或 OpenAI API 费用吗？', '不包含。价格只含机器；Codex 用客户自己的 ChatGPT 账号或 OpenAI API Key，按 OpenAI 的规则计费，wodeMac 不另收费。'],
      ['可以同时用 Codex 和 Claude Code 吗？', '可以。两种工具都已预装，可以在同一台 Mac 的不同终端或不同项目里使用，各自用客户自己的账号登录。'],
    ],
  },
  {
    slug: 'claude-code-vs-codex',
    title: 'Claude Code 和 Codex 怎么选：在同一台 Mac 上实测对比',
    description: 'Claude Code 与 OpenAI Codex 都能在终端里写代码、跑测试。与其看评测，不如在同一台预装两种工具的独享 Mac 上，用自己的项目对比结果、成本和协作方式。',
    answer: 'Claude Code 来自 Anthropic，Codex 来自 OpenAI，两者都是能在终端里读写代码、执行命令的编程 Agent。哪个更适合，取决于你的项目、语言栈、账号条件和预算；最可靠的办法是在同一台机器、同一个项目上，用相同任务分别跑一遍再比较。wodeMac 的独享 Mac mini 两种工具都已预装。',
    sources: 'both',
    sections: [
      ['两者有什么相同和不同？', '<p>相同点：都在本地终端运行，能读懂代码仓库、修改文件、运行构建和测试，并按你的确认推进任务；都需要使用者自己的官方账号。</p><p>不同点主要在模型、账号与计费方式、权限与审批设计、配置文件和生态集成。Claude Code 使用 Anthropic 的 Claude 订阅或 API；Codex 使用 OpenAI 的 ChatGPT 订阅或 API。两边功能更新都很快，具体以各自官方文档为准，本页不给出固定排名。</p>'],
      ['用同一台 Mac 做公平对比', '<ol><li>选一个有授权的真实项目，先跑原有测试，记下起点提交。</li><li>准备 2–3 个边界清楚的任务，例如修一个 bug、加一项小功能、补测试。</li><li>为每个工具新建分支，给出完全相同的任务描述。</li><li>记录完成时间、需要人工介入的次数、测试结果和代码审查意见。</li><li>按实际账单核算两边的订阅或 API 费用。</li></ol><p>在同一台机器上比较，可以排除硬件、网络和依赖版本带来的差异。</p>'],
      ['团队怎样落地？', '<p>很多团队不会只押一种工具：例如一人一台 Mac，各自用习惯的 Agent，再用统一的代码审查和测试流程把关。机器、账号和项目权限分开管理，人员变动时也更容易交接。</p><p>年付一单 5 台及以上，第一年整单再减 2.5%。批量配置、合同或单独报价请联系 wodeMac。</p>{{PRICE_TABLE}}'],
    ],
    faqs: [
      ['Claude Code 和 Codex 哪个更好？', '没有对所有项目都成立的答案。建议在同一台机器、同一项目上用相同任务各跑一遍，比较结果质量、人工介入次数和实际费用。'],
      ['一台 Mac 上能同时装 Claude Code 和 Codex 吗？', '能。wodeMac 的独享 Mac mini 交付时两种工具都已预装，各自使用客户自己的账号登录。'],
      ['对比时需要两个账号吗？', '需要。Claude Code 用 Anthropic 的账号或 API，Codex 用 OpenAI 的账号或 API，都应由客户本人或企业持有，并符合各自的地区与使用规则。'],
    ],
  },
  {
    slug: 'ai-coding-agent-always-on-mac',
    title: '让 Claude Code、Codex 持续工作：为什么用一台 7×24 在线的独享 Mac',
    description: '把 Claude Code 或 Codex 放在一台 7×24 在线的美国加州独享 Mac mini 上：笔记本合盖、断网或下班后任务照常运行，代码和环境长期保留。了解适用场景、边界和成本。',
    answer: '编程 Agent 跑长任务时，最常见的中断原因是本机合盖、休眠、断网或被其他工作占满资源。把 Claude Code 或 Codex 放在一台 7×24 在线的独享 Mac mini 上，可以让任务在你离开电脑后继续运行，项目和依赖长期保留。它不能保证每个任务都不中断，账号额度和工具状态仍需你管理。',
    sources: 'both',
    sections: [
      ['什么情况下值得用一台常开的 Mac？', '<ul><li>任务要跑很久：大规模重构、补测试、批量修复、跑完整构建。</li><li>你的电脑经常合盖或出差移动，网络不稳定。</li><li>需要 macOS 环境，例如构建 iOS 或 Mac 应用，而手头只有 Windows 或 Linux 电脑。</li><li>团队想一人一台，各自的项目、依赖和权限互不干扰。</li></ul><p>如果只是偶尔问几个问题、改几行代码，本机运行就够了，不必额外租机器。</p>'],
      ['wodeMac 提供的是什么？', '<p>一台位于美国加州、只租给你一位客户的实体 M6 Mac mini（16GB 内存、256GB 存储），7×24 小时在线，预装 Claude Code 和 Codex，管理员权限归你。你可以用预装的远程屏幕工具打开整个桌面，或只把一个应用窗口拉到自己的电脑上并排使用。</p><p>通常 24 小时内交付，最迟 3 个工作日，计费从付款当天开始。</p>{{PRICE_TABLE}}'],
      ['持续运行的边界', '<p>机器常开不等于任务永不中断：账号额度用完、工具升级、网络波动、进程崩溃或任务本身出错，都会让 Agent 停下来。重要任务请使用 Git 分支、日志和明确的停止条件，回来后先看差异再合并。</p><p>为了维护和排障，wodeMac 与托管服务商保留管理权限。涉及生产密钥或客户数据时，先确认访问范围和备份方式。</p>'],
    ],
    faqs: [
      ['笔记本合上后，Claude Code 的任务还会继续吗？', '在本机运行时通常会随休眠中断。放在一台 7×24 在线的远程 Mac 上运行，关闭本机后任务仍会继续，但仍受账号额度、网络和工具状态影响。'],
      ['这台 Mac 是共享的虚拟机吗？', '不是。每台实体 Mac mini 只租给一位客户；为维护与排障，wodeMac 和托管服务商保留管理权限。'],
      ['一个月多少钱？', '月付 $169，季付 $481.65，半年付 $912.60，年付 $1,723.80（折合每月 $143.65），价格只含机器，不含第三方模型费用。'],
    ],
  },
  {
    slug: 'ios-app-claude-code-codex',
    title: '用 Claude Code 或 Codex 开发 iOS 和 Mac 应用：没有 Mac 怎么办',
    description: '构建和签名 iOS、macOS 应用需要 macOS 和 Xcode。没有 Mac 或不想占用自己的电脑时，可以租一台预装 Claude Code 和 Codex 的美国加州独享 Mac mini，让 Agent 在上面写代码、跑构建和测试。',
    answer: 'iOS 和 macOS 应用的构建、模拟器测试和签名都需要运行 macOS 的 Mac 与 Xcode。用 Windows 或 Linux 的开发者，可以远程使用一台独享 Mac mini：在上面安装 Xcode，让 Claude Code 或 Codex 修改代码、执行 xcodebuild 和测试，再由你审查和提交。按照 Apple 的 macOS 许可，租用的 Mac 用于软件开发与测试。',
    sources: 'apple',
    sections: [
      ['为什么一定要 Mac？', '<p>Xcode 只能在 macOS 上运行，iOS 模拟器、应用签名和上传 App Store Connect 也都依赖它。跨平台框架（如 React Native、Flutter）同样需要在 Mac 上完成 iOS 构建。没有 Mac 的团队，常见做法是买一台、借一台，或者远程租一台。</p>'],
      ['在独享 Mac 上的工作流', '<ol><li>远程登录这台 Mac mini，用 Apple ID 从 App Store 安装 Xcode。</li><li>克隆项目，安装 CocoaPods、Swift Package 或其他依赖。</li><li>用客户自己的账号登录预装的 Claude Code 或 Codex。</li><li>让 Agent 修改代码，并用 xcodebuild 跑构建和单元测试，在模拟器里检查界面。</li><li>你审查差异后提交；证书和签名由客户自己的 Apple 开发者账号管理。</li></ol>'],
      ['配置和费用', '<p>机器是 M6 Mac mini，16GB 内存、256GB 存储。Xcode 和模拟器占用空间较大，建议只保留需要的模拟器运行时。租金只含机器；Apple 开发者计划、Claude 或 OpenAI 的账号费用都另行由客户承担。</p>{{PRICE_TABLE}}'],
    ],
    faqs: [
      ['没有 Mac 能用 Claude Code 开发 iOS 应用吗？', '编辑代码可以在任何电脑上进行，但构建、模拟器测试和签名需要 macOS 与 Xcode。可以远程使用一台独享 Mac mini 完成这些步骤。'],
      ['租来的 Mac 能上架 App Store 吗？', '可以用于开发、构建和测试。上架使用客户自己的 Apple 开发者账号和证书，账号归客户所有。'],
      ['Xcode 是预装的吗？', '预装的是 Claude Code、Codex 和 wodeMac 的工具。Xcode 体积较大且版本随项目而定，建议客户按需从 App Store 安装。'],
    ],
  },
  {
    slug: 'claude-code-mac-mini',
    lang: 'en',
    title: 'Run Claude Code on a dedicated Mac mini in California',
    description: 'A dedicated M6 Mac mini in California, online 24/7, with Claude Code and Codex preinstalled and admin rights for you. From $169 a month. See setup, account rules, pricing and limits.',
    answer: 'wodeMac rents physical Mac minis hosted in California, each to one customer only. Claude Code and OpenAI Codex come preinstalled and you get admin rights. You sign in to Claude Code with your own Anthropic account; wodeMac charges only for the machine and does not resell or share AI accounts.',
    sources: 'both',
    sections: [
      ['Why run Claude Code on a remote Mac?', '<p>Long agent runs stop when your laptop sleeps, loses Wi-Fi or is busy with other work. A Mac that stays online 24/7 keeps the repository, dependencies and running tasks in one place, so Claude Code can keep working after you close your own computer. It also gives Windows and Linux developers a real macOS machine for Xcode builds and tests.</p>'],
      ['What you get', '<ul><li>A physical M6 Mac mini (16GB memory, 256GB storage), not a shared VM.</li><li>Claude Code and Codex preinstalled, with admin rights.</li><li>Remote desktop through the preinstalled wodeMac Remote Screen app.</li><li>Delivery usually within 24 hours and no later than 3 business days.</li></ul>{{PRICE_TABLE}}<p>Annual orders of 5 or more Macs get a further 2.5% off the first year.</p>'],
      ['Accounts and limits', '<p>The price covers the machine only. Claude Code runs on your own Claude subscription or API key, under Anthropic\'s usage policies and supported regions. Hosting the Mac in California does not change those rules. For maintenance, wodeMac and its hosting provider keep administrative access.</p>'],
    ],
    faqs: [
      ['Is Claude Code preinstalled?', 'Yes. Claude Code and Codex are installed when the Mac is delivered. You sign in with your own account.'],
      ['How much does it cost?', '$169 monthly, $481.65 quarterly, $912.60 half-yearly or $1,723.80 yearly (about $143.65 a month), paid upfront for the machine only.'],
      ['Is the Mac shared with other customers?', 'No. Each physical Mac mini is rented to one customer. wodeMac and the hosting provider keep admin access for maintenance.'],
    ],
  },
  {
    slug: 'codex-mac-mini',
    lang: 'en',
    title: 'Run OpenAI Codex on a dedicated remote Mac mini',
    description: 'Use the Codex CLI or app on a dedicated M6 Mac mini in California that stays online 24/7. Codex and Claude Code are preinstalled; you sign in with your own ChatGPT or OpenAI API account.',
    answer: 'A wodeMac Mac mini ships with OpenAI Codex and Claude Code preinstalled. You sign in to Codex with your own ChatGPT plan or OpenAI API key, and wodeMac charges only for the machine. The Mac stays online 24/7 in California, so Codex tasks keep running after you close your laptop.',
    sources: 'openai',
    sections: [
      ['How it works', '<ol><li>Open the Mac through the preinstalled remote desktop app.</li><li>Clone an authorized repository and install its dependencies.</li><li>Sign in to Codex with your own ChatGPT account or set your own OpenAI API key.</li><li>Run the existing build and tests first, then give Codex a clearly scoped task.</li><li>Review the diff and test results before merging.</li></ol>'],
      ['Pricing', '{{PRICE_TABLE}}<p>The price is for the machine only. OpenAI usage is billed by OpenAI under your own account and its supported-country rules.</p>'],
      ['Compare Codex and Claude Code on one machine', '<p>Both agents are preinstalled, so you can give each the same task on separate branches of the same project and compare results, human intervention and cost without hardware or dependency differences.</p>'],
    ],
    faqs: [
      ['Is Codex preinstalled on the Mac?', 'Yes. Codex and Claude Code are installed at delivery, and you have admin rights to add other tools.'],
      ['Does the rental include ChatGPT or API credits?', 'No. You use your own ChatGPT plan or OpenAI API key; wodeMac does not add model fees or share accounts.'],
      ['Where is the Mac hosted?', 'In California, USA, operated by wodeMac Inc.'],
    ],
  },
  {
    slug: 'ios-development-without-mac',
    lang: 'en',
    title: 'Build iOS apps with Claude Code or Codex without owning a Mac',
    description: 'iOS builds, simulators and signing need macOS and Xcode. Rent a dedicated Mac mini in California with Claude Code and Codex preinstalled and let the agent build and test your app.',
    answer: 'Xcode only runs on macOS, so building and testing iOS apps needs a Mac. Developers on Windows or Linux can rent a dedicated Mac mini from wodeMac, install Xcode, and let Claude Code or Codex edit code, run xcodebuild and tests, and leave the diff for review. The Mac is used for software development and testing under Apple\'s macOS license.',
    sources: 'apple',
    sections: [
      ['Workflow', '<ol><li>Log in remotely and install Xcode from the App Store with your Apple ID.</li><li>Clone the project and install CocoaPods or Swift packages.</li><li>Sign in to the preinstalled Claude Code or Codex with your own account.</li><li>Have the agent change code and run xcodebuild, unit tests and the simulator.</li><li>Review and commit; certificates stay in your own Apple Developer account.</li></ol>'],
      ['Machine and pricing', '<p>M6 Mac mini, 16GB memory, 256GB storage, online 24/7 in California. Keep only the simulator runtimes you need.</p>{{PRICE_TABLE}}'],
    ],
    faqs: [
      ['Can I build iOS apps with Claude Code on Windows?', 'You can edit code anywhere, but builds, simulators and signing need macOS and Xcode. A remote dedicated Mac mini covers those steps.'],
      ['Is Xcode preinstalled?', 'Claude Code and Codex are preinstalled. Install the Xcode version your project needs from the App Store.'],
      ['Can I publish to the App Store from it?', 'Yes, using your own Apple Developer account and certificates for development, builds and uploads.'],
    ],
  },
];

export const sourceLinks = [
  ['wodeMac 官网与当前配置、付款方案', 'https://wodemac.com/'],
  ['wodeMac 服务条款', 'https://wodemac.com/legal/terms.html'],
  ['wodeMac 隐私政策', 'https://wodemac.com/legal/privacy.html'],
  ['Claude Code 官方安装与使用准备', 'https://code.claude.com/docs/en/setup'],
  ['Anthropic 当前支持地区与规则', 'https://www.anthropic.com/supported-countries'],
];

export const sourceSets = {
  claude: sourceLinks,
  openai: [
    sourceLinks[0], sourceLinks[1],
    ['OpenAI Codex 官方文档', 'https://developers.openai.com/codex'],
    ['Codex CLI 官方说明', 'https://developers.openai.com/codex/cli'],
    ['OpenAI 支持的国家和地区', 'https://platform.openai.com/docs/supported-countries'],
  ],
  both: [
    sourceLinks[0], sourceLinks[1],
    ['Claude Code 官方概览', 'https://code.claude.com/docs/en/overview'],
    ['OpenAI Codex 官方文档', 'https://developers.openai.com/codex'],
    ['Anthropic 当前支持地区与规则', 'https://www.anthropic.com/supported-countries'],
    ['OpenAI 支持的国家和地区', 'https://platform.openai.com/docs/supported-countries'],
  ],
  apple: [
    sourceLinks[0], sourceLinks[1],
    ['Apple Xcode 官方页面', 'https://developer.apple.com/xcode/'],
    ['Claude Code 官方概览', 'https://code.claude.com/docs/en/overview'],
    ['OpenAI Codex 官方文档', 'https://developers.openai.com/codex'],
  ],
};

export const facts = {
  zh: '美国加州独享实体 M6 Mac mini（12 核 CPU，16GB 内存，256GB 存储），7×24 小时在线；预装 Claude Code、Codex 与 wodeMac 远程屏幕，管理员权限归客户；通常 24 小时内交付，最迟 3 个工作日；价格只含机器，Claude 与 OpenAI 账号由客户自己持有。',
  en: 'Dedicated physical M6 Mac mini in California (12-core CPU, 16GB memory, 256GB storage), online 24/7; Claude Code, Codex and wodeMac Remote Screen preinstalled with admin rights for the customer; delivery usually within 24 hours, no later than 3 business days; price covers the machine only, and Claude and OpenAI accounts stay with the customer.',
};
