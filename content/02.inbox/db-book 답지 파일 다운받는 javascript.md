---
title: db-book 답지 파일 다운받는 javascript
aliases: 
tags:
  - javascript
  - 잡지식
created: 2024-11-05T17:05:00+09:00
modified: 2024-11-05T17:05:00+09:00

---

https://db-book.com/bib-dir/index.html
여기 위치에서 콘솔창은 연후 모든 pdf 파일을 다운받는다
```javascript
// 모든 PDF 링크와 이름을 선택
const rows = document.evaluate(
    '/html/body/center/table/tbody/tr',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
);

// 링크 배열 생성
const pdfData = [];
for (let i = 0; i < rows.snapshotLength; i++) {
    const row = rows.snapshotItem(i);
    const nameElement = row.querySelector('td:nth-child(1)'); // 파일 이름
    const linkElement = row.querySelector('td:nth-child(2) a'); // PDF 링크

    // 요소가 존재하는지 확인
    if (nameElement && linkElement) {
        const name = nameElement.textContent.trim(); // 파일 이름
        const url = linkElement.href; // PDF 링크
        pdfData.push({
            url: url,
            name: name
        });
    } else {
        console.warn(`Row ${i + 1} does not contain the expected elements.`);
    }
}

// PDF 다운로드 함수
const downloadFiles = async (pdfData) => {
    for (const { url, name } of pdfData) {
        const a = document.createElement('a');
        a.href = url;
        a.download = name + '.pdf'; // 파일 이름 지정
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 오류발생 가능성 때문에 다운로드 사이에 잠시 대기 오류발생 가능성 때문에
        await new Promise(resolve => setTimeout(resolve, 100)); // 0.1초 대기
    }
};

// PDF 다운로드 수행
downloadFiles(pdfData);
```