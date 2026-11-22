import React from 'react';
import { blogArticles } from '../data/mockData.js';
import { articleSections } from '../data/articleContent.js';

export default function ArticlePage({ article }) {
  const sections = articleSections[article.id - 1];

  return (
    <main className="arena-container article-page" dir="rtl">
      <nav><a href="/">خانه</a> / <a href="/#blog">خواندنی‌ها</a></nav>

      <article>
        <header className={`article-poster article-poster--${article.cover.theme}`}>
          <div className="article-poster-copy">
            <p className="article-poster-topic">{article.cover.topic}</p>
            <h1 tabIndex={-1} id="article-title">{article.title}</h1>
            <p className="article-poster-summary">{article.cover.summary}</p>
            <p className="article-poster-meta">
              <bdi>{article.author}</bdi> <span aria-hidden="true">·</span> <bdi>{article.readTime}</bdi>
            </p>
          </div>
          <img className="article-poster-image" src={article.cover.image} alt="" fetchPriority="high" />
        </header>

        <div className="article-layout">
          <aside>
            <strong>در این مطلب</strong>
            {sections.map(([title], index) => <a key={title} href={`#section-${index}`}>{title}</a>)}
          </aside>
          <div className="article-body">
            <p className="article-lead">{article.excerpt.replace(/\.\.\.$/, '')}</p>
            {sections.map(([title, body], index) => (
              <section id={`section-${index}`} key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
            <a href={article.id === 2 ? '/categories/skincare' : '/categories/cosmetics'}>دیدن محصولات مرتبط ←</a>
          </div>
        </div>
      </article>

      <section aria-labelledby="article-related-heading">
        <h2 id="article-related-heading">خواندنی‌های دیگر</h2>
        <div className="article-related">
          {blogArticles.filter(item => item.id !== article.id).map(item => (
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
