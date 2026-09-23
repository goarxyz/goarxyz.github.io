/* goarxyz embed servers */
(function () {
  const EMBEDS = [
    { name: "Vidapi", kind: "vidapi" },
    { name: "Vidlink", kind: "vidlink" },
    { name: "Videasy", kind: "videasy" },
    { name: "Cinezo", kind: "cinezo" },
    { name: "Vidcore", kind: "vidcore" },
    { name: "VidSrc", kind: "vidsrc-sh" },
    { name: "VidSrc 2", kind: "vidsrc-ru" },
    { name: "VidSrc IR", kind: "vidsrc-ir" },
    { name: "VidSrc Me", kind: "vidsrc-me" },
    { name: "VidSrc Top", kind: "vidsrc-top" },
    { name: "VidSrc Link", kind: "vidsrc-link" },
    { name: "Multiembed", kind: "multiembed" }
  ];
  function embedUrl(kind, tmdbId, imdbId, isTV, season, episode) {
    const s = season || 1, e = episode || 1;
    const id = imdbId || tmdbId;
    switch (kind) {
      case "vidapi": return isTV ? "https://vaplayer.ru/embed/tv/" + id + "/" + s + "/" + e + "?autoplay=1" : "https://vaplayer.ru/embed/movie/" + id + "?autoplay=1";
      case "vidlink": return isTV ? "https://vidlink.pro/tv/" + tmdbId + "/" + s + "/" + e + "?autoplay=true" : "https://vidlink.pro/movie/" + tmdbId + "?autoplay=true";
      case "videasy": return isTV ? "https://player.videasy.net/tv/" + tmdbId + "/" + s + "/" + e + "?autoplay=true" : "https://player.videasy.net/movie/" + tmdbId + "?autoplay=true";
      case "cinezo": return isTV ? "https://player.cinezo.live/embed/tv/" + tmdbId + "/" + s + "/" + e + "?autoplay=1" : "https://player.cinezo.live/embed/movie/" + tmdbId + "?autoplay=1";
      case "vidcore": return isTV ? "https://vidcore.net/tv/" + tmdbId + "/" + s + "/" + e + "?autoplay=1" : "https://vidcore.net/movie/" + tmdbId + "?autoplay=1";
      case "vidsrc-sh": return isTV ? "https://vidsrc.sh/embed/tv/" + tmdbId + "/" + s + "/" + e : "https://vidsrc.sh/embed/movie/" + tmdbId;
      case "vidsrc-ru": return isTV ? "https://vidsrc2.ru/embed/tv/" + tmdbId + "/" + s + "/" + e : "https://vidsrc2.ru/embed/movie/" + tmdbId;
      case "vidsrc-ir": return isTV ? "https://vidsrc.ir/embed/tv/" + tmdbId + "/" + s + "/" + e : "https://vidsrc.ir/embed/movie/" + tmdbId;
      case "vidsrc-me": return isTV ? "https://vidsrc.me/embed/tv/" + tmdbId + "/" + s + "/" + e + "?autoplay=1" : "https://vidsrc.me/embed/movie/" + tmdbId + "?autoplay=1";
      case "vidsrc-top": return isTV ? "https://vid-src.top/embed/tv/" + tmdbId + "/" + s + "/" + e : "https://vid-src.top/embed/movie/" + tmdbId;
      case "vidsrc-link": return isTV ? "https://vidsrc.link/embed/tv/" + tmdbId + "/" + s + "/" + e : "https://vidsrc.link/embed/movie/" + tmdbId;
      case "multiembed": return "https://multiembed.mov/?video_id=" + tmdbId + "&tmdb=1" + (isTV ? "&s=" + s + "&e=" + e : "") + "&autoplay=1";
      default: return "";
    }
  }
  function ensureFrame() {
    let frame = document.getElementById("playerFrame");
    const stage = document.querySelector(".player-stage");
    if (!frame && stage) {
      frame = document.createElement("iframe");
      frame.id = "playerFrame";
      frame.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      stage.insertBefore(frame, stage.firstChild);
    }
    return frame;
  }
  function showEmbed(url) {
    const video = document.getElementById("playerVideo");
    const frame = ensureFrame();
    if (video) { try { video.pause(); } catch (e) {} video.style.display = "none"; }
    if (frame) { frame.style.display = "block"; frame.src = url; }
  }
  function hideEmbed() {
    const frame = document.getElementById("playerFrame");
    const video = document.getElementById("playerVideo");
    if (frame) { frame.removeAttribute("src"); frame.style.display = "none"; }
    if (video) video.style.display = "";
  }
  async function imdbOf(id, type) {
    try { if (typeof tmdb === "function") { const data = await tmdb("/" + type + "/" + id + "/external_ids"); return (data && data.imdb_id) || ""; } } catch (e) {}
    return "";
  }
  const prevResolve = window.resolveSources;
  const prevPlay = window.playSource;
  const prevDestroy = window.destroyHls;
  const prevClose = window.closePlayer;
  window.resolveSources = async function (id, type, season, episode) {
    let native = [];
    if (typeof prevResolve === "function") { try { native = await prevResolve(id, type, season, episode); } catch (e) { native = []; } }
    const isTV = type !== "movie";
    const imdb = await imdbOf(id, isTV ? "tv" : "movie");
    const extra = EMBEDS.map((row) => ({ name: row.name, format: "embed", url: embedUrl(row.kind, id, imdb, isTV, season, episode) })).filter((s) => s.url);
    const merged = native.concat(extra);
    if (!merged.length) throw new Error("no playable sources");
    return merged;
  };
  window.playSource = async function (source) {
    if (source && source.format === "embed") {
      if (typeof prevDestroy === "function") prevDestroy();
      showEmbed(source.url);
      if (typeof setPlayerStatus === "function") setPlayerStatus("");
      if (window.playerState) window.playerState.sourceName = source.name;
      return;
    }
    hideEmbed();
    if (typeof prevPlay === "function") return prevPlay(source);
    throw new Error("native player missing");
  };
  window.destroyHls = function () { hideEmbed(); if (typeof prevDestroy === "function") return prevDestroy(); };
  window.closePlayer = function () { hideEmbed(); if (typeof prevClose === "function") return prevClose(); };
  ensureFrame();
  const frame = document.getElementById("playerFrame");
  if (frame) frame.style.display = "none";
})();
