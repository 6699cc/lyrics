let data;
let currentIndex = 0; // 現在表示している小節のインデックス

async function fetchLyric() {
  try {
    const response = await fetch("http://localhost:5555/random_lyric");
    data = await response.json();
    console.log(data);

    if (response.ok) {
      if (data.lyrics && data.lyrics.length > 0) {
        // ランダムな小節を選ぶ
        currentIndex = Math.floor(Math.random() * data.lyrics.length);
        updateLyric();
      } else {
        document.getElementById("lyric").textContent = "歌詞が見つかりません";
      }
    } else {
      document.getElementById("lyric").textContent = "エラー: 歌詞を取得できませんでした";
    }
    document.getElementById("title").innerHTML = "曲名: <strong>？？？</strong>";
  } catch (error) {
    console.error("APIエラー:", error);
    document.getElementById("lyric").textContent = "エラー: APIに接続できませんでした";
    document.getElementById("title").innerHTML = "曲名: <strong>？？？</strong>";
  }
}

function updateLyric() {
  if (data && data.lyrics && data.lyrics.length > 0) {
    const lyricContent = data.lyrics[currentIndex].content;
    document.getElementById("lyric").textContent = `${lyricContent}`;
  }
}

// 前の小節を表示
function showPreviousLyric() {
  if (data && data.lyrics && currentIndex > 0) {
    currentIndex--;
    updateLyric();
  }
}

// 次の小節を表示
function showNextLyric() {
  if (data && data.lyrics && currentIndex < data.lyrics.length - 1) {
    currentIndex++;
    updateLyric();
  }
}

async function showAnswer() {
  if (data) {
    document.getElementById("title").innerHTML = `曲名: <strong>${data.title}</strong>`;
  }
}

// 初回ロード時にランダムな歌詞を表示
fetchLyric();
