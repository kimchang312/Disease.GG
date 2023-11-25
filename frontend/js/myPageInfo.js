// 정보조회
async function getInfomationFromServer() {
    try {
        const response = await fetch(`http://localhost:3000/api/users/me`, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDg5MjQ5NSwiZXhwIjoxNzAwOTM1Njk1fQ.-2eIjRjTKtBO8GN6XvlboaEWPXHlMv4wo8LBdcUDpzw"
                // Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const information = await response.json();
        if (response.status !== 200) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error(information.message);
        }
        addInfo(information);
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
}
getInfomationFromServer();


// 홈페이지에 나의 정보를 볼 수 있게 해주는 함수
function addInfo(info) {
    const html =
        `<li class = "info">이름 : ${info.name}</li>
        <li class = "info">롤닉네임 : ${info.nickname}</li>
        <li class = "info">한줄소개 : ${info.oneLiner}</li>`
    const infoList = document.querySelector(".infoList")
    infoList.innerHTML = html;
}

// 정보수정
async function putInfomation() {
    const nickname = document.querySelector("#nickname");
    const oneLiner = document.querySelector("#oneLiner");
    const password = document.querySelector("#password");
    const passwordconfirm = document.querySelector("#passwordconfirm");
    
    try {
        const newInformation = {
            nickname: nickname.value,
            oneLiner: oneLiner.value,
            password: password.value,
            passwordconfirm: passwordconfirm.value
        }
        const response = await fetch(`http://localhost:3000/api/users/me`, {
            method: "put",
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcwMDg5MjQ5NSwiZXhwIjoxNzAwOTM1Njk1fQ.-2eIjRjTKtBO8GN6XvlboaEWPXHlMv4wo8LBdcUDpzw",
                // Authorization: `Bearer ${localStorage.getItem("token")}`
                
                // 이 녀석을 적어줘야 되는구나.. 그래야 내가 제이슨 형태로 데이터를 보낸다고 알려주는 거구나..6시20분까지 뭐한거니..
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newInformation)
        });
        const information = await response.json();
        if (response.status !== 200) {
            //cry catch 구문에서 throw는 에러가 발생했을 때 catch에다가 error를 던져준다.
            throw new Error(information.message);
        }
        addInfo(information);
        alert(`${information.message}`);
        window.location.reload();
    } catch (error) {
        console.log(error.message);
        alert(error.message);
        nickname.value= "";
        oneLiner.value= "";
        password.value= "";
        passwordconfirm.value= "";
    }    
}


const topTableText = document.querySelector(".topTableText");
const topBtn = document.querySelector(".topBtn");
const topBox = document.querySelector(".topBox");
const popup = document.querySelector(".popup");

// 정보수정하기 버튼을 누르면 정보수정창으로 띄우기
topBtn.addEventListener("click", () => {
    topTableText.style.visibility = "hidden";
    topBtn.style.visibility = "hidden";
    topBox.style.visibility = "hidden";
    popup.style.display = "block";
})


const putBtn = document.querySelector(".putBtn");
// 마우스로 클릭하여 정보수정완료하기
putBtn.addEventListener("click", () => {
    
    putInfomation();
})
