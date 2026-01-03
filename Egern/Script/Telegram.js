let scheme = $argument["客户端"];

const mapping = {
    "Telegram": "tg",
    "Swiftgram": "sg",
    "Turrit": "turrit",
    "iMe": "ime",
    "Nicegram": "ng",
    "Lingogram": "lingo"
};

scheme = mapping[scheme] || scheme;

if (!scheme) {
    $done({});
}

let url = $request.url;
let match = url.match(/(?:https?:\/\/)?t\.me\/(.+)/);

if (match) {
    let path = match[1];
    let newUrl = `${scheme}://resolve?domain=${encodeURIComponent(path)}`;

    if (path.startsWith('+') || path.startsWith('joinchat/')) {
        let inviteHash = path.startsWith('+') ? path.slice(1) : path.slice('joinchat/'.length);
        newUrl = `${scheme}://join?invite=${encodeURIComponent(inviteHash)}`;
    }

    $done({
        status: 307,
        headers: {
            'Location': newUrl
        }
    });
} else {
    $done({});
}