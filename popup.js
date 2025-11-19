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

// ログイン状態を管理
const LOGIN_STATUS_KEY = 'sns_login_status';

// ログイン状態をチェック
async function checkLoginStatus(platform) {
  const status = await chrome.storage.local.get(LOGIN_STATUS_KEY);
  const loginStatus = status[LOGIN_STATUS_KEY] || {};
  return loginStatus[platform] || false;
}

// ログイン状態を保存
async function saveLoginStatus(platform, isLoggedIn) {
  const status = await chrome.storage.local.get(LOGIN_STATUS_KEY);
  const loginStatus = status[LOGIN_STATUS_KEY] || {};
  loginStatus[platform] = isLoggedIn;
  await chrome.storage.local.set({ [LOGIN_STATUS_KEY]: loginStatus });
}

// ログインページを開く
async function openLoginPage(platform, postText) {
  let loginUrl;
  let message;
  
  switch(platform) {
    case 'facebook':
      loginUrl = 'https://www.facebook.com/login';
      message = 'Facebookにログインしてください。ログイン後、このボタンをもう一度クリックしてください。';
      break;
    case 'threads':
      loginUrl = 'https://www.threads.com/login';
      message = 'Threadsにログインしてください。ログイン後、このボタンをもう一度クリックしてください。';
      break;
    case 'x':
      loginUrl = 'https://twitter.com/i/flow/login';
      message = 'Xにログインしてください。ログイン後、このボタンをもう一度クリックしてください。';
      break;
  }
  
  // クリップボードにコピー
  await navigator.clipboard.writeText(postText);
  
  // ログインページを開く
  await chrome.tabs.create({
    url: loginUrl,
    active: true
  });
  
  showStatus(message, 'info');
  
  // ログイン完了を待つメッセージ
  setTimeout(() => {
    if (confirm(`${platform}にログインしましたか？\n\nログインが完了したら「OK」を押してください。\n投稿内容はクリップボードにコピーされています。`)) {
      saveLoginStatus(platform, true);
      showStatus('ログイン状態を保存しました。もう一度投稿ボタンをクリックしてください。', 'success');
    }
  }, 5000);
}

// ステータス表示関数
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  // 5秒後に非表示
  setTimeout(() => {
    statusEl.className = 'status';
  }, 5000);
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
        
        // 認証が必要な場合の警告表示
        if (response.requiresAuth) {
          const authWarning = document.getElementById('auth-warning');
          const authWarningText = document.getElementById('auth-warning-text');
          authWarningText.textContent = `この記事は認証が必要な可能性があります。現在見えているテキストは${response.visibleTextLength}文字です。`;
          authWarning.style.display = 'block';
        }
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
    const isLoggedIn = await checkLoginStatus('facebook');
    
    if (!isLoggedIn) {
      // 初回：ログインページを開く
      setLoading(false);
      await openLoginPage('facebook', postText);
      return;
    }
    
    // クリップボードにコピー
    await navigator.clipboard.writeText(postText);
    
    // 新しいタブでFacebookを開く
    const fbTab = await chrome.tabs.create({
      url: 'https://www.facebook.com/',
      active: true
    });
    
    // タブが読み込まれるまで待機してスクリプトを実行
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: fbTab.id },
        func: fillFacebookPost,
        args: [postText]
      }).catch(err => console.error('Script execution failed:', err));
    }, 3000);
    
    showStatus('Facebookを開きました。投稿内容はクリップボードにコピー済みです', 'success');
    setLoading(false);
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
    const isLoggedIn = await checkLoginStatus('threads');
    
    if (!isLoggedIn) {
      // 初回：ログインページを開く
      setLoading(false);
      await openLoginPage('threads', postText);
      return;
    }
    
    // クリップボードにコピー
    await navigator.clipboard.writeText(postText);
    
    const threadsTab = await chrome.tabs.create({
      url: 'https://www.threads.com/',
      active: true
    });
    
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: threadsTab.id },
        func: fillThreadsPost,
        args: [postText]
      }).catch(err => console.error('Script execution failed:', err));
    }, 3000);
    
    showStatus('Threadsを開きました。投稿内容はクリップボードにコピー済みです', 'success');
    setLoading(false);
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
    const isLoggedIn = await checkLoginStatus('x');
    
    if (!isLoggedIn) {
      // 初回：ログインページを開く
      setLoading(false);
      await openLoginPage('x', postText);
      return;
    }
    
    // クリップボードにコピー
    await navigator.clipboard.writeText(postText);
    
    // X (Twitter) のインテント URLを使用
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`;
    
    const xTab = await chrome.tabs.create({
      url: intentUrl,
      active: true
    });
    
    // 投稿ボタンを自動でクリック
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: xTab.id },
        func: autoClickXPostButton
      }).catch(err => console.error('Script execution failed:', err));
    }, 2000);
    
    showStatus('Xを開きました。投稿内容はクリップボードにコピー済みです', 'success');
    setLoading(false);
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// X投稿ボタンを自動クリック（ページ内で実行）
function autoClickXPostButton() {
  // 投稿ボタンを探す
  const selectors = [
    '[data-testid="tweetButton"]',
    '[data-testid="tweetButtonInline"]',
    'button[type="button"][role="button"]'
  ];
  
  let postButton = null;
  for (const selector of selectors) {
    const buttons = document.querySelectorAll(selector);
    for (const btn of buttons) {
      const text = btn.textContent || btn.innerText;
      if (text && (text.includes('Post') || text.includes('ポスト') || text.includes('投稿'))) {
        postButton = btn;
        break;
      }
    }
    if (postButton) break;
  }
  
  if (postButton && !postButton.disabled) {
    // ボタンをクリック
    postButton.click();
    console.log('X投稿ボタンをクリックしました');
  } else {
    console.log('X投稿ボタンが見つからないか、無効です');
  }
}

// Facebook投稿フォームに入力する関数（ページ内で実行）
function fillFacebookPost(text) {
  // 複数の方法を試す
  setTimeout(() => {
    // 方法1: contenteditable要素を探す
    const editables = document.querySelectorAll('[contenteditable="true"]');
    let filled = false;
    
    for (const editable of editables) {
      // 投稿ボックスらしい要素を探す
      const placeholder = editable.getAttribute('aria-label') || editable.getAttribute('placeholder') || '';
      if (placeholder.includes('何') || placeholder.includes('考え') || placeholder.includes('投稿')) {
        editable.click();
        editable.focus();
        
        // テキストを設定
        editable.textContent = text;
        
        // inputイベントをトリガー
        const inputEvent = new Event('input', { bubbles: true });
        editable.dispatchEvent(inputEvent);
        
        const changeEvent = new Event('change', { bubbles: true });
        editable.dispatchEvent(changeEvent);
        
        filled = true;
        break;
      }
    }
    
    if (!filled) {
      // 方法2: クリップボードから貼り付けを促す
      alert('投稿ボックスをクリックして、Ctrl+V（またはCmd+V）で貼り付けてください。\n\n投稿内容はクリップボードにコピー済みです。');
    }
  }, 1000);
}

// Threads投稿フォームに入力する関数（ページ内で実行）
function fillThreadsPost(text) {
  setTimeout(() => {
    const editables = document.querySelectorAll('[contenteditable="true"]');
    let filled = false;
    
    for (const editable of editables) {
      const placeholder = editable.getAttribute('aria-label') || editable.getAttribute('placeholder') || '';
      if (placeholder.includes('スレッド') || placeholder.includes('何') || placeholder.includes('投稿')) {
        editable.click();
        editable.focus();
        
        editable.textContent = text;
        
        const inputEvent = new Event('input', { bubbles: true });
        editable.dispatchEvent(inputEvent);
        
        const changeEvent = new Event('change', { bubbles: true });
        editable.dispatchEvent(changeEvent);
        
        filled = true;
        break;
      }
    }
    
    if (!filled) {
      alert('投稿ボックスをクリックして、Ctrl+V（またはCmd+V）で貼り付けてください。\n\n投稿内容はクリップボードにコピー済みです。');
    }
  }, 1000);
}

// すべてのSNSに一括投稿
async function shareToAll() {
  setLoading(true);
  showStatus('すべてのSNSに投稿中...', 'info');
  
  try {
    // ログイン状態をチェック
    const fbLoggedIn = await checkLoginStatus('facebook');
    const threadsLoggedIn = await checkLoginStatus('threads');
    const xLoggedIn = await checkLoginStatus('x');
    
    if (!fbLoggedIn || !threadsLoggedIn || !xLoggedIn) {
      setLoading(false);
      const notLoggedIn = [];
      if (!fbLoggedIn) notLoggedIn.push('Facebook');
      if (!threadsLoggedIn) notLoggedIn.push('Threads');
      if (!xLoggedIn) notLoggedIn.push('X');
      
      showStatus(`以下のSNSにログインが必要です: ${notLoggedIn.join(', ')}。各SNSのボタンを個別にクリックしてログインしてください。`, 'error');
      return;
    }
    
    // 各SNS用のテキストを準備
    const fbText = formatForFacebook(articleData.title, articleData.excerpt, articleData.url);
    const threadsText = formatForThreads(articleData.title, articleData.excerpt, articleData.url);
    const xText = formatForX(articleData.title, articleData.excerpt, articleData.url);
    
    // すべてのテキストをクリップボードに保存（最後にFacebookのテキスト）
    await navigator.clipboard.writeText(fbText);
    
    // 1. Facebookタブを開く
    const fbTab = await chrome.tabs.create({
      url: 'https://www.facebook.com/',
      active: false
    });
    
    // 少し待ってからThreadsを開く
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. Threadsタブを開く
    const threadsTab = await chrome.tabs.create({
      url: 'https://www.threads.com/',
      active: false
    });
    
    // 少し待ってからXを開く
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Xタブを開く（最後のタブをアクティブに）
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
    const xTab = await chrome.tabs.create({
      url: intentUrl,
      active: true
    });
    
    // 各タブにスクリプトを注入
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: fbTab.id },
        func: fillFacebookPost,
        args: [fbText]
      }).catch(err => console.error('Facebook script failed:', err));
    }, 3000);
    
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: threadsTab.id },
        func: fillThreadsPost,
        args: [threadsText]
      }).catch(err => console.error('Threads script failed:', err));
    }, 3000);
    
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: xTab.id },
        func: autoClickXPostButton
      }).catch(err => console.error('X script failed:', err));
    }, 2000);
    
    showStatus('3つのSNSの投稿画面を開きました！各タブで確認してください', 'success');
    setLoading(false);
    
  } catch (error) {
    showStatus('エラー: ' + error.message, 'error');
    setLoading(false);
  }
}

// 認証警告のボタンイベント
let userAuthChoice = null; // 'visible' or 'login'

document.getElementById('use-visible-only')?.addEventListener('click', () => {
  userAuthChoice = 'visible';
  document.getElementById('auth-warning').style.display = 'none';
  showStatus('見えている部分だけを使用します。', 'success');
});

document.getElementById('login-first')?.addEventListener('click', async () => {
  userAuthChoice = 'login';
  document.getElementById('auth-warning').style.display = 'none';
  showStatus('記事ページでログインしてから、もう一度拡張機能を実行してください。', 'info');
  
  // 現在のタブをアクティブに
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.update(tab.id, { active: true });
  
  // ポップアップを閉じる
  window.close();
});

// ログイン状態をリセット（デバッグ用）
async function resetLoginStatus() {
  await chrome.storage.local.remove(LOGIN_STATUS_KEY);
  showStatus('ログイン状態をリセットしました', 'success');
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
  document.getElementById('reset-login').addEventListener('click', resetLoginStatus);
});
