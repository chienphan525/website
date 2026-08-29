import fs from "fs";
import path from "path";
export type Post = { slug:string; title:string; date:string; category:string; excerpt:string; content:string };
const postsDirectory = path.join(process.cwd(), "content/posts");
function readPost(fileName:string):Post { const raw=fs.readFileSync(path.join(postsDirectory,fileName),"utf8"); const [,fm,content]=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)||[]; if(!fm||!content) throw new Error(`Invalid Markdown: ${fileName}`); const fields=Object.fromEntries(fm.split(/\r?\n/).map(line=>{const i=line.indexOf(":");return [line.slice(0,i).trim(),line.slice(i+1).trim().replace(/^"|"$/g,"")]})); return {slug:fileName.replace(/\.md$/,""),title:fields.title,date:fields.date,category:fields.category,excerpt:fields.excerpt,content:content.trim()}; }
export function getAllPosts(){return fs.readdirSync(postsDirectory).filter(f=>f.endsWith(".md")).map(readPost).sort((a,b)=>b.date.localeCompare(a.date));}
export function getPost(slug:string){return getAllPosts().find(post=>post.slug===slug);}
