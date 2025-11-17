// 記事情報を抽出する関数
function extractArticleInfo() {
  // タイトルを取得
  const title = document.title || '';
  
  // URLを取得
  const url = window.location.href;
  
  // 記事本文を抽出
  let articleText = '';
  
  // 一般的な記事コンテナを探す
  const articleSelectors = [
    'article',
    '[role="article"]',
    '.article-body',
    '.article-content',
    '.post-content',
    '.entry-content',
    'main article',
    'main',
    '.content'
  ];
  
  let articleElement = null;
  for (const selector of articleSelectors) {
    articleElement = document.querySelector(selector);
    if (articleElement) break;
  }
  
  // 記事要素が見つからない場合はbodyを使用
  if (!articleElement) {
    articleElement = document.body;
  }
  
  // テキストを抽出（スクリプトやスタイルタグを除外）
  const clone = articleElement.cloneNode(true);
  
  // 不要な要素を削除
  const unwantedSelectors = ['script', 'style', 'nav', 'header', 'footer', 'aside', '.ad', '.advertisement', '.social-share', '.comments'];
  unwantedSelectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  articleText = clone.innerText || clone.textContent || '';
  
  // テキストをクリーンアップ
  articleText = articleText
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
  
  return {
    title,
    url,
    fullText: articleText
  };
}

// 重要な情報を含む文を抽出する関数
function extractImportantSentences(text, maxLength) {
  // 文に分割
  const sentences = text.split(/[。.!?！？]\s*/);
  
  // 重要度をスコアリング
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    
    // 数値を含む（統計、データ）
    if (/\d+/.test(sentence)) score += 3;
    
    // 引用符を含む（発言）
    if (/「|」|『|』|"|"/.test(sentence)) score += 4;
    
    // 人名らしきパターン（姓名）
    if (/[A-Z][a-z]+\s+[A-Z][a-z]+|[ぁ-ん]{2,4}[　\s][ぁ-ん]{2,4}/.test(sentence)) score += 3;
    
    // 固有名詞（大文字始まり、カタカナ）
    if (/[A-Z][a-z]+|[ァ-ヴー]{3,}/.test(sentence)) score += 2;
    
    // 重要そうなキーワード
    const keywords = ['発表', '発言', '明らか', '判明', '発見', '開発', '新た', '初めて', '最大', '最小', '増加', '減少', '上昇', '下降'];
    keywords.forEach(keyword => {
      if (sentence.includes(keyword)) score += 2;
    });
    
    // 文の長さ（短すぎず長すぎない）
    if (sentence.length > 20 && sentence.length < 150) score += 1;
    
    return { sentence, score };
  });
  
  // スコア順にソート
  scoredSentences.sort((a, b) => b.score - a.score);
  
  // 上位の文を選択して結合
  let excerpt = '';
  for (const item of scoredSentences) {
    if (item.sentence.trim().length === 0) continue;
    
    const testExcerpt = excerpt + (excerpt ? '。' : '') + item.sentence.trim();
    if (testExcerpt.length <= maxLength) {
      excerpt = testExcerpt;
    } else {
      break;
    }
  }
  
  // 文末に句点を追加
  if (excerpt && !excerpt.match(/[。.!?！？]$/)) {
    excerpt += '。';
  }
  
  return excerpt;
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getArticleInfo') {
    const articleInfo = extractArticleInfo();
    
    // 各SNS用の抜粋を生成
    const baseExcerptLength = 800; // タイトルとURLを除いた基本長
    const excerpt = extractImportantSentences(articleInfo.fullText, baseExcerptLength);
    
    sendResponse({
      title: articleInfo.title,
      url: articleInfo.url,
      excerpt: excerpt,
      fullText: articleInfo.fullText
    });
  }
  return true;
});
