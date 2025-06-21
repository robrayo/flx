import CryptoJS from 'crypto-js';

const Ce = "b21nIHlvdSBmb3VuZCBteSBrZXkgcGxlYXNlIGdvIHRvdWNoIGdyYXNzIHlvdSBsaXR0bGUgZmF0IGJhc2VtZW50IG1vbmtleQ==";
const Te = "aG9wZSB5b3UgaGFkIGZ1biBkZWNyeXB0aW5nIHRoaXMgZ29vZCBqb2Igbm93IGdvIGFzayB5b3VyIG1vbSBmb3IgYSBjb29raWU=";

const Ie = new Map();

export class Flixer {
  skibidiBoi(type: string, ids: any) {
    const s = Date.now();
    const a = Math.random().toString(36).substring(2, 15);
    const id = type === "tv" ? `${ids.tmdbId}/${ids.seasonId}/${ids.episodeId}` : ids.tmdbId;
    const i = {
      type: type,
      id: id,
      timestamp: s,
      random: a,
      checksum: CryptoJS.SHA256(`${type}${id}${s}${a}${Te}`).toString()
    };
    const r = {
      data: CryptoJS.AES.encrypt(JSON.stringify(i), Ce).toString(),
      timestamp: s
    };
    const n = {
      data: CryptoJS.AES.encrypt(JSON.stringify(r), `${Ce}${s}`).toString(),
      timestamp: s,
      random: a
    };
    return CryptoJS.AES.encrypt(JSON.stringify(n), Te).toString();
  }

  bussinBoi(e: string) {
    try {
      const t = CryptoJS.AES.decrypt(e, Te).toString(CryptoJS.enc.Utf8);
      const s = JSON.parse(t);
      const a = CryptoJS.AES.decrypt(s.data, `${Ce}${s.timestamp}`).toString(CryptoJS.enc.Utf8);
      const i = JSON.parse(a);
      const r = CryptoJS.AES.decrypt(i.data, Ce).toString(CryptoJS.enc.Utf8);
      return JSON.parse(r).data;
    } catch (err) {
      return null;
    }
  }

  async fetchFromMiddleman(e: any, t: any) {
    const s = this.skibidiBoi(e, t);
    const response = await fetch("https://stats.flixer.su", {
      headers: {
        "x-auth": s
      }
    });
    const json = await response.json();
    if (json.encrypted) {
      const decrypted = this.bussinBoi(json.encrypted);
      if (Array.isArray(decrypted?.sources)) {
        const sourcesObj: any = {};
        decrypted.sources.forEach((src: any, idx: any) => {
          sourcesObj[src.server || `server${idx}`] = src;
        });
        decrypted.sources = sourcesObj;
      }
      return decrypted;
    }
    if (Array.isArray(json.sources)) {
      const sourcesObj: any = {};
      json.sources.forEach((src: any, idx: any) => {
        sourcesObj[src.server || `server${idx}`] = src;
      });
      json.sources = sourcesObj;
    }
    return json;
  }

  getMovieSources(e: string) {
    const t = `movie:${e}`;
    if (Ie.has(t))
      return Ie.get(t);
    const s = this.fetchFromMiddleman("movie", {
      tmdbId: e
    });
    Ie.set(t, s);
    setTimeout(() => {
      Ie.delete(t);
    }, 5000);
    return s;
  }

  getTVSources(e: string, t: string, s: string) {
    const a = `tv:${e}:${t}:${s}`;
    if (Ie.has(a))
      return Ie.get(a);
    const i = this.fetchFromMiddleman("tv", {
      tmdbId: e,
      seasonId: t,
      episodeId: s
    });
    Ie.set(a, i);
    setTimeout(() => {
      Ie.delete(a);
    }, 5000);
    return i;
  }
}
