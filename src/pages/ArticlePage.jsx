import React from 'react';
import ArticlePoster from '../components/ArticlePoster.jsx';
import { articleSections } from '../data/articleContent.js';

export default function ArticlePage({ article, articles }) {
  const sections = article.body ? article.body.split(/(?=^## )/m).filter(part => part.trim()).map((part) => {
    if (!part.startsWith('## ')) return ['', part.trim()];
    const [title, ...paragraphs] = part.split('\n');
    return [title.slice(3).trim(), paragraphs.join('\n').trim()];
  }) : articleSections[article.id - 1];

  return (
    <main className="arena-container article-page" dir="rtl">
      <nav><a href="/">خانه</a> / <a href="/#blog">خواندنی‌ها</a></nav>

      <article>
        <ArticlePoster article={article} />

        <div className="article-layout">
          <aside>
            <strong>در این مطلب</strong>
            {sections.map(([title], index) => title && <a key={index} href={`#section-${index}`}>{title}</a>)}
          </aside>
          <div className="article-body">
            <p className="article-lead">{article.excerpt.replace(/\.\.\.$/, '')}</p>
            {sections.map(([title, body], index) => (
              <section id={`section-${index}`} key={index}>
                {title && <h2>{title}</h2>}
                <p className="whitespace-pre-line">{body}</p>
              </section>
            ))}
            {(article.relatedCategory || !article.body) && <a href={`/categories/${article.relatedCategory || (article.id === 2 ? 'skincare' : 'cosmetics')}`}>دیدن محصولات مرتبط ←</a>}
          </div>
        </div>
      </article>

      <section aria-labelledby="article-related-heading">
        <h2 id="article-related-heading">خواندنی‌های دیگر</h2>
        <div className="article-related">
          {articles.filter(item => item.id !== article.id).slice(0, 4).map(item => (
            <a key={item.id} href={`/articles/${item.id}`}>
              <img src={item.cover.image} alt="" width="96" height="96" loading="lazy" />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
