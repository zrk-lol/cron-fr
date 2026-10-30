#!/usr/bin/env node
// Traduit une expression cron en français clair.
// Made by Varhex by Ȥrk Team — https://varhex.com · MIT
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { execFileSync } from "node:child_process";
const args = process.argv.slice(2);
const SKIP = /^(node_modules|\.git|dist|build|\.next|\.output|coverage|\.vercel)$/;
function* walk(dir = ".") { for (const n of readdirSync(dir)) { if (SKIP.test(n)) continue; const p = join(dir, n), s = statSync(p); if (s.isDirectory()) yield* walk(p); else yield { path: relative(".", p), size: s.size }; } }
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const git = (...a) => { try { return execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const env = (p) => Object.fromEntries(read(p).split(/\r?\n/).map((l) => l.match(/^\s*(?:export\s+)?([A-Za-z_][\w.]*)\s*=\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]));
const e = (args.join(" ") || "").trim().split(/\s+/); if (e.length !== 5) { console.log('Usage : cron-fr "30 8 * * 1-5"'); process.exit(1); }
const [mi, h, d, mo, w] = e, J = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const f = (v, u, map) => v === "*" ? `chaque ${u}` : v.startsWith("*/") ? `toutes les ${v.slice(2)} ${u}s` : v.includes("-") ? `du ${map ? map[+v.split("-")[0]] : v.split("-")[0]} au ${map ? map[+v.split("-")[1]] : v.split("-")[1]}` : v.split(",").map((x) => map ? map[+x] : x).join(", ");
const time = /^\d+$/.test(mi) && /^\d+$/.test(h) ? `à ${h.padStart(2, "0")}h${mi.padStart(2, "0")}` : `minute : ${f(mi, "minute")}, heure : ${f(h, "heure")}`;
console.log(`${time}, ${d === "*" ? "" : "jour du mois : " + f(d, "jour") + ", "}${mo === "*" ? "" : "mois : " + f(mo, "mois") + ", "}${w === "*" ? "tous les jours" : f(w, "jour", J)}`);
