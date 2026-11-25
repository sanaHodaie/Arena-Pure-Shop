import React from 'react';
import './ArticlePoster.css';

export default function ArticlePoster({ article, preview = false }) {
  const Title = preview ? 'h3' : 'h1';
  return (
    <header className={`article-poster article-poster--${article.cover.theme}`} dir="rtl">
      <div className="article-poster-copy">
        <p className="article-poster-topic">{article.cover.topic}</p>
        <Title className="article-poster-title" {...(!preview && { tabIndex: -1, id: 'article-title' })}>{article.title}</Title>
        <p className="article-poster-summary">{article.cover.summary}</p>
        <p className="article-poster-meta">
          <bdi>{article.author}</bdi> <span aria-hidden="true">·</span> <bdi>{article.readTime}</bdi>
        </p>
      </div>
      {article.cover.image && <img className="article-poster-image" src={article.cover.image} alt="" fetchPriority={preview ? 'auto' : 'high'} />}
    </header>
  );
}
