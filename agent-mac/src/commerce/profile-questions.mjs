// Optional customer questionnaire, stored on the account (PATCH /profile/answers). Values must match the backend schema.
export const READINESS=[['appleId',['是否有美国苹果 ID？','Do you have a US Apple ID?']],['email',['是否有美国邮箱？','Do you have a US email address?']],['card',['是否有美国信用卡？','Do you have a US credit card?']]];
export const SOURCES=[['friend',['朋友推荐（含朋友圈）','A friend (incl. WeChat Moments)']],['ai',['AI 推荐','An AI assistant']],['social',['社交媒体','Social media']],['creator',['老师、博主或课程推荐','A teacher, creator or course']],['search',['搜索引擎','A search engine']],['other',['其他','Other']]];
export const SOURCE_DETAILS={
 ai:[['chatgpt','ChatGPT'],['claude','Claude'],['gemini','Gemini'],['doubao',['豆包','Doubao']],['deepseek','DeepSeek'],['kimi','Kimi'],['yuanbao',['腾讯元宝','Yuanbao']],['ai_other',['其他 AI','Other AI']]],
 social:[['xiaohongshu',['小红书','Xiaohongshu']],['douyin',['抖音','Douyin']],['wechat_channels',['视频号','WeChat Channels']],['wechat_official',['公众号','WeChat Official Accounts']],['bilibili',['B 站','Bilibili']],['zhihu',['知乎','Zhihu']],['weibo',['微博','Weibo']],['x','X / Twitter'],['youtube','YouTube'],['social_other',['其他平台','Other platform']]]
};
export const NOTE_HINTS={friend:['推荐你的朋友是谁？（选填）','Who referred you? (optional)'],creator:['哪位老师、博主或哪门课？（选填）','Which teacher, creator or course? (optional)'],other:['请告诉我们是在哪里看到的','Tell us where you found us'],ai:['补充说明（选填）','Anything to add (optional)'],social:['哪个账号或哪篇内容？（选填）','Which account or post? (optional)'],search:['搜的是什么关键词？（选填）','What did you search for? (optional)']};
export const USES=[['coding',['开发 / AI 编程','Development / AI coding']],['agents',['跑 AI Agent / 自动化','AI agents / automation']],['content',['内容创作','Content creation']],['ops',['出海运营','Overseas operations']],['study',['学习','Learning']],['other',['其他','Other']]];
export const TEAM_SIZES=[['solo',['个人','Just me']],['2_5',['2–5 人','2–5 people']],['6_20',['6–20 人','6–20 people']],['20_plus',['20 人以上','20+ people']]];
export const EMPTY_ANSWERS={appleId:null,email:null,card:null,source:null,sourceDetail:null,sourceNote:'',uses:[],teamSize:null,wechat:''};
export function normalizeAnswers(a){return {...EMPTY_ANSWERS,...(a||{}),uses:Array.isArray(a?.uses)?a.uses:[]};}
export function answeredCount(a){const v=normalizeAnswers(a);return [v.appleId,v.email,v.card,v.source,v.teamSize].filter(x=>x!==null&&x!==undefined).length+(v.uses.length?1:0)+(v.wechat?1:0);}
export const QUESTION_COUNT=7;
const pick=(list,key)=>list.find(([k])=>k===key)?.[1];
const label=(value,en)=>Array.isArray(value)?value[en?1:0]:value;
export function sourceText(a,en){const v=normalizeAnswers(a);if(!v.source)return '';const parts=[label(pick(SOURCES,v.source),en)];const d=v.sourceDetail&&pick(SOURCE_DETAILS[v.source]||[],v.sourceDetail);if(d)parts.push(label(d,en));return parts.join(' · ')+(v.sourceNote?(en?' — ':'：')+v.sourceNote:'');}
export function answerRows(a,en){const v=normalizeAnswers(a),yn=x=>x==='yes'?(en?'Yes':'有'):x==='no'?(en?'Not yet':'还没有'):'—';return [...READINESS.map(([k,q])=>[label(q,en),yn(v[k])]),[en?'How they found us':'怎么知道我们的',sourceText(v,en)||'—'],[en?'Main use':'主要用途',v.uses.map(u=>label(pick(USES,u),en)).join(en?', ':'、')||'—'],[en?'Team size':'团队规模',v.teamSize?label(pick(TEAM_SIZES,v.teamSize),en):'—'],[en?'WeChat':'微信号',v.wechat||'—']];}
