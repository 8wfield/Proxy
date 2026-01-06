/**
 * 更新日期：2026-01-05
 * 用法：Sub-Store 脚本操作添加
 * 示例：https://raw.githubusercontent.com/.../rename.js#flag&name=机场名&nf&bl&blkey=IPLC+GPT>专线&blockquic=on
 *
 * 参数说明（全部以 # 开头，多个参数用 & 连接）：
 */

// 输入地区识别方式
// in=zh      → 优先中文识别（默认）
// in=en      → 强制英文缩写（如 HK、US）
// in=flag    → 强制国旗识别
// in=quan    → 强制英文全称识别

// 输出地区显示方式
// out=zh     → 输出中文（默认）
// out=en     → 输出英文缩写
// out=flag   → 输出国旗
// out=quan   → 输出英文全称

// 前缀与样式
// name=机场名  → 添加机场名前缀（decodeURI 后显示）
// nf          → 前缀放在最前面（否则放在地区后）
// flag        → 在地区前加国旗（台湾旗自动替换为🇨🇳）

// 节点保留与过滤
// nm          → 未匹配地区节点保留，仅显示前缀
// bl          → 统一倍率标识为 [X倍]
// blgd        → 保留常见固定标识（如 IPLC、家宽、IEPL）并加 []
// blkey=IPLC+GPT>专线 → 保留/替换关键词（用>表示替换，如 GPT 替换为 专线）
// nx          → 只保留 1倍 或无倍率节点
// blnx        → 只保留高倍率节点（≥2倍）
// clear       → 移除含广告词（如 套餐、过期、流量）的节点
// key         → 仅保留主要地区（港/新/日/美/韩/土）并过滤高延迟节点
// blockquic=on/off → 统一添加 block-quic: on/off

const inArg = $arguments;

// 参数开关
const nx = inArg.nx || false,
  bl = inArg.bl || false,
  nf = inArg.nf || false,
  key = inArg.key || false,
  blgd = inArg.blgd || false,
  blnx = inArg.blnx || false,
  clear = inArg.clear || false
  addflag = inArg.flag || false,
  nm = inArg.nm || false;

const FNAME = inArg.name == undefined ? "" : decodeURI(inArg.name),
  BLKEY = inArg.blkey == undefined ? "" : decodeURI(inArg.blkey),
  blockquic = inArg.blockquic == undefined ? "" : decodeURI(inArg.blockquic);

const nameMap = { cn: "cn", zh: "cn", us: "us", en: "us", quan: "quan", gq: "gq", flag: "gq" },
  inname = nameMap[inArg.in] || "",
  outputName = nameMap[inArg.out] || "";

// 国旗、英文缩写、中文、英文全称（保持原顺序对应）
const FG = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];

const EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];

const ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕大','东帝汶'];

const QC = ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S. Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'];

// 广告词过滤
const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;

// 高/低倍率正则
const nameblnx = /(高倍|(?!1)[2-9]\d*(x|倍|×)|ˣ[²³⁴⁵¹⁰])/i;
const namenx = /(高倍|(?!1)([0-9]\.?)+(\d*)(x|倍|×)|ˣ[²³⁴⁵¹⁰])/i;

// 主要地区过滤
const keya = /港|Hong|HK|新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR|🇸🇬|🇭🇰|🇯🇵|🇺🇸|🇰🇷|🇹🇷/i;
const keyb = /(((1|2|3|4)\d)|(香港|Hong|HK) 0[5-9]|((新加坡|SG|Singapore|日本|Japan|JP|美国|United States|US|韩|土耳其|TR|Turkey|Korea|KR) 0[3-9]))/i;

// 常见固定标识（blgd 用）
const fixedTags = [/IEPL/i, /IPLC/i, /家宽/i, /精品/i, /专线/i, /直连/i, /中继/i, /BGP/i, /优质/i, /高端/i];

// 常见名称清理/替换规则
const rurekey = {
  GB: /UK/g,
  "Hong Kong": /Hongkong|HONG KONG/gi,
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/g,
  澳大利亚: /澳洲|墨尔本|悉尼|土澳|(深|沪|呼|京|广|杭)澳/g,
  德国: /(深|沪|呼|京|广|杭)德(?!.*(I|线))|法兰克福|滬德/g,
  香港: /(深|沪|呼|京|广|杭)港(?!.*(I|线))/g,
  日本: /(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))|东京|大坂/g,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/g,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图/g,
  台湾: /新台|新北|台(?!.*线)/g,
  韩国: /春川|韩|首尔/g,
  英国: /伦敦/g,
  土耳其: /伊斯坦布尔/g,
};

// 上标数字
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
  let inputList = inname !== "" ? [getList(inname)] : [ZH, FG, QC, EN];

  inputList.forEach(arr => arr.forEach((value, i) => Allmap[value] = outList[i]));

  // 过滤节点
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
    let originalName = p.name;
    let tags = [];

    // 名称预处理
    Object.entries(rurekey).forEach(([k, v]) => p.name = p.name.replace(v, k));

    // block-quic
    if (blockquic === "on") p["block-quic"] = "on";
    else if (blockquic === "off") p["block-quic"] = "off";
    else delete p["block-quic"];

    // blgd 固定标识
    if (blgd) {
      fixedTags.forEach(re => {
        if (re.test(p.name)) {
          const match = p.name.match(re)[0];
          tags.push(`[${match.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '')}]`);
          p.name = p.name.replace(re, ''); // 移除原标识避免重复
        }
      });
    }

    // bl 倍率
    if (bl) {
      const match = p.name.match(/(?:倍率|[Xx×]?\D*)(\d+(?:\.\d+)?)(?:\D*[Xx×倍])/i);

      if (match && match[1]) {
        const num = match[1].trim();
        if (num !== "1" && num !== "1.0" && num !== "1.00") {
          tags.push(`[${num}倍]`);
          p.name = p.name.replace(match[0], '').trim();
        }
      }
    }

    // blkey 关键词保留/替换
    if (BLKEYS.length > 0) {
      for (const item of BLKEYS) {
        if (item.includes(">")) {
          const [oldK, newK] = item.split(">");
          if (p.name.includes(oldK)) {
            tags.push(`[${newK || oldK}]`);
            p.name = p.name.replace(oldK, '');
            break;
          }
        } else if (p.name.includes(item)) {
          tags.push(`[${item}]`);
          p.name = p.name.replace(item, '');
          break;
        }
      }
    }

    // 地区匹配
    !GetK && ObjKA(Allmap);
    const match = AMK.find(([k]) => p.name.includes(k));
    let regionPart = "";
    let flag = "";

    if (match?.[1]) {
      const region = match[1];
      if (addflag) {
        const idx = outList.indexOf(region);
        flag = idx !== -1 ? FG[idx] : "";
        if (flag === "🇹🇼") flag = "🇨🇳";
      }
      const prefix = nf ? FNAME : "";
      const suffix = nf ? "" : FNAME;
      regionPart = [prefix, flag, region, suffix].filter(Boolean).join("");
      p.name = p.name.replace(match[0], ''); // 移除已匹配的地区关键词
    } else if (nm) {
      regionPart = FNAME;
    } else {
      p.name = null;
      return;
    }

    // 清理多余空格
    p.name = (p.name || "").replace(/\s+/g, "");

    p._cleanRegion = regionPart;
    p._extraTags = tags.join("");
    p._originalName = originalName;
  });

  proxies = proxies.filter(p => p.name !== null);

  // 分组去重（标签紧跟编号后，无空格）
  const groups = {};
  for (const p of proxies) {
    const sub = (p._subDisplayName || p._subName) ? (p._subDisplayName || p._subName) + "-" : "";
    const key = sub + p._cleanRegion;
    groups[key] = groups[key] || [];
    groups[key].push(p);
  }

  const result = [];
  for (const key in groups) {
    const group = groups[key];
    group.forEach((p, i) => {
      const retainPart = (p._originalName.match(/\s*\[[^\]]*\]$/) || [""])[0].trim();
      const extra = p._extraTags;
      const number = group.length > 1 ? toSup(i + 1) : "";
      p.name = `${key}${number}${extra}${retainPart}`;
      result.push(p);
    });
  }

  // 清理临时字段
  result.forEach(p => {
    delete p._cleanRegion;
    delete p._extraTags;
    delete p._originalName;
    delete p._subDisplayName;
    delete p._subName;
  });

  // key 参数二次过滤（移除高延迟）
  if (key) {
    return result.filter(p => !keyb.test(p.name));
  }

  return result;
}