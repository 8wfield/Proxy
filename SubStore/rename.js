/**
 * 优化重写版 rename.js
 * 更新：2026-01-06
 */

const inArg = $arguments;

const addflag = inArg.flag || false;
const nm       = inArg.nm || false;
const clear    = inArg.clear || false;
const nx       = inArg.nx || false;
const bl = inArg.bl || false;
const blnx     = inArg.blnx || false;
const blkey    = inArg.blkey ? decodeURI(inArg.blkey) : "";
const manualName = inArg.name ? decodeURI(inArg.name) : "";

const nameMap = { cn: "cn", zh: "cn", us: "us", en: "us", quan: "quan", gq: "gq", flag: "gq" };
const inname = nameMap[inArg.in] || "";
const outputName = nameMap[inArg.out] || "";

// prettier-ignore
const FG = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','🇸🇿','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];

// prettier-ignore
const EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];

// prettier-ignore
const ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁吉亚','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵蒂冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕大','东帝汶'];

// prettier-ignore
const QC = ['Hong Kong','Macao','Taiwan','Japan','Korea','Singapore','United States','United Kingdom','France','Germany','Australia','Dubai','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina-faso','Burundi','Cambodia','Cameroon','Canada','CapeVerde','CaymanIslands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','CostaRica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','EISalvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar(Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','NorthKorea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','PuertoRico','Qatar','Romania','Russia','Rwanda','SanMarino','SaudiArabia','Senegal','Serbia','SierraLeone','Slovakia','Slovenia','Somalia','SouthAfrica','Spain','SriLanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikstan','Tanzania','Thailand','Togo','Tonga','TrinidadandTobago','Tunisia','Turkey','Turkmenistan','U.S. Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtensteins','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Ahvenanmaa','Bermuda','Timor-Leste'];

const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;
const highRateRegex = /(高倍|(?!1)\d+x|ˣ[²³⁴⁵⁶⁷⁸⁹¹⁰²⁰³⁰⁴⁰⁵⁰])/i;

const rurekey = {
  "United States": /USA|Los Angeles|San Jose|Silicon Valley|Michigan/gi,
  香港: /Hongkong|HONG KONG|(深|沪|呼|京|广|杭)港(?!.*(I|线))/gi,
  日本: /东京|大坂|(深|沪|呼|京|广|杭|中|辽)日(?!.*(I|线))/gi,
  新加坡: /狮城|(深|沪|呼|京|广|杭)新/gi,
  美国: /(深|沪|呼|京|广|杭)美|波特兰|芝加哥|哥伦布|纽约|硅谷|俄勒冈|西雅图/gi,
  台湾: /新台|新北|台(?!.*线)|Taipei/gi,
  韩国: /春川|首尔/gi,
};

function getList(type) {
  switch (type) {
    case 'us': return EN;
    case 'gq': return FG;
    case 'quan': return QC;
    default: return ZH;
  }
}

function operator(proxies) {
  if (!proxies || proxies.length === 0) return [];

  const outList = getList(outputName || "cn");
  let inputLists = inname ? [getList(inname)] : [ZH, FG, QC, EN];

  const regionMap = {};
  inputLists.forEach(list => {
    list.forEach((key, i) => {
      regionMap[key] = outList[i];
    });
  });

  const filtered = proxies.filter(p => {
    let name = p.name;
    if (clear && nameclear.test(name)) return false;
    if (nx && highRateRegex.test(name)) return false;
    if (blnx && !highRateRegex.test(name)) return false;

    Object.keys(rurekey).forEach(k => {
      if (rurekey[k].test(name)) name = name.replace(rurekey[k], k);
    });

    p._cleanName = name;
    return true;
  });

  filtered.forEach(p => {
    p._cleanName = p._cleanName
      .replace(/剩余.{0,20}?\d+\.?\d*\s*(GB|MB|TB|流量|expire|Expire)/gi, "")
      .replace(/流量[:：].*/gi, "")
      .replace(/Expire[:：].*/gi, "")
      .trim();

    const match = p._cleanName.match(/\s*\[([^\]]*)\]$/);
    p._retainTag = match ? `[${match[1]}]` : "";
    p._cleanName = p._cleanName.replace(/\s*\[[^\]]*\]$/, "").trim();


    if (bl) {
      const rateMatch = p._cleanName.match(/((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)|((\d{1,3}\.)?\d+)(倍|X|x|×))/);
      if (rateMatch) {
        const num = rateMatch[0].match(/(\d[\d.]*)/)[0];
        if (num !== "1") {
          p._retainTag = `[${num}Χ]` + p._retainTag;
        }
        p._cleanName = p._cleanName.replace(rateMatch[0], "").trim();
      }
    }

    if (blkey) {
      const keys = blkey.split("+");
      keys.forEach(k => {
        if (k.includes(">")) {
          const [oldK, newK] = k.split(">");
          if (p._cleanName.includes(oldK)) {
            p._retainTag = `[${newK}]` + p._retainTag;
            p._cleanName = p._cleanName.replace(oldK, "");
          }
        } else if (p._cleanName.includes(k)) {
          p._retainTag = `[${k}]` + p._retainTag;
          p._cleanName = p._cleanName.replace(new RegExp(k, "g"), "");
        }
      });
    }
  });

  filtered.forEach(p => {
    const found = Object.keys(regionMap).find(k => p._cleanName.includes(k));
    if (found) {
      let region = regionMap[found];
      if (addflag) {
        const idx = outList.indexOf(region);
        const flag = idx !== -1 ? FG[idx] : "";
        region = (flag === "🇹🇼" ? "🇨🇳" : flag) + region;
      }
      p._cleanRegion = region;
    } else {
      p._cleanRegion = nm ? p._cleanName : null;
    }
  });

  const validProxies = filtered.filter(p => p._cleanRegion !== null);

  // 核心：支持 _subDisplayName / _subName
  const groups = {};
  for (const p of validProxies) {
    let subName = manualName;
    if (!subName && p._subDisplayName) subName = p._subDisplayName;
    if (!subName && p._subName) subName = p._subName;

    const prefix = subName ? `[${subName}]` : "";
    const key = prefix + p._cleanRegion;

    groups[key] = groups[key] || [];
    groups[key].push(p);
  }

  const result = [];
  for (const key in groups) {
    const group = groups[key];
    group.forEach((p, i) => {
      const number = group.length > 1 ? String(i + 1).padStart(2, "0") : "";
      p.name = `${key}${number}${p._retainTag}`;
      result.push(p);
    });
  }

  return result;
}