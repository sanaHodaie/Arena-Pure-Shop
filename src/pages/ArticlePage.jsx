import React from 'react';
import { blogArticles } from '../data/mockData.js';
import { articleSections } from '../data/articleContent.js';
export default function ArticlePage({ article }) {
 const sections = articleSections[article.id - 1];
 return <main className="arena-container article-page" dir="rtl">
 <nav><a href="/">خانه</a> / <a href="/#blog">خواندنی‌ها</a></nav>
 <article><header className="article-poster"><img src={article.image} alt="" /><div><p>{article.author} · {article.readTime}</p><h1 tabIndex={-1} id="article-title">{article.title}</h1></div></header>
 <div className="article-layout"><aside><strong>در این مطلب</strong>{sections.map(([title],i)=><a key={title} href={'#section-'+i}>{title}</a>)}</aside>
 <div className="article-body"><p className="article-lead">{article.excerpt.replace(/\.\.\.$/,'')}</p>{sections.map(([title,body],i)=><section id={'section-'+i} key={title}><h2>{title}</h2><p>{body}</p></section>)}<a href={article.id===2?'/categories/skincare':'/categories/cosmetics'}>دیدن محصولات مرتبط ←</a></div></div></article>
 <h2>خواندنی‌های دیگر</h2><div className="article-related">{blogArticles.filter(a=>a.id!==article.id).map(a=><a key={a.id} href={'/articles/'+a.id}>{a.title}</a>)}</div></main>;
}
