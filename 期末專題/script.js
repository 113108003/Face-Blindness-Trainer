// 初始化 Firebase
// 確認 Firebase SDK 已經透過 script 標籤引入 HTML
// 否則會出現 ReferenceError: firebase is not defined
const firebaseConfig = {
    apiKey: "AIzaSyAmmyhQ2De-jTIuVcEykqhHdmfIr_K34yg",
    authDomain: "face-blindness-trainer.firebaseapp.com",
    databaseURL: "https://face-blindness-trainer-default-rtdb.firebaseio.com", // 確保這裡有 databaseURL
    projectId: "face-blindness-trainer",
    storageBucket: "face-blindness-trainer.firebasestorage.app",
    messagingSenderId: "568062407036",
    appId: "1:568062407036:web:9ff5fff0b29f582d7f34f9",
    measurementId: "G-Z0MVQSGRZ7"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // 獲取 Realtime Database 實例

document.addEventListener('DOMContentLoaded', () => {
    const questionEl = document.getElementById('question');
    const image1El = document.getElementById('image1');
    const image2El = document.getElementById('image2');
    const feedbackEl = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');
    const gameArea = document.getElementById('game-area');
    const resultArea = document.getElementById('result-area');
    const scoreEl = document.getElementById('score');
    const totalQuestionsEl = document.getElementById('total-questions');
    const timeTakenEl = document.getElementById('time-taken'); // 新增：顯示時間
    const restartButton = document.getElementById('restart-button');
    const playerNameInput = document.getElementById('player-name'); // 新增：玩家名稱輸入框
    const submitScoreButton = document.getElementById('submit-score-button'); // 新增：提交分數按鈕
    const leaderboardListEl = document.getElementById('leaderboard-list'); // 新增：排行榜列表顯示區

    // 所有的圖片元素，方便統一操作
    const imageElements = [image1El, image2El];
    // 你可以根據需要增加選項數量，例如：
    // const image3El = document.getElementById('image3');
    // const imageElements = [image1El, image2El, image3El];
    // 注意：如果增加選項，HTML 也需要對應增加 img 標籤

    const TOTAL_OPTIONS = imageElements.length; // 自動根據 HTML 中的圖片數量決定選項數

    // --- 資料結構定義 ---
    // 請確保你的圖片檔名和路徑是正確的！
    // 每個 correctImages 至少包含 1 張圖片，wrongImages 至少包含 (TOTAL_OPTIONS - 1) 張圖片。
    // 如果你打算增加選項，請確保 wrongImages 數量足夠，否則會出現錯誤。
    const questions = [
        {
            celebrity: "林俊傑",
            questionText: "請從以下圖片中找出林俊傑：",
            correctImages: ["images/林俊傑_1.jpg"],
            wrongImages: ["images/陳之漢_1.jpg"]
        },
        {
            celebrity: "金秀賢",
            questionText: "請從以下圖片中找出金秀賢：",
            correctImages: ["images/金秀賢_1.jpg"],
            wrongImages: ["images/果郡王_1.jpg"]
        },
        {
            celebrity: "哲哲",
            questionText: "請從以下圖片中找出哲哲：",
            correctImages: ["images/哲哲_1.jpg"],
            wrongImages: ["images/哲主_1.jpg"]
        },
        {
            celebrity: "楊宗緯",
            questionText: "請從以下圖片中找出楊宗緯：",
            correctImages: ["images/楊宗緯_1.jpg"],
            wrongImages: ["images/古楊_1.jpg"]
        },
        {
            celebrity: "孫協志",
            questionText: "請從以下圖片中找出孫協志：",
            correctImages: ["images/孫協志_1.jpg"],
            wrongImages: ["images/姚純耀_1.jpg"]
        },
        {
            celebrity: "蕭敬騰",
            questionText: "請從以下圖片中找出蕭敬騰：",
            correctImages: ["images/蕭敬騰_1.jpg"],
            wrongImages: ["images/楊丞琳_1.jpg"] // 確保 wrongImages 數量夠 TOTAL_OPTIONS - 1
        },
        {
            celebrity: "包偉銘",
            questionText: "請從以下圖片中找出包偉銘：",
            correctImages: ["images/包偉銘_1.jpg"],
            wrongImages: ["images/朴海鎮_1.jpg"]
        },
        {
            celebrity: "蔡徐坤",
            questionText: "請從以下圖片中找出蔡徐坤：",
            correctImages: ["images/蔡徐坤_1.jpeg"],
            wrongImages: ["images/朴成訓_1.jpeg"]
        },
        {
            celebrity: "朴敘俊",
            questionText: "請從以下圖片中找出朴敘俊：",
            correctImages: ["images/朴敘俊_1.jpg"],
            wrongImages: ["images/浩子_1.jpg"]
        },
        {
            celebrity: "汪東城",
            questionText: "請從以下圖片中找出汪東城：",
            correctImages: ["images/汪東城_1.jpg"],
            wrongImages: ["images/康康_1.jpg"]
        },
        {
            celebrity: "阮經天",
            questionText: "請從以下圖片中找出阮經天：",
            correctImages: ["images/阮經天_1.jpg"],
            wrongImages: ["images/明道_1.jpg"]
        },
        {
            celebrity: "周杰倫",
            questionText: "請從以下圖片中找出周杰倫：",
            correctImages: ["images/周杰倫_1.jpg"],
            wrongImages: ["images/粥餅倫_1.jpg"]
        },
        {
            celebrity: "陳之漢",
            questionText: "請從以下圖片中找出陳之漢：",
            correctImages: ["images/陳之漢_2.jpg"],
            wrongImages: ["images/林俊傑_2.jpg"]
        },
        {
            celebrity: "林俊傑",
            questionText: "請從以下圖片中找出林俊傑：",
            correctImages: ["images/林俊傑_3.jpg"],
            wrongImages: ["images/陳之漢_3.jpg"]
        },
        {
            celebrity: "潘若迪",
            questionText: "請從以下圖片中找出潘若迪：",
            correctImages: ["images/潘若迪_1.jpg"],
            wrongImages: ["images/席琳狄翁_1.jpg"]
        },
        {
            celebrity: "謝震武",
            questionText: "請從以下圖片中找出謝震武：",
            correctImages: ["images/謝震武_1.jpg"],
            wrongImages: ["images/謝祖武_1.jpg"]
        },
        {
            celebrity: "夏雨喬",
            questionText: "請從以下圖片中找出夏雨喬：",
            correctImages: ["images/夏雨喬_2.jpg"],
            wrongImages: ["images/郭婞淳_1.jpg"]
        },
        {
            celebrity: "宋芸樺",
            questionText: "請從以下圖片中找出宋芸樺：",
            correctImages: ["images/宋芸樺_5.jpg"],
            wrongImages: ["images/夏雨喬_1.jpg"]
        },
        {
            celebrity: "夏雨喬",
            questionText: "請從以下圖片中找出夏雨喬：",
            correctImages: ["images/夏雨喬_3.jpg"],
            wrongImages: ["images/宋芸樺_3.jpg"]
        },
        {
            celebrity: "宋少卿",
            questionText: "請從以下圖片中找出宋少卿：",
            correctImages: ["images/宋少卿_1.jpg"],
            wrongImages: ["images/屈中恆_3.jpg"]
        },
        {
            celebrity: "屈中恆",
            questionText: "請從以下圖片中找出屈中恆：",
            correctImages: ["images/屈中恆_3.jpg"],
            wrongImages: ["images/宋少卿_1.jpg"]
        },
        {
            celebrity: "鈕承澤",
            questionText: "請從以下圖片中找出鈕承澤：",
            correctImages: ["images/鈕承澤_1.jpg"],
            wrongImages: ["images/屈中恆_1.jpg"]
        },
        {
            celebrity: "宋少卿",
            questionText: "請從以下圖片中找出宋少卿：",
            correctImages: ["images/宋少卿_3.jpg"],
            wrongImages: ["images/鈕承澤_2.jpg"]
        },
        {
            celebrity: "宋少卿",
            questionText: "請從以下圖片中找出宋少卿：",
            correctImages: ["images/宋少卿_4.jpg"],
            wrongImages: ["images/鈕承澤_2.jpg"]
        },
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let availableQuestions = []; // 用於存放尚未出過的題目
    let startTime; // 新增：記錄遊戲開始時間
    let endTime;   // 新增：記錄遊戲結束時間

    // 設定總共要問幾題，直接使用 questions 陣列的長度
    const TOTAL_QUESTIONS_TO_ASK = questions.length;

    // --- 遊戲初始化與進行邏輯 ---

    function initializeGame() {
        currentQuestionIndex = 0;
        score = 0;
        availableQuestions = [...questions]; // 複製原始題目，以便重新開始遊戲
        availableQuestions.sort(() => Math.random() - 0.5); // 隨機打亂題目順序

        gameArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        nextButton.textContent = '下一題';
        nextButton.disabled = true; // 預設不能點下一題
        feedbackEl.textContent = '';

        playerNameInput.value = ''; // 清空玩家名稱
        submitScoreButton.disabled = false; // 重新啟用提交分數按鈕

        totalQuestionsEl.textContent = TOTAL_QUESTIONS_TO_ASK;
        timeTakenEl.textContent = '0'; // 重設時間顯示

        startTime = new Date(); // 記錄遊戲開始時間
        loadQuestion();
        loadLeaderboard(); // 遊戲開始時載入排行榜
    }

    function loadQuestion() {
        // 清除所有圖片的正確/錯誤樣式
        imageElements.forEach(imgEl => {
            imgEl.classList.remove('correct', 'wrong');
            imgEl.style.pointerEvents = 'auto'; // 重新啟用點擊
            imgEl.style.display = 'block'; // 確保圖片顯示
        });

        if (availableQuestions.length === 0 || currentQuestionIndex >= TOTAL_QUESTIONS_TO_ASK) {
            endGame();
            return;
        }

        const q = availableQuestions.shift(); // 從陣列開頭取出題目，並移除它

        questionEl.textContent = q.questionText;

        const correctImgPath = q.correctImages[Math.floor(Math.random() * q.correctImages.length)];
        
        // 收集所有錯誤圖片路徑，確保不重複且數量足夠
        const selectedWrongImages = [];
        const potentialWrongImages = [...q.wrongImages]; // 複製一份，避免修改原始陣列
        let attempts = 0;
        const maxAttemptsForWrongImages = 500; // 增加嘗試次數

        // 確保錯誤圖片的數量足夠 TOTAL_OPTIONS - 1
        while (selectedWrongImages.length < TOTAL_OPTIONS - 1 && potentialWrongImages.length > 0 && attempts < maxAttemptsForWrongImages) {
            const wrongIdx = Math.floor(Math.random() * potentialWrongImages.length);
            const selectedPath = potentialWrongImages[wrongIdx];

            // 確保選取的錯誤圖片與正確圖片不同，且未重複選取
            if (selectedPath !== correctImgPath && !selectedWrongImages.includes(selectedPath)) {
                selectedWrongImages.push(selectedPath);
                potentialWrongImages.splice(wrongIdx, 1); // 從備選中移除，確保不重複
            } else {
                // 如果是重複的或與正確圖片相同，則直接移除，讓下一次隨機選取
                potentialWrongImages.splice(wrongIdx, 1);
            }
            attempts++;
        }

        if (selectedWrongImages.length < TOTAL_OPTIONS - 1) {
            console.warn(`警告：為"${q.celebrity}"找到的錯誤圖片不足，目標需要 ${TOTAL_OPTIONS - 1} 張，只找到 ${selectedWrongImages.length} 張。將使用預設圖片填充。`);
            while(selectedWrongImages.length < TOTAL_OPTIONS - 1) {
                // 如果錯誤圖片不足，填充預設圖片
                selectedWrongImages.push("images/placeholder_error.jpg"); // 確保你有這張圖片
            }
        }


        // 構建所有圖片選項的陣列
        const allImages = [{ src: correctImgPath, isCorrect: true }];
        selectedWrongImages.forEach(path => {
            allImages.push({ src: path, isCorrect: false });
        });

        // 隨機排序所有圖片
        allImages.sort(() => Math.random() - 0.5);

        // 將圖片分配給 HTML 元素
        imageElements.forEach((imgEl, index) => {
            if (allImages[index]) { // 確保有足夠的圖片可以分配
                imgEl.src = allImages[index].src;
                imgEl.dataset.isCorrect = allImages[index].isCorrect;
                imgEl.alt = allImages[index].isCorrect ? q.celebrity : "不是" + q.celebrity;
                imgEl.style.display = 'block'; // 確保圖片顯示
            } else {
                imgEl.src = ""; // 清空多餘的圖片
                imgEl.dataset.isCorrect = "false";
                imgEl.alt = "";
                imgEl.style.display = 'none'; // 隱藏多餘的圖片框，如果選項數少於 TOTAL_OPTIONS
            }
        });

        feedbackEl.textContent = '';
        nextButton.disabled = true;
    }

    function handleImageClick(event) {
        if (!nextButton.disabled) { // 如果按鈕已經可點擊，表示已經回答過了，就跳過
            return;
        }

        const clickedImage = event.target;
        const isCorrect = clickedImage.dataset.isCorrect === 'true'; 

        if (isCorrect) {
            feedbackEl.textContent = '答對了！';
            feedbackEl.classList.add('correct');
            feedbackEl.classList.remove('wrong');
            score++;
            clickedImage.classList.add('correct');
        } else {
            feedbackEl.textContent = '答錯了！';
            feedbackEl.classList.add('wrong');
            feedbackEl.classList.remove('correct');
            clickedImage.classList.add('wrong');

            // 找到並標示正確答案
            imageElements.forEach(imgEl => {
                if (imgEl.dataset.isCorrect === 'true') {
                    imgEl.classList.add('correct');
                }
            });
        }
        nextButton.disabled = false; 
        // 禁用所有圖片的點擊，避免重複作答
        imageElements.forEach(imgEl => {
            imgEl.style.pointerEvents = 'none';
        });
    }

    function goToNextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function endGame() {
        endTime = new Date(); // 記錄遊戲結束時間
        const timeDiff = Math.floor((endTime - startTime) / 1000); // 計算秒數

        gameArea.classList.add('hidden');
        resultArea.classList.remove('hidden');
        scoreEl.textContent = score;
        timeTakenEl.textContent = timeDiff; // 顯示花費時間
    }

    // --- Firebase 排行榜功能 ---

    function submitScore() {
        const playerName = playerNameInput.value.trim(); // 取得玩家名稱並去除前後空白
        const finalScore = score;
        const finalTime = parseInt(timeTakenEl.textContent); // 取得花費時間

        if (playerName === "") {
            alert("請輸入你的大名！");
            return;
        }

        // 建立分數物件
        const newScoreRef = database.ref('scores').push(); // 在 'scores' 路徑下生成一個唯一 ID
        newScoreRef.set({
            name: playerName,
            score: finalScore,
            time: finalTime, // 儲存秒數
            timestamp: firebase.database.ServerValue.TIMESTAMP // 儲存 Firebase 伺服器時間
        }).then(() => {
            alert("分數提交成功！");
            submitScoreButton.disabled = true; // 提交後禁用按鈕
            loadLeaderboard(); // 提交成功後重新載入排行榜
        }).catch(error => {
            console.error("分數提交失敗: ", error);
            alert("分數提交失敗，請稍後再試。");
        });
    }

    function loadLeaderboard() {
        leaderboardListEl.innerHTML = '載入中...'; // 顯示載入狀態

        // 查詢 Firebase Realtime Database
        // 按照分數降序排列，如果分數相同，則按照時間升序排列 (時間越短越好)
        database.ref('scores').orderByChild('score').limitToLast(10).on('value', (snapshot) => {
            let leaderboardData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                leaderboardData.push(data);
            });

            // Firebase 的 orderByChild 預設是升序，limitToLast 是取最後 N 個 (也就是最大的 N 個)
            // 所以我們需要反轉數組來得到降序排列
            leaderboardData.reverse();

            // 如果有同分數的，再依照時間排序 (時間越短越前面)
            leaderboardData.sort((a, b) => {
                if (a.score === b.score) {
                    return a.time - b.time; // 時間越短越好
                }
                return b.score - a.score; // 分數越高越好
            });

            renderLeaderboard(leaderboardData);
        }, (error) => {
            console.error("載入排行榜失敗: ", error);
            leaderboardListEl.innerHTML = '載入排行榜失敗。';
        });
    }

    function renderLeaderboard(data) {
        if (data.length === 0) {
            leaderboardListEl.innerHTML = '<p>目前沒有排行榜資料。</p>';
            return;
        }

        const ul = document.createElement('ul');
        data.forEach((entry, index) => {
            const li = document.createElement('li');
            const date = new Date(entry.timestamp);
            const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; // 格式化時間

            li.innerHTML = `
                <span class="rank">${index + 1}.</span>
                <span class="name">${entry.name}</span>
                <span class="score">${entry.score}分</span>
                <span class="time">${entry.time}秒</span>
                `;
            ul.appendChild(li);
        });
        leaderboardListEl.innerHTML = ''; // 清空舊內容
        leaderboardListEl.appendChild(ul);
    }

    // --- 事件監聽 ---
    imageElements.forEach(imgEl => {
        imgEl.addEventListener('click', handleImageClick);
    });
    nextButton.addEventListener('click', goToNextQuestion);
    restartButton.addEventListener('click', initializeGame);
    submitScoreButton.addEventListener('click', submitScore); // 提交分數按鈕監聽

    // 遊戲開始
    initializeGame();
});