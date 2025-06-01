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
    const restartButton = document.getElementById('restart-button');
    
    const firebaseConfig = {
        apiKey: "AIzaSyAmmyhQ2De-jTIuVcEykqhHdmfIr_K34yg",
        authDomain: "face-blindness-trainer.firebaseapp.com",
        projectId: "face-blindness-trainer",
        storageBucket: "face-blindness-trainer.firebasestorage.app",
        messagingSenderId: "568062407036",
        appId: "1:568062407036:web:9ff5fff0b29f582d7f34f9",
        measurementId: "G-Z0MVQSGRZ7"
      };

    // --- 資料結構定義 ---
    // 請確保你的圖片檔名和路徑是正確的！
    // 每個 correctImages 和 wrongImages 至少包含 2-3 張圖片，以增加隨機性並避免選不到圖片
    const questions = [
        {
            celebrity: "林俊傑",
            questionText: "請從以下圖片中找出林俊傑：",
            correctImages: ["images/林俊傑_1.jpg"], // 建議放多張
            wrongImages: ["images/陳之漢_1.jpg"] // 建議放多張
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
            wrongImages: ["images/楊丞琳_1.jpg","images/鍾明軒_1.jpg"]
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
        // !!! 注意：我假設你已經修改了圖片的重複副檔名 (例如 林俊傑_1.jpg.jpg 改為 林俊傑_1.jpg)
        // 並將你提供的 "都敏俊.jpg" 等圖片也加上 _1 的後綴以保持一致性 (如果你的檔名有數字的話)
        // 確保這些圖片檔案在你的 `images` 資料夾中確實存在！
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let availableQuestions = []; // 新增：用於存放尚未出過的題目

    // 設定總共要問幾題，直接使用 questions 陣列的長度
    const TOTAL_QUESTIONS_TO_ASK = questions.length; 

    // --- 遊戲初始化與進行邏輯 ---

    function initializeGame() {
        currentQuestionIndex = 0;
        score = 0;
        // 重新填充 availableQuestions 陣列，確保每次遊戲都是新的題目順序
        availableQuestions = [...questions]; // 使用展開運算符複製一份原始 questions 陣列
        // 可選：如果你希望每次遊戲的題目順序也是隨機的，可以在這裡打亂 availableQuestions 陣列
        // availableQuestions.sort(() => Math.random() - 0.5);

        gameArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        nextButton.textContent = '下一題';
        nextButton.disabled = true; // 預設不能點下一題
        feedbackEl.textContent = '';
        totalQuestionsEl.textContent = TOTAL_QUESTIONS_TO_ASK;
        loadQuestion();
    }

    function loadQuestion() {
        // 清除圖片的正確/錯誤樣式
        image1El.classList.remove('correct', 'wrong');
        image2El.classList.remove('correct', 'wrong');

        // 檢查是否所有題目都已問完
        if (availableQuestions.length === 0 || currentQuestionIndex >= TOTAL_QUESTIONS_TO_ASK) {
            endGame();
            return;
        }

        // 從 availableQuestions 中隨機選一個問題
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const q = availableQuestions[randomIndex];
        availableQuestions.splice(randomIndex, 1); // 將已選的問題從列表中移除

        questionEl.textContent = q.questionText;

        // 隨機選取一張正確圖片
        const correctImgPath = q.correctImages[Math.floor(Math.random() * q.correctImages.length)];
        
        // 隨機選取一張錯誤圖片 (確保不重複且不是正確的名人)
        let wrongImgPath;
        let attempts = 0;
        const maxAttempts = 100; // 防止潛在的無限循環，通常是數據問題導致
        do {
            if (q.wrongImages.length === 0) {
                console.error("錯誤：該名人問題的 wrongImages 陣列為空，無法提供錯誤選項。", q.celebrity);
                wrongImgPath = "images/placeholder_error.jpg"; // 建議準備一張預設錯誤圖
                break;
            }
            wrongImgPath = q.wrongImages[Math.floor(Math.random() * q.wrongImages.length)];
            attempts++;
            if (attempts > maxAttempts) {
                console.error("錯誤：無法找到合適的錯誤圖片。請確保 wrongImages 陣列中有足夠且與正確圖片不同的選項。", q.celebrity, correctImgPath, wrongImgPath);
                wrongImgPath = q.wrongImages[0]; // 退而求其次，選擇第一個錯誤圖
                break;
            }
        } while (wrongImgPath === correctImgPath); 

        // 隨機決定圖片位置
        const images = [
            { src: correctImgPath, isCorrect: true },
            { src: wrongImgPath, isCorrect: false }
        ];
        images.sort(() => Math.random() - 0.5);

        image1El.src = images[0].src;
        image1El.dataset.isCorrect = images[0].isCorrect; 
        image1El.alt = images[0].isCorrect ? q.celebrity : "不是" + q.celebrity; 

        image2El.src = images[1].src;
        image2El.dataset.isCorrect = images[1].isCorrect;
        image2El.alt = images[1].isCorrect ? q.celebrity : "不是" + q.celebrity; 

        feedbackEl.textContent = ''; 
        nextButton.disabled = true; 
        image1El.style.pointerEvents = 'auto'; // 啟用點擊
        image2El.style.pointerEvents = 'auto'; // 啟用點擊
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

            if (image1El.dataset.isCorrect === 'true') { // 找到正確答案的圖片，給它綠色邊框
                image1El.classList.add('correct');
            } else {
                image2El.classList.add('correct');
            }
        }
        nextButton.disabled = false; 
        image1El.style.pointerEvents = 'none'; // 禁用點擊，避免重複作答
        image2El.style.pointerEvents = 'none'; // 禁用點擊
    }

    function goToNextQuestion() {
        currentQuestionIndex++; // 題數加一
        loadQuestion(); // 載入下一題
    }

    function endGame() {
        gameArea.classList.add('hidden'); // 隱藏遊戲區
        resultArea.classList.remove('hidden'); // 顯示結果區
        scoreEl.textContent = score;
    }

    // --- 事件監聽 ---
    image1El.addEventListener('click', handleImageClick);
    image2El.addEventListener('click', handleImageClick);
    nextButton.addEventListener('click', goToNextQuestion);
    restartButton.addEventListener('click', initializeGame);

    // 遊戲開始
    initializeGame();
});