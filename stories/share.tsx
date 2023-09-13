"use client";

export function Share({url}: {url: string}) {
    return (<div onClick={() => { navigator.clipboard.writeText(url).then(() => alert("Copy URL to clipboard!")); }}>Share</div>)
}
