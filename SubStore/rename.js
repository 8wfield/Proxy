/**
 * 更新日期：2026-01-05
 * 用法：Sub-Store 脚本操作添加
 * 示例：https://raw.githubusercontent.com/.../rename.js#flag&name=机场名&nf&bl&blkey=IPLC+GPT>专线&blockquic=on
 *
 * 参数说明（全部以 # 开头，多个参数用 & 连接）：
 */

// 主要输入输出参数
// in=zh | in=cn      → 强制以中文名识别节点地区（默认自动优先中文）
// in=en | in=us      → 强制以英文缩写识别（如 HK、US）
// in=gq | in=flag    → 强制以国旗识别（注意：前面不要加移除国旗的操作）
// in=quan            → 强制以英文全称识别（如 Hong Kong、United States）
// out=zh | out=cn    → 输出地区名为中文（默认）
// out=en | out=us    → 输出地区名为英文缩写
// out=gq | out=flag  → 输出地区名为国旗
// out=quan           → 输出地区名为英文全称

// 前缀与位置参数
// name=机场名         → 为所有节点添加机场名前缀（decodeURI 后显示）
// nf                 → 将 name= 的前缀放在最前面（否则放在地区后）
// flag               → 在地区前添加对应国旗（台湾旗自动替换为🇨🇳）

// 保留与过滤参数
// nm                 → 未匹配到地区的节点也保留，只显示 name= 前缀（如有）
// bl                 → 启用正则匹配倍率（如 0.5x、3倍、×2），并统一转为 [X倍] 格式
// blgd               → 保留固定标识（如 IPLC、家宽、ˣ²、GPT 等），优先级高于 bl
// blkey=IPLC+GPT+NF  → 用 + 连接多个关键词，保留节点名中这些字段（区分大小写）
// blkey=GPT>专线     → 支持替换：将原名中的 “GPT” 替换为 “专线” 显示
// nx                 → 只保留 1倍 或无倍率标识的节点（常与 bl 配合过滤低倍率）
// blnx               → 只保留高倍率节点（≥2倍 或 ˣ² 以上）
// clear              → 清理节点名中含“套餐”“过期”“流量”“机场”等广告词的节点
// key                → 仅保留特定主要地区（港、新加坡、日本、美国、韩国、土耳其）的节点，并结合延迟过滤（保留低延迟）
// blockquic=on       → 为所有节点添加 block-quic: on
// blockquic=off      → 为所有节点添加 block-quic: off

// 已移除的旧参数（保留兼容性但无实际作用）
// one                → 原来用于清理单个节点的 “01”，新版本已自动处理
// fgf=               → 原分隔符参数，现已完全去除所有分隔符
// sn=                → 原序号分隔符，现使用上标¹²³无需分隔符
// blpx               → 原倍率排序参数，新版本分组逻辑已包含排序

const inArg = $arguments;

const nx = inArg.nx || false,
  bl = inArg.bl || false,
  nf = inArg.nf || false,
  key = inArg.key || false,
  blgd = inArg.blgd || false,
  blnx = inArg.blnx || false,
  numone = inArg.one || false,  // 已无实际作用（新逻辑自动处理）
  clear = inArg.clear || false,
  addflag = inArg.flag || false,
  nm = inArg.nm || false;

const FNAME = inArg.name == undefined ? "" : decodeURI(inArg.name),
  BLKEY = inArg.blkey == undefined ? "" : decodeURI(inArg.blkey),
  blockquic = inArg.blockquic == undefined ? "" : decodeURI(inArg.blockquic);

const nameMap = {
  cn: "cn", zh: "cn", us: "us", en: "us", quan: "quan", gq: "gq", flag: "gq",
},
inname = nameMap[inArg.in] || "",
outputName = nameMap[inArg.out] || "";

// prettier-ignore
const FG = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];

// prettier-ignore
const EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];

// prettier-ignore
const ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'];

// prettier-ignore
const QC = ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S. Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'];

const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

const nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
const namenx = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;

const keya = /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i;
const keyb = /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i;

const rurekey = {
  GB: /UK/g,
  "B-G-P": /BGP/g,
  "Russia Moscow": /Moscow/g,
  "Korea Chuncheon": /Chuncheon|Seoul/g,
  "Hong Kong": /Hongkong|HONG KONG/gi,
  "United Kingdom London": /London|Great Britain/g,
  "Dubai United Arab Emirates": /United Arab Emirates/g,
  "Taiwan TW 台湾 🇹🇼": /(台|Tai\s?wan|TW).*?🇨🇳|🇨🇳.*?(台|Tai\s?wan|TW)/g,
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
  澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
  德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
  香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
  日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图|芝加哥/g,
  波斯尼亚和黑塞哥维那: /波黑共和国/g,
  印尼: /印度尼西亚|雅加达/g,
  印度: /孟买/g,
  阿联酋: /迪拜|阿拉伯联合酋长国/g,
  孟加拉国: /孟加拉/g,
  捷克: /捷克共和国/g,
  台湾: /新台|新北|台(?!.*线)/g,
  Taiwan: /Taipei/g,
  韩国: /春川|韩|首尔/g,
  Japan: /Tokyo|Osaka/g,
  英国: /伦敦/g,
  India: /Mumbai/g,
  Germany: /Frankfurt/g,
  Switzerland: /Zurich/g,
  俄罗斯: /莫斯科/g,
  土耳其: /伊斯坦布尔/g,
  泰国: /泰國|曼谷/g,
  法国: /巴黎/g,
  G: /\d\s?GB/gi,
  Esnc: /esnc/gi,
};

// 上标数字转换
const SUP = {"1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","0":"⁰"};
function toSup(n) { return String(n).split("").map(d => SUP[d] || d).join(""); }

let GetK = false, AMK = [];
function ObjKA(i) { GetK = true; AMK = Object.entries(i); }

function getList(arg) { 
  switch (arg) { 
    case 'us': return EN; 
    case 'gq': return FG; 
    case 'quan': return QC; 
    default: return ZH; 
  } 
}

function operator(proxies) {
  const Allmap = {};
  const outList = getList(outputName);
  let inputList;

  if (inname !== "") {
    inputList = [getList(inname)];
  } else {
    inputList = [ZH, FG, QC, EN];
  }

  inputList.forEach(arr => {
    arr.forEach((value, i) => { Allmap[value] = outList[i]; });
  });

  // 过滤（不变）
  if (clear || nx || blnx || key) {
    proxies = proxies.filter(p => {
      const n = p.name;
      return !(clear && nameclear.test(n)) &&
             !(nx && namenx.test(n)) &&
             !(blnx && !nameblnx.test(n)) &&
             !(key && !(keya.test(n) && /2|4|6|7/i.test(n)));
    });
  }

  const BLKEYS = BLKEY ? BLKEY.split("+") : [];

  proxies.forEach(p => {
    const originalName = p.name;
    let tags = [];  // 统一存放所有 [] 标签

    // rurekey 预处理（保持原逻辑）
    Object.keys(rurekey).forEach(k => {
      if (rurekey[k].test(p.name)) {
        p.name = p.name.replace(rurekey[k], k);
      }
    });

    // block-quic
    if (blockquic === "on") p["block-quic"] = "on";
    else if (blockquic === "off") p["block-quic"] = "off";
    else delete p["block-quic"];

    // === 1. blgd 固定标识保留（修复：现在一定生效）===
    if (blgd) {
      regexArray.forEach((re, i) => {
        if (re.test(p.name)) {
          const val = valueArray[i];
          // 纯数字倍率如 2× → [2倍]
          if (val.match(/^\d+×$/)) {
            tags.push(`[${val.replace("×", "")}倍]`);
          } else {
            // 其他如 IPLC、家宽、GPT 等直接 []
            tags.push(`[${val}]`);
          }
        }
      });
    }

    // === 2. bl 正则倍率提取 ===
    if (bl) {
      const m = p.name.match(/((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/);
      if (m) {
        const num = m[0].match(/(\d[\d.]*)/)[0];
        if (num !== "1") {
          tags.push(`[${num}倍]`);
        }
      }
    }

    // === 3. blkey 关键词保留 + 替换支持 ===
    if (BLKEYS.length > 0) {
      let replaced = false;
      let replaceTo = "";
      for (const item of BLKEYS) {
        if (item.includes(">")) {
          const [oldK, newK] = item.split(">");
          if (p.name.includes(oldK)) {
            if (newK) {
              tags.push(`[${newK}]`);
              replaced = true;
            } else {
              tags.push(`[${oldK}]`);
            }
          }
        } else if (p.name.includes(item)) {
          tags.push(`[${item}]`);
        }
      }
      // 如果有多个，只取第一个匹配的避免重复
    }

    // === 地区匹配 ===
    !GetK && ObjKA(Allmap);
    const match = AMK.find(([k]) => p.name.includes(k));
    let regionPart = "";
    let flag = "";

    if (match?.[1]) {
      const region = match[1];
      if (addflag) {
        const idx = outList.indexOf(region);
        if (idx !== -1) {
          flag = FG[idx];
          if (flag === "🇹🇼") flag = "🇨🇳";
        }
      }
      const prefix = nf ? FNAME : "";
      const suffix = nf ? "" : FNAME;
      regionPart = [prefix, flag, suffix, region].filter(Boolean).join("");
    } else {
      if (nm) {
        regionPart = FNAME;
      } else {
        p.name = null;
        return;
      }
    }

    // 保存临时字段
    p._cleanRegion = regionPart;
    p._extraTags = tags.join("");  // 如 [家宽][2倍][GPT]
    p._fullName = originalName;
  });

  proxies = proxies.filter(p => p.name !== null);

  // === 分组去重（标签放在编号后）===
  const groups = {};
  for (const p of proxies) {
    const sub = (p._subDisplayName || p._subName) ? (p._subDisplayName || p._subName) + " - " : "";
    const key = sub + p._cleanRegion;
    groups[key] = groups[key] || [];
    groups[key].push(p);
  }

  const result = [];
  for (const key in groups) {
    const group = groups[key];
    group.forEach((p, i) => {
      const retainMatch = p._fullName.match(/\s*\[[^\]]*\]$/);
      const retainPart = retainMatch ? retainMatch[0].trim() : "";

      const extraPart = p._extraTags || "";

      if (group.length === 1) {
        p.name = key + extraPart + retainPart;
      } else {
        p.name = key + toSup(i + 1) + extraPart + retainPart;
      }
      result.push(p);
    });
  }

  // 清理临时字段
  result.forEach(p => {
    delete p._cleanRegion;
    delete p._extraTags;
    delete p._fullName;
    delete p._subDisplayName;
    delete p._subName;
  });

  if (key) {
    return result.filter(p => !keyb.test(p.name));
  }

  return result;
}
