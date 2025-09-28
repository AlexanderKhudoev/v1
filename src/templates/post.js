import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import SEO from '@components/head';
require('katex/dist/katex.min.css');

const StyledPostContainer = styled.main`
  max-width: 1100px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin-bottom: 100px;
  h1, h2, h3, h4, h5, h6 { margin: 2em 0 1em; }
  p { margin: 1em 0; line-height: 1.5; color: var(--light-slate); }
  a { ${({ theme }) => theme.mixins.inlineLink}; }
  code {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    border-radius: var(--border-radius);
    font-size: var(--fz-sm);
    padding: 0.2em 0.4em;
  }
  pre code { background-color: transparent; padding: 0; }
`;

const PostTemplate = ({ data, location }) => {
  const node = data?.markdownRemark;

  // Страховка: если пост не найден/битый — не валим сборку
  if (!node) {
    return (
      <Layout location={location}>
        <main style={{ padding: '4rem 0' }}>
          <h1>Post not found</h1>
          <p>This post is missing or has invalid frontmatter.</p>
          <p><Link to="/blog" className="inline-link">← Back to blog</Link></p>
        </main>
      </Layout>
    );
  }

  const { frontmatter, html } = node;
  const { title, date, tags } = frontmatter;

  return (
    <Layout location={location}>
      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All memories</Link>
        </span>

        <StyledPostHeader>
          <h1 className="medium-heading">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {Array.isArray(tags) &&
              tags.map((tag, i) => (
                <Link key={i} to={`/blog/tags/${kebabCase(tag)}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>
        </StyledPostHeader>

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledPostContainer>
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export const Head = ({ data }) => {
  const fm = data?.markdownRemark?.frontmatter;
  if (!fm) {
    return <SEO title="Post not found" description="Missing or invalid post frontmatter" />;
  }
  const { title, description } = fm;
  return <SEO title={title} description={description} />;
};

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      html
      frontmatter {
        title
        description
        date
        slug
        tags
      }
    }
  }
`;
