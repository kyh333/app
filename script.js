document.addEventListener('DOMContentLoaded', function () {
  const memoTextarea = document.getElementById('memo-textarea');
  const imageUpload = document.getElementById('image-upload');
  const saveButton = document.getElementById('save-button');
  const savedMemos = document.getElementById('saved-memos');

  // 从本地存储加载已保存的备忘录
  function loadSavedMemos() {
    const savedMemosData = localStorage.getItem('savedMemos');
    if (savedMemosData) {
      const memos = JSON.parse(savedMemosData);
      memos.forEach(memo => {
        const memoItem = document.createElement('div');
        memoItem.classList.add('memo-item');

        const memoTextElement = document.createElement('p');
        memoTextElement.classList.add('memo-text');
        memoTextElement.textContent = memo.text;
        memoItem.appendChild(memoTextElement);

        if (memo.images && memo.images.length > 0) {
          memo.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.classList.add('memo-image');
            img.src = imageUrl;
            memoItem.appendChild(img);
          });
        }

        savedMemos.appendChild(memoItem);
      });
    }
  }

  // 保存备忘录到本地存储
  function saveMemoToLocalStorage(memo) {
    let savedMemosData = localStorage.getItem('savedMemos');
    let memos = [];
    if (savedMemosData) {
      memos = JSON.parse(savedMemosData);
    }
    memos.push(memo);
    localStorage.setItem('savedMemos', JSON.stringify(memos));
  }

  // 保存备忘录的函数
  function saveMemo() {
    const memoText = memoTextarea.value;
    const imageFiles = imageUpload.files;

    if (memoText === '' && imageFiles.length === 0) {
      alert('请输入备忘录内容或上传图片');
      return;
    }

    const memo = {
      text: memoText,
      images: []
    };

    if (imageFiles.length > 0) {
      const imagePromises = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
          reader.onload = function (e) {
            resolve(e.target.result);
          };
          reader.onerror = function (e) {
            reject(e);
          };
          reader.readAsDataURL(file);
        });
        imagePromises.push(promise);
      }

      Promise.all(imagePromises).then((imageUrls) => {
        memo.images = imageUrls;
        saveMemoToLocalStorage(memo);
        displaySavedMemo(memo);
      }).catch((error) => {
        console.error('图片读取错误:', error);
      });
    } else {
      saveMemoToLocalStorage(memo);
      displaySavedMemo(memo);
    }

    // 清空输入框和文件选择器
    memoTextarea.value = '';
    imageUpload.value = '';
  }

  // 展示已保存的备忘录
  function displaySavedMemo(memo) {
    const memoItem = document.createElement('div');
    memoItem.classList.add('memo-item');

    const memoTextElement = document.createElement('p');
    memoTextElement.classList.add('memo-text');
    memoTextElement.textContent = memo.text;
    memoItem.appendChild(memoTextElement);

    if (memo.images && memo.images.length > 0) {
      memo.images.forEach(imageUrl => {
        const img = document.createElement('img');
        img.classList.add('memo-image');
        img.src = imageUrl;
        memoItem.appendChild(img);
      });
    }

    savedMemos.appendChild(memoItem);
  }

  loadSavedMemos();
  saveButton.addEventListener('click', saveMemo);
});