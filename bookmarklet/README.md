# 記事シェア ブックマークレット

Chrome拡張機能と同じ機能を持つブックマークレット版です。

## 🚀 特徴

- **インストール不要**: ブックマークに追加するだけ
- **どのブラウザでも使用可能**: Chrome、Firefox、Safari、Edgeなど
- **軽量**: 拡張機能をインストールする必要なし
- **同じ機能**: Chrome拡張機能と同じ記事抜粋・投稿機能

## 📦 インストール方法

### 方法1: インストールページから（推奨）

1. [インストールページ](https://bassie0303.github.io/news/bookmarklet/)を開く
2. 「📰 記事シェア」ボタンをブックマークバーにドラッグ＆ドロップ
3. 完了！

### 方法2: 手動でブックマークを作成

1. ブックマークバーを右クリック→「ページを追加」または「新しいブックマーク」
2. 名前: `記事シェア`
3. URL: 以下のコードをコピー＆ペースト

```javascript
javascript:(function()%7B'use%20strict'%3Bif(document.getElementById('news-share-dialog'))%7Bdocument.getElementById('news-share-dialog').remove()%3Breturn%7Dfunction%20getArticleInfo()%7Bconst%20title%3Ddocument.title%7C%7Cdocument.querySelector('h1')%3F.textContent%7C%7Cdocument.querySelector('meta%5Bproperty%3D%22og%3Atitle%22%5D')%3F.content%7C%7C'%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AA%E3%81%97'%3Bconst%20url%3Dwindow.location.href%3Blet%20fullText%3D''%3Bconst%20article%3Ddocument.querySelector('article')%7C%7Cdocument.querySelector('main')%7C%7Cdocument.querySelector('.article')%7C%7Cdocument.querySelector('.post')%7C%7Cdocument.body%3Bif(article)%7Bconst%20paragraphs%3Darticle.querySelectorAll('p')%3BfullText%3DArray.from(paragraphs).map(p%3D%3Ep.textContent.trim()).filter(text%3D%3Etext.length%3E20).join('')%7Dconst%20excerpt%3DextractImportantSentences(fullText%2C800)%3Breturn%7Btitle%2Curl%2Cexcerpt%2CfullText%7D%7Dfunction%20extractImportantSentences(text%2CmaxLength)%7Bconst%20sentences%3Dtext.split(%2F%5B%E3%80%82.!%3F%EF%BC%81%EF%BC%9F%5D%5Cs*%2F)%3Bconst%20scoredSentences%3Dsentences.map(sentence%3D%3E%7Blet%20score%3D0%3Bif(%2F%5Cd%2B%2F.test(sentence))score%2B%3D3%3Bif(%2F%E3%80%8C%7C%E3%80%8D%7C%E3%80%8E%7C%E3%80%8F%7C%E2%80%9C%7C%E2%80%9D%2F.test(sentence))score%2B%3D4%3Bif(%2F%5BA-Z%5D%5Ba-z%5D%2B%5Cs%2B%5BA-Z%5D%5Ba-z%5D%2B%7C%5B%E3%81%81-%E3%82%93%5D%7B2%2C4%7D%5B%E3%80%80%5Cs%5D%5B%E3%81%81-%E3%82%93%5D%7B2%2C4%7D%2F.test(sentence))score%2B%3D3%3Bif(%2F%5BA-Z%5D%5Ba-z%5D%2B%7C%5B%E3%82%A1-%E3%83%B4%E3%83%BC%5D%7B3%2C%7D%2F.test(sentence))score%2B%3D2%3Bconst%20keywords%3D%5B'%E7%99%BA%E8%A1%A8'%2C'%E7%99%BA%E8%A8%80'%2C'%E6%98%8E%E3%82%89%E3%81%8B'%2C'%E5%88%A4%E6%98%8E'%2C'%E7%99%BA%E8%A6%8B'%2C'%E9%96%8B%E7%99%BA'%2C'%E6%96%B0%E3%81%9F'%2C'%E5%88%9D%E3%82%81%E3%81%A6'%2C'%E6%9C%80%E5%A4%A7'%2C'%E6%9C%80%E5%B0%8F'%2C'%E5%A2%97%E5%8A%A0'%2C'%E6%B8%9B%E5%B0%91'%2C'%E4%B8%8A%E6%98%87'%2C'%E4%B8%8B%E9%99%8D'%5D%3Bkeywords.forEach(keyword%3D%3E%7Bif(sentence.includes(keyword))score%2B%3D2%7D)%3Bif(sentence.length%3E20%26%26sentence.length%3C150)score%2B%3D1%3Breturn%7Bsentence%2Cscore%7D%7D)%3BscoredSentences.sort((a%2Cb)%3D%3Eb.score-a.score)%3Blet%20excerpt%3D''%3Bfor(const%20item%20of%20scoredSentences)%7Bif(item.sentence.trim().length%3D%3D%3D0)continue%3Bconst%20testExcerpt%3Dexcerpt%2B(excerpt%3F'%E3%80%82'%3A'')%2Bitem.sentence.trim()%3Bif(testExcerpt.length%3C%3DmaxLength)%7Bexcerpt%3DtestExcerpt%7Delse%7Bbreak%7D%7Dif(excerpt%26%26!excerpt.match(%2F%5B%E3%80%82.!%3F%EF%BC%81%EF%BC%9F%5D%24%2F))%7Bexcerpt%2B%3D'%E3%80%82'%7Dreturn%20excerpt%7Dfunction%20formatForFacebook(title%2Cexcerpt%2Curl)%7Bconst%20quotedExcerpt%3Dexcerpt%3F%60%E3%80%8C%24%7Bexcerpt%7D%E3%80%8D%60%3A''%3Blet%20post%3Dtitle%3Bif(quotedExcerpt)%7Bpost%2B%3D'%5Cn%5Cn'%2BquotedExcerpt%7Dpost%2B%3D'%5Cn%5Cn'%2Burl%3Bif(post.length%3E1000)%7Bconst%20overhead%3Dtitle.length%2Burl.length%2B10%3Bconst%20maxExcerptLength%3D1000-overhead-3%3Bif(maxExcerptLength%3E0)%7Bconst%20trimmedExcerpt%3Dexcerpt.substring(0%2CmaxExcerptLength)%2B'...'%3Bpost%3Dtitle%2B'%5Cn%5Cn%E3%80%8C'%2BtrimmedExcerpt%2B'%E3%80%8D%5Cn%5Cn'%2Burl%7Delse%7Bpost%3Dtitle%2B'%5Cn%5Cn'%2Burl%7D%7Dreturn%20post%7Dfunction%20formatForThreads(title%2Cexcerpt%2Curl)%7Bconst%20quotedExcerpt%3Dexcerpt%3F%60%E3%80%8C%24%7Bexcerpt%7D%E3%80%8D%60%3A''%3Blet%20post%3Dtitle%3Bif(quotedExcerpt)%7Bpost%2B%3D'%5Cn%5Cn'%2BquotedExcerpt%7Dpost%2B%3D'%5Cn%5Cn'%2Burl%3Bif(post.length%3E500)%7Bconst%20overhead%3Dtitle.length%2Burl.length%2B10%3Bconst%20maxExcerptLength%3D500-overhead-3%3Bif(maxExcerptLength%3E0)%7Bconst%20trimmedExcerpt%3Dexcerpt.substring(0%2CmaxExcerptLength)%2B'...'%3Bpost%3Dtitle%2B'%5Cn%5Cn%E3%80%8C'%2BtrimmedExcerpt%2B'%E3%80%8D%5Cn%5Cn'%2Burl%7Delse%7Bpost%3Dtitle%2B'%5Cn%5Cn'%2Burl%7D%7Dreturn%20post%7Dfunction%20formatForX(title%2Cexcerpt%2Curl)%7Bconst%20quotedExcerpt%3Dexcerpt%3F%60%E3%80%8C%24%7Bexcerpt%7D%E3%80%8D%60%3A''%3Blet%20post%3Dtitle%3Bif(quotedExcerpt)%7Bpost%2B%3D'%5Cn'%2BquotedExcerpt%7Dpost%2B%3D'%5Cn'%2Burl%3Bif(post.length%3E140)%7Bconst%20overhead%3Dtitle.length%2Burl.length%2B6%3Bconst%20maxExcerptLength%3D140-overhead-3%3Bif(maxExcerptLength%3E0)%7Bconst%20trimmedExcerpt%3Dexcerpt.substring(0%2CmaxExcerptLength)%2B'...'%3Bpost%3Dtitle%2B'%5Cn%E3%80%8C'%2BtrimmedExcerpt%2B'%E3%80%8D%5Cn'%2Burl%7Delse%7Bconst%20maxTitleLength%3D140-url.length-5%3Bif(maxTitleLength%3E0)%7Bconst%20trimmedTitle%3Dtitle.substring(0%2CmaxTitleLength)%2B'...'%3Bpost%3DtrimmedTitle%2B'%5Cn'%2Burl%7Delse%7Bpost%3Durl%7D%7D%7Dreturn%20post%7Dasync%20function%20copyToClipboard(text)%7Btry%7Bawait%20navigator.clipboard.writeText(text)%3Breturn%20true%7Dcatch(err)%7Bconst%20textarea%3Ddocument.createElement('textarea')%3Btextarea.value%3Dtext%3Btextarea.style.position%3D'fixed'%3Btextarea.style.opacity%3D'0'%3Bdocument.body.appendChild(textarea)%3Btextarea.select()%3Bconst%20success%3Ddocument.execCommand('copy')%3Bdocument.body.removeChild(textarea)%3Breturn%20success%7D%7Dconst%20articleData%3DgetArticleInfo()%3Bconst%20dialogHTML%3D%60%3Cdiv%20id%3D%22news-share-dialog%22%20style%3D%22position%3Afixed%3Btop%3A50%25%3Bleft%3A50%25%3Btransform%3Atranslate(-50%25%2C-50%25)%3Bbackground%3Awhite%3Bborder-radius%3A12px%3Bbox-shadow%3A0%2010px%2040px%20rgba(0%2C0%2C0%2C0.3)%3Bz-index%3A999999%3Bwidth%3A90%25%3Bmax-width%3A500px%3Bmax-height%3A90vh%3Boverflow-y%3Aauto%3Bfont-family%3A'Segoe%20UI'%2CTahoma%2CGeneva%2CVerdana%2Csans-serif%3B%22%3E%3Cdiv%20style%3D%22padding%3A20px%3B%22%3E%3Cdiv%20style%3D%22display%3Aflex%3Bjustify-content%3Aspace-between%3Balign-items%3Acenter%3Bmargin-bottom%3A15px%3B%22%3E%3Ch2%20style%3D%22margin%3A0%3Bfont-size%3A20px%3Bcolor%3A%23333%3B%22%3E%F0%9F%93%B0%20%E8%A8%98%E4%BA%8B%E3%82%92%E3%82%B7%E3%82%A7%E3%82%A2%3C%2Fh2%3E%3Cbutton%20id%3D%22close-dialog%22%20style%3D%22background%3Anone%3Bborder%3Anone%3Bfont-size%3A24px%3Bcursor%3Apointer%3Bcolor%3A%23666%3Bpadding%3A0%3Bwidth%3A30px%3Bheight%3A30px%3B%22%3E%C3%97%3C%2Fbutton%3E%3C%2Fdiv%3E%3Cdiv%20style%3D%22background%3A%23f5f5f5%3Bpadding%3A12px%3Bborder-radius%3A8px%3Bmargin-bottom%3A15px%3B%22%3E%3Ch3%20style%3D%22margin%3A0%200%208px%200%3Bfont-size%3A14px%3Bcolor%3A%23666%3B%22%3E%E8%A8%98%E4%BA%8B%E6%83%85%E5%A0%B1%3C%2Fh3%3E%3Cp%20style%3D%22margin%3A5px%200%3Bfont-size%3A12px%3Bcolor%3A%23333%3Bword-wrap%3Abreak-word%3B%22%3E%3Cstrong%3E%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%3A%3C%2Fstrong%3E%20%24%7BarticleData.title%7D%3C%2Fp%3E%3Cp%20style%3D%22margin%3A5px%200%3Bfont-size%3A12px%3Bcolor%3A%23333%3Bword-wrap%3Abreak-word%3B%22%3E%3Cstrong%3EURL%3A%3C%2Fstrong%3E%20%24%7BarticleData.url%7D%3C%2Fp%3E%3Cdiv%20style%3D%22max-height%3A100px%3Boverflow-y%3Aauto%3Bbackground%3Awhite%3Bpadding%3A8px%3Bborder-radius%3A4px%3Bmargin-top%3A8px%3B%22%3E%3Cstrong%20style%3D%22font-size%3A12px%3B%22%3E%E6%8A%9C%E7%B2%8B%3A%3C%2Fstrong%3E%3Cp%20style%3D%22margin%3A5px%200%3Bfont-size%3A12px%3Bcolor%3A%23333%3B%22%3E%24%7BarticleData.excerpt%7C%7C'%E6%8A%9C%E7%B2%8B%E3%81%AA%E3%81%97'%7D%3C%2Fp%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%20style%3D%22display%3Aflex%3Bflex-direction%3Acolumn%3Bgap%3A10px%3B%22%3E%3Cbutton%20id%3D%22share-all%22%20style%3D%22padding%3A14px%3Bborder%3Anone%3Bborder-radius%3A6px%3Bcursor%3Apointer%3Bfont-size%3A15px%3Bfont-weight%3A600%3Bcolor%3Awhite%3Bbackground%3Alinear-gradient(135deg%2C%23667eea%200%25%2C%23764ba2%20100%25)%3Btransition%3Aall%200.3s%3B%22%3E%F0%9F%9A%80%20%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AB%E4%B8%80%E6%8B%AC%E6%8A%95%E7%A8%BF%3C%2Fbutton%3E%3Cbutton%20id%3D%22share-facebook%22%20style%3D%22padding%3A12px%3Bborder%3Anone%3Bborder-radius%3A6px%3Bcursor%3Apointer%3Bfont-size%3A14px%3Bfont-weight%3A600%3Bcolor%3Awhite%3Bbackground%3A%231877f2%3Btransition%3Aall%200.3s%3B%22%3EFacebook%E3%81%AB%E6%8A%95%E7%A8%BF%3C%2Fbutton%3E%3Cbutton%20id%3D%22share-threads%22%20style%3D%22padding%3A12px%3Bborder%3Anone%3Bborder-radius%3A6px%3Bcursor%3Apointer%3Bfont-size%3A14px%3Bfont-weight%3A600%3Bcolor%3Awhite%3Bbackground%3A%23000000%3Btransition%3Aall%200.3s%3B%22%3EThreads%E3%81%AB%E6%8A%95%E7%A8%BF%3C%2Fbutton%3E%3Cbutton%20id%3D%22share-x%22%20style%3D%22padding%3A12px%3Bborder%3Anone%3Bborder-radius%3A6px%3Bcursor%3Apointer%3Bfont-size%3A14px%3Bfont-weight%3A600%3Bcolor%3Awhite%3Bbackground%3A%23000000%3Btransition%3Aall%200.3s%3B%22%3EX%E3%81%AB%E6%8A%95%E7%A8%BF%3C%2Fbutton%3E%3C%2Fdiv%3E%3Cdiv%20id%3D%22status%22%20style%3D%22margin-top%3A15px%3Bpadding%3A10px%3Bborder-radius%3A6px%3Bfont-size%3A12px%3Bdisplay%3Anone%3B%22%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%20id%3D%22news-share-overlay%22%20style%3D%22position%3Afixed%3Btop%3A0%3Bleft%3A0%3Bright%3A0%3Bbottom%3A0%3Bbackground%3Argba(0%2C0%2C0%2C0.5)%3Bz-index%3A999998%3B%22%3E%3C%2Fdiv%3E%60%3Bdocument.body.insertAdjacentHTML('beforeend'%2CdialogHTML)%3Bfunction%20showStatus(message%2Ctype)%7Bconst%20statusEl%3Ddocument.getElementById('status')%3BstatusEl.textContent%3Dmessage%3BstatusEl.style.display%3D'block'%3Bif(type%3D%3D%3D'success')%7BstatusEl.style.background%3D'%23d4edda'%3BstatusEl.style.color%3D'%23155724'%7Delse%20if(type%3D%3D%3D'error')%7BstatusEl.style.background%3D'%23f8d7da'%3BstatusEl.style.color%3D'%23721c24'%7Delse%7BstatusEl.style.background%3D'%23d1ecf1'%3BstatusEl.style.color%3D'%230c5460'%7DsetTimeout(()%3D%3E%7BstatusEl.style.display%3D'none'%7D%2C3000)%7Dfunction%20closeDialog()%7Bdocument.getElementById('news-share-dialog')%3F.remove()%3Bdocument.getElementById('news-share-overlay')%3F.remove()%7Ddocument.getElementById('close-dialog').addEventListener('click'%2CcloseDialog)%3Bdocument.getElementById('news-share-overlay').addEventListener('click'%2CcloseDialog)%3Bdocument.getElementById('share-facebook').addEventListener('click'%2Casync()%3D%3E%7Bconst%20postText%3DformatForFacebook(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bawait%20copyToClipboard(postText)%3Bwindow.open('https%3A%2F%2Fwww.facebook.com%2F'%2C'_blank')%3BshowStatus('Facebook%E3%82%92%E9%96%8B%E3%81%8D%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82%E6%8A%95%E7%A8%BF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A7Ctrl%2BV%EF%BC%88Cmd%2BV%EF%BC%89%E3%81%A7%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82'%2C'success')%7D)%3Bdocument.getElementById('share-threads').addEventListener('click'%2Casync()%3D%3E%7Bconst%20postText%3DformatForThreads(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bawait%20copyToClipboard(postText)%3Bwindow.open('https%3A%2F%2Fwww.threads.net%2F'%2C'_blank')%3BshowStatus('Threads%E3%82%92%E9%96%8B%E3%81%8D%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82%E6%8A%95%E7%A8%BF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9%E3%81%A7Ctrl%2BV%EF%BC%88Cmd%2BV%EF%BC%89%E3%81%A7%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82'%2C'success')%7D)%3Bdocument.getElementById('share-x').addEventListener('click'%2Casync()%3D%3E%7Bconst%20postText%3DformatForX(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bawait%20copyToClipboard(postText)%3Bconst%20intentUrl%3D%60https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Ftext%3D%24%7BencodeURIComponent(postText)%7D%60%3Bwindow.open(intentUrl%2C'_blank')%3BshowStatus('X%E3%82%92%E9%96%8B%E3%81%8D%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82%E6%8A%95%E7%A8%BF%E5%86%85%E5%AE%B9%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%97%E3%81%A6%E6%8A%95%E7%A8%BF%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82'%2C'success')%7D)%3Bdocument.getElementById('share-all').addEventListener('click'%2Casync()%3D%3E%7Bconst%20fbText%3DformatForFacebook(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bconst%20threadsText%3DformatForThreads(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bconst%20xText%3DformatForX(articleData.title%2CarticleData.excerpt%2CarticleData.url)%3Bawait%20copyToClipboard(fbText)%3Bwindow.open('https%3A%2F%2Fwww.facebook.com%2F'%2C'_blank')%3BsetTimeout(()%3D%3Ewindow.open('https%3A%2F%2Fwww.threads.net%2F'%2C'_blank')%2C500)%3BsetTimeout(()%3D%3Ewindow.open(%60https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Ftext%3D%24%7BencodeURIComponent(xText)%7D%60%2C'_blank')%2C1000)%3BshowStatus('3%E3%81%A4%E3%81%AESNS%E3%82%92%E9%96%8B%E3%81%8D%E3%81%BE%E3%81%97%E3%81%9F%EF%BC%81%E5%90%84%E3%82%BF%E3%83%96%E3%81%A7%E6%8A%95%E7%A8%BF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9%E3%82%92%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%A6Ctrl%2BV%EF%BC%88Cmd%2BV%EF%BC%89%E3%81%A7%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82'%2C'success')%7D)%7D)()
```

4. 保存

## 📝 使い方

1. **記事ページを開く**
   - シェアしたいニュース記事やブログを開きます

2. **ブックマークレットをクリック**
   - ブックマークバーの「記事シェア」をクリック

3. **ダイアログが表示**
   - 記事情報と投稿ボタンが表示されます

4. **投稿先を選択**
   - Facebook、Threads、X、または「すべてに一括投稿」を選択

5. **投稿内容を貼り付け**
   - SNSのタブが開いたら、投稿ボックスで**Ctrl+V**（Mac: **Cmd+V**）

## 🎯 機能

### 自動抜粋
- 記事から重要な情報を自動抽出
- 数値データ、発言、固有名詞を優先

### 文字数制限対応
- Facebook: 1000文字以内
- Threads: 500文字以内
- X: 140文字以内

### クリップボード機能
- 投稿内容を自動的にクリップボードにコピー
- 貼り付けるだけで投稿可能

### 一括投稿
- 3つのSNSに同時に投稿可能
- 各タブで貼り付けるだけ

## 🆚 Chrome拡張機能との比較

| 機能 | ブックマークレット | Chrome拡張機能 |
|-----|------------------|---------------|
| インストール | ブックマークに追加 | 拡張機能としてインストール |
| 対応ブラウザ | すべて | Chrome系のみ |
| ログイン管理 | ❌ なし | ✅ あり |
| 自動入力 | ❌ なし（手動貼り付け） | ✅ あり |
| 記事抜粋 | ✅ 同じ | ✅ 同じ |
| 一括投稿 | ✅ 同じ | ✅ 同じ |

## 💡 ヒント

### ブックマークバーの表示

ブックマークバーが表示されていない場合：

- **Chrome**: `Ctrl+Shift+B`（Mac: `Cmd+Shift+B`）
- **Firefox**: `Ctrl+Shift+B`（Mac: `Cmd+Shift+B`）
- **Safari**: `Cmd+Shift+B`

### 複数のブラウザで使用

同じブックマークレットを複数のブラウザで使用できます：
- Chrome
- Firefox
- Safari
- Edge
- Opera

### モバイルブラウザ

一部のモバイルブラウザでも動作しますが、デスクトップブラウザでの使用を推奨します。

## 🔧 トラブルシューティング

### ブックマークレットが動作しない

1. ページが完全に読み込まれてから実行
2. JavaScriptが有効になっているか確認
3. ブックマークのURLが正しいか確認

### ダイアログが表示されない

1. ページを再読み込み（F5）
2. 別のページで試す
3. ブラウザのコンソールでエラーを確認

### クリップボードにコピーされない

1. ブラウザのクリップボード権限を確認
2. HTTPSページで使用（一部のブラウザではHTTPSが必要）

## 📞 サポート

問題がある場合は、GitHubのIssuesで報告してください：
https://github.com/bassie0303/news/issues

## 🔗 リンク

- **インストールページ**: https://bassie0303.github.io/news/bookmarklet/
- **GitHubリポジトリ**: https://github.com/bassie0303/news
- **Chrome拡張機能版**: ../README.md

---

**バージョン**: 1.0.0  
**最終更新**: 2025年11月18日
