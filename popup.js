// excerpt-utils.jsの関数をインライン化
function formatForFacebook(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  let post = title;
  if (quotedExcerpt) {
    post += '\n\n' + quotedExcerpt;
  }
  post += '\n\n' + url;
  
  if (post.length > 1000) {
    const overhead = title.length + url.length + 10;
    const maxExcerptLength = 1000 - overhead - 3;
    if (maxExcerptLength > 0) {
      const trimmedExcerpt = excerpt.substring(0, maxExcerptLength) + '...';
      post = title + '\n\n「' + trimmedExcerpt + '」\n\n' + url;
    } else {
      post = title + '\n\n' + url;
    }
  }
  return post;
}

function formatForThreads(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  let post = title;
  if (quotedExcerpt) {
    post += '\n\n' + quotedExcerpt;
  }
  post += '\n\n' + url;
  
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

function formatForX(title, excerpt, url) {
  const quotedExcerpt = excerpt ? `「${excerpt}」` : '';
  let post = title;
  if (quotedExcerpt) {
    post += '\n' + quotedExcerpt;
  }
  post += '\n' + url;
  
  if (post.length > 140) {
    const overhead = title.length + url.length + 6;
    const maxExcerptLength = 140 - overhead - 3;
    if (maxExcerptLength > 0) {
      const trimmedExcerpt = excerpt.substring(0, maxExcerptLength) + '...';
      post = title + '\n「' + trimmedExcerpt + '」\n' + url;
    } else {
      const maxTitleLength = 140 - url.length - 5;
      if (maxTitleLength > 0) {
        const trimmedTitle = title.substring(0, maxTitleLength) + '...';
        post = trimmedTitle + '\n' + url;
      } else {
        post = url;
      }
    }
  }
  return post;
}

// 記事情報を保持
let articleData = {
  title: '',
  url: '',
  excerpt: '',
  fullText: ''
};

// ステータス表示関数
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  // 3秒後に非表示
  setTimeout(() => {
    statusEl.className = 'status';
  }, 3000);
}

// ボタンのローディング状態を切り替え
function setLoading(isLoading) {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (isLoading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

// 記事情報を取得して表示
async function loadArticleInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, { action: 'getArticleInfo' }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('記事情報の取得に失敗しました', 'error');
        return;
      }
      
      if (response) {
        articleData = response;
        
        // UIに表示
        document.getElementById('article-title').textContent = response.title || 'タイトルなし';
        document.getElementById('article-url').textContent = response.url || '';
        document.getElementById('article-excerpt').textContent = response.excerpt || '抜粋なし';
      }
    });
  } catch (error) {
    showStatus('エラーが発生しました: ' + error.message, 'error');
  }
}

// Facebookに投稿
async function shareToFacebook() {
  setLoading(true);
  showStatus('Facebookに投稿中...', 'info');
  
  try {
    const postText = formatForFacebook(articleData.title, articleData.excerpt, articleData.url);
    
    // 新しいタブでFacebookを開く
    const fbTab = await chrome.tabs.create({
      url: 'https://www.facebook.com/',
      active: true
    });
    
    // タブが読み込まれるまで待機
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === fbTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        // 投稿スクリプトを実行
        chrome.scripting.executeScript({
          target: { tabId: fbTab.id },
          func: fillFacebookPost,
          args: [postText]
        });
        
        showStatus('Facebookの投稿画面を開きました', 'success');
        setLoading(false);
      }
    });
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// Threadsに投稿
async function shareToThreads() {
  setLoading(true);
  showStatus('Threadsに投稿中...', 'info');
  
  try {
    const postText = formatForThreads(articleData.title, articleData.excerpt, articleData.url);
    
    const threadsTab = await chrome.tabs.create({
      url: 'https://www.threads.net/',
      active: true
    });
    
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === threadsTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        chrome.scripting.executeScript({
          target: { tabId: threadsTab.id },
          func: fillThreadsPost,
          args: [postText]
        });
        
        showStatus('Threadsの投稿画面を開きました', 'success');
        setLoading(false);
      }
    });
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// Xに投稿
async function shareToX() {
  setLoading(true);
  showStatus('Xに投稿中...', 'info');
  
  try {
    const postText = formatForX(articleData.title, articleData.excerpt, articleData.url);
    
    // X (Twitter) のインテント URLを使用
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`;
    
    await chrome.tabs.create({
      url: intentUrl,
      active: true
    });
    
    showStatus('Xの投稿画面を開きました', 'success');
    setLoading(false);
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// Facebook投稿フォームに入力する関数（ページ内で実行）
function fillFacebookPost(text) {
  // 投稿ボックスを探してクリック
  const selectors = [
    '[aria-label*="投稿"]',
    '[role="button"][aria-label*="何を"]',
    '[placeholder*="何を"]',
    'div[role="textbox"]',
    '[contenteditable="true"]'
  ];
  
  let postBox = null;
  for (const selector of selectors) {
    postBox = document.querySelector(selector);
    if (postBox) break;
  }
  
  if (postBox) {
    // クリックしてフォーカス
    postBox.click();
    
    setTimeout(() => {
      // テキストを設定
      postBox.focus();
      
      // contenteditable要素の場合
      if (postBox.getAttribute('contenteditable') === 'true') {
        postBox.textContent = text;
        
        // inputイベントをトリガー
        const event = new Event('input', { bubbles: true });
        postBox.dispatchEvent(event);
      } else {
        // input要素の場合
        postBox.value = text;
        postBox.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 500);
  } else {
    alert('投稿ボックスが見つかりませんでした。手動で投稿してください。\n\n投稿内容:\n' + text);
  }
}

// Threads投稿フォームに入力する関数（ページ内で実行）
function fillThreadsPost(text) {
  const selectors = [
    '[aria-label*="スレッド"]',
    '[placeholder*="スレッド"]',
    'div[role="textbox"]',
    '[contenteditable="true"]'
  ];
  
  let postBox = null;
  for (const selector of selectors) {
    postBox = document.querySelector(selector);
    if (postBox) break;
  }
  
  if (postBox) {
    postBox.click();
    
    setTimeout(() => {
      postBox.focus();
      
      if (postBox.getAttribute('contenteditable') === 'true') {
        postBox.textContent = text;
        const event = new Event('input', { bubbles: true });
        postBox.dispatchEvent(event);
      } else {
        postBox.value = text;
        postBox.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 500);
  } else {
    alert('投稿ボックスが見つかりませんでした。手動で投稿してください。\n\n投稿内容:\n' + text);
  }
}

// すべてのSNSに一括投稿
async function shareToAll() {
  setLoading(true);
  showStatus('すべてのSNSに投稿中...', 'info');
  
  try {
    // 各SNS用のテキストを準備
    const fbText = formatForFacebook(articleData.title, articleData.excerpt, articleData.url);
    const threadsText = formatForThreads(articleData.title, articleData.excerpt, articleData.url);
    const xText = formatForX(articleData.title, articleData.excerpt, articleData.url);
    
    // 1. Facebookタブを開く
    const fbTab = await chrome.tabs.create({
      url: 'https://www.facebook.com/',
      active: false
    });
    
    // 2. Threadsタブを開く
    const threadsTab = await chrome.tabs.create({
      url: 'https://www.threads.net/',
      active: false
    });
    
    // 3. Xタブを開く（最後のタブをアクティブに）
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
    await chrome.tabs.create({
      url: intentUrl,
      active: true
    });
    
    // Facebookタブの読み込み完了を待って投稿
    chrome.tabs.onUpdated.addListener(function fbListener(tabId, info) {
      if (tabId === fbTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(fbListener);
        chrome.scripting.executeScript({
          target: { tabId: fbTab.id },
          func: fillFacebookPost,
          args: [fbText]
        });
      }
    });
    
    // Threadsタブの読み込み完了を待って投稿
    chrome.tabs.onUpdated.addListener(function threadsListener(tabId, info) {
      if (tabId === threadsTab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(threadsListener);
        chrome.scripting.executeScript({
          target: { tabId: threadsTab.id },
          func: fillThreadsPost,
          args: [threadsText]
        });
      }
    });
    
    showStatus('3つのSNSの投稿画面を開きました！', 'success');
    setLoading(false);
    
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// イベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
  // 記事情報を読み込み
  loadArticleInfo();
  
  // ボタンのイベントリスナー
  document.getElementById('share-all').addEventListener('click', shareToAll);
  document.getElementById('share-facebook').addEventListener('click', shareToFacebook);
  document.getElementById('share-threads').addEventListener('click', shareToThreads);
  document.getElementById('share-x').addEventListener('click', shareToX);
});
