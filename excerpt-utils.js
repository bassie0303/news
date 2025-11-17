// 各SNS向けに記事情報を整形する関数

/**
 * Facebook用の投稿テキストを生成（1000文字以内）
 */
function formatForFacebook(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  
  // 基本構造: タイトル + 改行 + 引用抜粋 + 改行 + URL
  let post = title;
  if (quotedExcerpt) {
    post += '\n\n' + quotedExcerpt;
  }
  post += '\n\n' + url;
  
  // 1000文字を超える場合は抜粋を調整
  if (post.length > 1000) {
    const overhead = title.length + url.length + 10; // 改行とか引用符とか
    const maxExcerptLength = 1000 - overhead - 3; // "..." 用に3文字
    
    if (maxExcerptLength > 0) {
      const trimmedExcerpt = excerpt.substring(0, maxExcerptLength) + '...';
      post = title + '\n\n「' + trimmedExcerpt + '」\n\n' + url;
    } else {
      // 抜粋を入れる余地がない場合
      post = title + '\n\n' + url;
    }
  }
  
  return post;
}

/**
 * Threads用の投稿テキストを生成（500文字以内）
 */
function formatForThreads(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  
  let post = title;
  if (quotedExcerpt) {
    post += '\n\n' + quotedExcerpt;
  }
  post += '\n\n' + url;
  
  // 500文字を超える場合は抜粋を調整
  if (post.length > 500) {
    const overhead = title.length + url.length + 10;
    const maxExcerptLength = 500 - overhead - 3;
    
    if (maxExcerptLength > 0) {
      const trimmedExcerpt = excerpt.substring(0, maxExcerptLength) + '...';
      post = title + '\n\n「' + trimmedExcerpt + '」\n\n' + url;
    } else {
      post = title + '\n\n' + url;
    }
  }
  
  return post;
}

/**
 * X用の投稿テキストを生成（140文字以内）
 */
function formatForX(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  
  let post = title;
  if (quotedExcerpt) {
    post += '\n' + quotedExcerpt;
  }
  post += '\n' + url;
  
  // 140文字を超える場合は抜粋を調整
  if (post.length > 140) {
    const overhead = title.length + url.length + 6; // 改行と引用符
    const maxExcerptLength = 140 - overhead - 3;
    
    if (maxExcerptLength > 0) {
      const trimmedExcerpt = excerpt.substring(0, maxExcerptLength) + '...';
      post = title + '\n「' + trimmedExcerpt + '」\n' + url;
    } else {
      // 抜粋を入れる余地がない場合、タイトルも短縮
      const maxTitleLength = 140 - url.length - 5;
      if (maxTitleLength > 0) {
        const trimmedTitle = title.substring(0, maxTitleLength) + '...';
        post = trimmedTitle + '\n' + url;
      } else {
        post = url; // 最悪URLのみ
      }
    }
  }
  
  return post;
}

// エクスポート（Chrome拡張機能では直接使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatForFacebook,
    formatForThreads,
    formatForX
  };
}
