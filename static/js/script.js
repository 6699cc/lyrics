let data;
let currentIndex = 0;

async function fetchLyric() {
  try {
    document.getElementById("another").style.display = "none";
    document.getElementById("answer").style.display = "inline";
    const response = await fetch("http://localhost:5555/random_lyric");
    data = await response.json();

    if (response.ok) {
      if (data.lyrics && data.lyrics.length > 0) {
        const pageIndex = document.getElementById("page").value;
        if (pageIndex === "index") {
          // ランダムな小節を選ぶ
          currentIndex = Math.floor(Math.random() * data.lyrics.length);
        } else {
          currentIndex = 0;
        }
        if(currentIndex == 0) {
          document.getElementById("previous").style.display = "none";
        }
        if(currentIndex == data.lyrics.length - 1) {
          document.getElementById("next").style.display = "none";
        }
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
    if(currentIndex == 0) {
      document.getElementById("previous").style.display = "none";
    }
    updateLyric();
  }
}

// 次の小節を表示
function showNextLyric() {
  if (data && data.lyrics && currentIndex < data.lyrics.length - 1) {
    currentIndex++;
    document.getElementById("previous").style.display = "inline";
    updateLyric();
  }
  if(currentIndex == data.lyrics.length - 1) {
    document.getElementById("next").style.display = "none";
  }
}

async function showAnswer() {
  if (data) {
    document.getElementById("title").innerHTML = `曲名: <strong>${data.title}</strong>`;
    document.getElementById("answer").style.display = "none";
    document.getElementById("another").style.display = "inline";
  }
}

// 初回ロード時にランダムな歌詞を表示
fetchLyric();
