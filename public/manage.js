const tableBody = document.querySelector(".tableBody");
const weekNum =52; //주차 수를 여기에 입력하면 그 수만큼 표 출력
const trWeek = document.querySelector(".headTr");
//0320 update
const today = new Date();
const thisWeek = weekCount(today) - 1;

/*
//1023 update : get total num
function getTotal() {
    const button = document.querySelector('#get-total-button');
    let clickTotal = null;
    button.addEventListener('click', (event) => {
        if(clickTotal == null) {
            clickTotal = event.target.getAttribute('id');
	    console.log(clickTotal);
        }
	
	if(clickTotal == event.target.getAttribute('id')) {
	    console.log('fetch');
	    return fetch("http://193.123.254.109:3000/total_num").then(response => response.json());
	}
    })
}
*/

/*
getTotal().then(items => {
    console.log(items);
})
*/

//0605 update : delete date
function openDateDeleteForm() {
    if($('#delete-date-div').css('display') == 'block') {
        $('#delete-date-div').hide();
        $('#delete-date-button').text('날짜 삭제 열기');
    }
    else {
        $('#delete-date-div').show();
        $('#delete-date-button').text('날짜 삭제 닫기');
    }
}

//0605 update : delete date
function deleteDate(event) {
    //let date = event.getAttribute('deleteNewDate');
    let date = event.getElementById('create-date-input').value;
    console.log("date : ", date);

    if(confirm(`${date}를 삭제하겠습니까?`) === true) {
        fetch(`http://193.123.254.109:3000/delete__date`, {
            method : 'POST',
            headers : {
                Accept : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ 
                date : date
            })
        })
        
        //location.reload();
    } 
    else {
        return;
    }
}


//0605 update : date th update
function getDateUpdate(oldDate) {
    console.log("getDateUpdate : ", oldDate);
    let newDate = "";

    //let newDate = prompt("변경할 날짜를 입력해주세요. (yyyymmdd)", "");

    if(confirm(`${oldDate}를 변경하겠습니까?`) === true) {
        newDate = prompt("변경할 날짜를 입력해주세요. (yyyymmdd)", "");

	if(confirm(`${oldDate}를 ${newDate}로 수정하겠습니까?`) === true) {
        fetch(`http://193.123.254.109:3000/update__date`, {
		    method : 'POST',
		    headers : {
		        Accept : 'application/json',
		        'Content-Type' : 'application/json'
		    },
		    body : JSON.stringify({
		        olddate : oldDate,
                newdate : newDate
		    })
	    })
	location.reload();
    }
    else {
        location.reload();
    }
    }
    else {
        location.reload();
    }
/*
    if(confirm(`${oldDate}를 ${newDate}로 수정하겠습니까?`) === true) {
        fetch(`http://193.123.254.109:3000/update__date`, {
		    method : 'POST',
		    headers : {
		        Accept : 'application/json',
		        'Content-Type' : 'application/json'
		    },
		    body : JSON.stringify({
		        olddate : oldDate,
                newdate : newDate
		    })
	    })
	location.reload();
    }
    else {
        location.reload();
    }
*/
}

//0522 update 
function getHighlightDate() {
    /*
     * 나의 계획
     * 일단 이 함수를 통해서 오늘의 날짜를 반환해주자
     * 그리고 나서 오늘 날짜랑 같은 날짜만 하이라이트를 해주자 - 일요일만 하이라이트 
     * 평일에도 하이라이트 하려면 - 날짜 문자열이 어떤 범위 안에 있을 때만 하이라이트
     */
    let year = today.getFullYear(); 
    let month = today.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    let date = today.getDate();
    date = date >= 10 ? date : '0' + date;
    let day = today.getDay();

    return String(year) + String(month) + String(date);
}

//0506 update : create new date
function openDateInsertForm() {
    if ($('#create-date-div').css('display') == 'block') {
            $('#create-date-div').hide();  
            $('#create-date-button').text('날짜 추가 열기'); 
    } 
    else {
            $('#create-date-div').show();
            $('#create-date-button').text('날짜 추가 닫기');
    }
}

//0504 update : excel export
function exportExcel() {
    //step1. workbook 생성
    var wb = XLSX.utils.book_new();
    
    //step2. 시트 만들기
    let newWorksheet = excelHandler.getWorksheet();

    //step3. workbook에 새로 만든 워크시트에 이름을 주고 붙인다
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

    //step4. 엑셀 파일 만들기
    var wbout = XLSX.write(wb, {bookType : 'xlsx', type : 'binary'});

    //step5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)], {type : "application/csv;charset=utf-8,%EF%BB%BF;"}), excelHandler.getExcelFileName());
}

function s2ab(s) {
    //convert s to arrayBuffer
    var buf = new ArrayBuffer(s.length); 
    
    //create uint8array as viewer
    var view = new Uint8Array(buf);  
    
    //convert to octet
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; 
    
    return buf;
} 

//here
//0410 highlight
function getSelectBox(eventName, eventYear, eventDate) {
    let select = "";
	console.log(eventYear, eventName, eventDate);
    select = `<select id=${eventYear}_${eventName}_${eventDate} onchange=updateSelect(event)>\n
                <option>선택</option>\n
		<option>-</option>\n
                <option>X</option>\n
                <option>O</option>\n
            </select>`;
    
    return select;
}

//here
function updateSelect(eventValue) {
    //alert(`${eventValue} 를 수정하겠습니까?`);
    console.log(">>>",eventValue.target);
    //eventValue.disabled = false;
    let click = null;
    
    eventValue.target.addEventListener('click', (event) => {
	let NumValue = "";
	let StringValue = event.target.value;
	let targetId = event.target.id;
	let splitList = targetId.split("_");
	let eventYear = splitList[0];
	let eventName = splitList[1];
	let eventDate = splitList[2];

	if(StringValue == '-') {
	    NumValue = '0';
	}
	else if(StringValue == 'X') {
	    NumValue = '1';
	}
	else if(StringValue == 'O') {
	    NumValue = '2';
	}
	else {
	    NumValue = 'Value is missing';
	}

	console.log("###", eventYear, eventName, eventDate, StringValue);

	if(confirm(`${eventYear} ${eventName}의 ${eventDate}의 출석정보를 ${StringValue}로 변경하겠습니까?`) === true) {
	    fetch(`http://193.123.254.109:3000/update__week`, {
		method : 'POST',
		headers : {
		    Accept : 'application/json',
		    'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
		    name : eventName, 
		    birthYear : eventYear,
		    date : eventDate,
		    value : NumValue
		})
	    })
	}
	
	click2 = null;
	location.reload();
    })
}

//0403 update : create button open, close function
function openClose () {
    if($('#create-button').css('display') == 'block') {
        $('#create-button').hide();
	    $('#open-close-button').text('등록버튼 열기');
    }    
    else {
	    $('#create-button').show();
	    $('#open-close-button').text('등록버튼 닫기');
    }
}

//0324 update : change weekNum to date
function getDateTh(fullDate, month, date, listLength) {
    //for(let i = 1; i <= listLength - 2; i++) {
	let th = document.createElement('th');
	let week = `<th scope="col">${month}/${date}</th>`;
	th.setAttribute('id', fullDate);
	th.setAttribute('class', 'th-pin table-primary');

	//0605 update
	th.setAttribute('value', fullDate);	

	th.innerHTML = week;
	trWeek.append(th);
    //}
}

//here
//0320 update : highlight
function weekCount(today) {
    let year = today.getFullYear();
    let countDay = new Date(year, 0, 1);
    let week = 1;

    while(today > countDay) {
        countDay.setDate(countDay.getDate() + 1);
        let countNum = countDay.getDay();
        if(countNum == 0) {
            week++;
        }
    }
    return week;
}

//0307 update 
function checkNull() {
    if(createName.value == "" || createBirthYear.value == "") {
        alert("다시 입력하세요");
        return false;
    }
    else {
        return true;
    }
}

        let check_status = 'on';
        document.cookie.split(';').forEach(item=>{
            if(item.includes('attendance')){
                check_status = item.split('=')[1]
            }
        })
	const button = document.querySelector('.attendance-status');
       		if(check_status === 'on'){
            		button.innerHTML = '출석 ON'
        	}else{
            		button.innerHTML = '출석 OFF';
       		 }
     	button.addEventListener('click',(event)=>{
/*	let current = event.target.dataset.current;
        if(current === 'on'){
		event.target.innerHTML = '출석 OFF';
                event.target.dataset.current = 'off';
        }else{
		event.target.innerHTML = '출석 ON'
                event.target.dataset.current = 'on';
            }*/
	let current = event.target.dataset.current;
            if(current==='on'){
                console.log("on button",current)
                event.target.innerHTML = '출석 OFF';
                event.target.dataset.current = 'off';
                document.cookie = 'attendance=off';
            }else if(current==='off'){
                console.log("off button")
                event.target.innerHTML = '출석 ON'
                event.target.dataset.current = 'on';
                document.cookie = 'attendance=on';
            }
       fetch(`http://193.123.254.109:3000/status`, {
		method : 'POST',
                headers : {
			Accept : 'application/json',
                        'Content-Type' : 'application/json'
                        },
                        body : JSON.stringify({
                            status:current
                        })
                    })
        })
function loadFriends() {
    return fetch("http://193.123.254.109:3000/information").then(response => response.json());
}


loadFriends().then(items => {   
    //0514 update
    let listLength = Object.keys(items[0]).length; //객체 배열 길이
    let keys = Object.keys(items[0]);

    //0522 update
    let weekCount = listLength - 2;

    //테이블 th 만드는 부분
    for(let i = 0; i < listLength - 2; i++ ) {
        let fullDate = keys[i];
        let month = fullDate.substr(4, 2);
        let date = fullDate.substr(6, 2);//console.log(fullDate, typeof(fullDate));
        getDateTh(fullDate, month, date, listLength);
    }

    items.forEach((item, index) => {
	    let info = document.querySelector(".info-class");
	    info.setAttribute('position', 'absolute');
	    info.style.zIndex = '99';

        let span = document.createElement("span");
	    //표 한줄 만들기
        const tr = document.createElement("tr");
        tr.setAttribute('class', 'tableContainer');
        let td = document.createElement('td');
	    let td2 = document.createElement('td');
        //수정 버튼 부분
        td.innerHTML = `<input type="button" id="updateBtn_${index}" name="updateBtn" value="수정" class="btn btn-sm btn-primary" data-name=${item.USER_NM} data-birth=${item.USER_AGE}></input>`
        td.style.backgroundColor = '#ffffff';
	    span.append(td);
	    //td.style.position = 'sticky';
	    //td.style.left = '0';
	
	    td = document.createElement('td');
        //삭제 버튼 부분
        td.innerHTML = `<input type="button" id="deleteBtn" name="deleteBtn" value="삭제" class="btn btn-sm btn-danger" data-name=${item.USER_NM} data-birth=${item.USER_AGE}></input>`
        td.style.backgroundColor = '#ffffff';
	    span.append(td);

	    td = document.createElement('td');
        //또래 부분
        td.innerHTML = `<input type="text" class="inputSize" value=${item.USER_AGE} disabled="">`
        td.style.backgroundColor = '#ffffff';
	    span.append(td);
        
	    td = document.createElement('td');
        //이름 부분
        td.innerHTML = `<input type="text" class="inputSize" value=${item.USER_NM} disabled="">`
	    td.style.backgroundColor = '#ffffff';        
	    span.append(td);

	    td = document.createElement('td');
	    td.innerHTML = `${item.USER_AGE}`;
	    td.style.display = 'none';
	    span.append(td);

	    td = document.createElement('td');
	    td.innerHTML = `${item.USER_NM}`;
	    td.style.display = 'none';
	    span.append(td);
	
	    span.style.position = 'sticky';
	    span.style.left = '0';
	    span.style.zIndex = '1';
	    span.style.opcity = '1';
	    tr.append(span);
	    tableBody.append(tr);

        /*
        //here
	    for (let i = 1; i <= weekNum; i++) { //주차 개수만큼 for문            
	        const td = document.createElement('td');
            let week = 'item.WEEK'+i;
            //console.log(eval(week));     
            if(eval(week)) {
                td.innerHTML = eval(week);
	        }
	        else {
                td.innerHTML = '-';
	        }
	        td.id = `${item.USER_AGE}_${item.USER_NM}_${i}`;
	    
	        //0320 highlight	    
	        if(i == thisWeek) {
		        //td
		        td.setAttribute('class', 'table-danger');
		        //th
		        let th = document.getElementById(i);
		        th.setAttribute('class', 'th-pin table-danger');
	        }
            tr.append(td);
        }
        */


        for (let key in item) {
	    //console.log(key);
            //eval(week) 부분
	            /*
            let week = 'item.WEEK'+i;
            if(eval(week)) {
                td.innerHTML = eval(week);
            }
            else {s
                td.innerHTML = '-';
            }
            */
	
	    if (key != 'USER_AGE' && key != 'USER_NM') {
		
            const td = document.createElement('td');
		td.innerHTML = item[key];
		td.id = `${item.USER_AGE}_${item.USER_NM}_${key}`;	
            
            let todayString = getHighlightDate();
	    
            if (key == todayString) {
		td.setAttribute('class', 'table-danger');
		let th = document.getElementById(key);
		th.setAttribute('class', 'th-pin table-danger');
	    }
	    tr.append(td);
	
	    //td.innerHTML = item[key];
            
            //highlight
                //td
            /*    
                td.setAttribute('class', 'table-danger');
                //th
                let th = document.getElementById(item.i);
                th.setAttribute('class', 'th-pin table-danger');
            }
            tr.append(td);
	*/
        }}
    
	
    tableBody.append(tr); //html의 tableBody 부분에 tr을 추가
    })

    return items
}).then((items) => {
    const tableBody = document.querySelector(".tableBody");
    //0605 update
    const tableHead = document.querySelector(".headTr");

    let click = null;
    let click2 = null;
    //0605 update
    let click3 = null; 

    //0605 update
    tableHead.addEventListener('click', (event) => {
        if(event.target.matches('th')) {
            if(click3 == null) {
                click3 = event.target.getAttribute('id');
                console.log("click3 : ", click3);
            }

            if(click3 == event.target.getAttribute('id')) {
                getDateUpdate(click3);
            }
        }
    })

   
    tableBody.addEventListener('click',(event) => { //이벤트 생겼을 때 함수 실행
        const child = event.target.parentNode.parentNode.children; 

	    console.log("target : ", event.target);
	
	    let eventOriginal = event.target.innerText;

        //here
	    let split_list = event.target.getAttribute('id').split("_");
	    let eventYear = split_list[0]; //USER_AGE
	    let eventName = split_list[1]; //USER)NM
	    let eventDate = split_list[2]; //date
	
	    if(event.target.matches('td')) {
	        if(click2 == null) {
		        click2 = event.target.getAttribute('id');
		        console.log("click2 : ", click2);
	        }
	    
	        if(click2 == event.target.getAttribute('id')) {
		        event.target.innerHTML = getSelectBox(eventName, eventYear, eventDate);
	        }
	    }

	    //0605 update
	    /*
	    if(event.target.matches('th')) {
		console.log("click3");
                if(click3 == null) {
                    click3 = event.target.getAttribute('id');
                    console.log("click3 : ", click3);
                }

                if(click3 == event.target.getAttribute('id')) {
                    getDateUpdate(click3);
                }
            }	
	    */

        if(event.target.getAttribute('value') === "수정") { //수정 버튼 클릭
            event.target.classList.toggle('active'); 
            let originalName = event.target.getAttribute('data-name');
            let originalBirthYear = event.target.getAttribute('data-birth');
	        //0410 update
	        console.log("btn_org", originalName, originalBirthYear);
            console.log("active", event.target.matches('.active'));
            
            if(click == null) {
                click = event.target.getAttribute('id');
            }
            
            if(click == event.target.getAttribute('id')) {
                if(!event.target.matches('.active')) {
                    child[2].children[0].disabled = true; //birthYear
                    child[3].children[0].disabled = true; //name

                    let newName = child[3].children[0].value;
                    let newBirthYear = child[2].children[0].value;
                    
                    console.log("new", newName, newBirthYear);
                    console.log("new", newName, newBirthYear);

                    if(confirm(`${newBirthYear} ${newName} (으)로 정말로 수정하겠습니까?`) === true) {
                        fetch(`http://193.123.254.109:3000/update`, {
                            method : 'POST',
                            headers : {
                                Accept : 'application/json',
                                'Content-Type' : 'application/json'
                            },
                            body : JSON.stringify({ 
                                originalName : originalName,
                                originalBirthYear : originalBirthYear,
                                newName : newName,
                                newBirthYear : newBirthYear
                            })
                        })
                    }
                
                    click = null;

                    location.reload();
                }

                else { 
                    child[2].children[0].disabled = false; //birthYear
                    child[3].children[0].disabled = false; //name
                }
            }
            
        }
        else if(event.target.getAttribute('value') === "삭제") { //삭제 버튼 클릭
            let deleteName =  event.target.getAttribute('data-name');
            let deleteBirthYear =  event.target.getAttribute('data-birth');
        
            if(confirm(`${deleteName} 님을 정말로 삭제하겠습니까?`) == true) {
                fetch(`http://193.123.254.109:3000/delete`, {
                    method : 'POST',
                    headers : {
                        Accept : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({ 
                        deleteBirthYear : deleteBirthYear,
                        deleteName : deleteName
                    })
                })

                location.reload();
            }
            else {
                // alert("취소되었습니다.");
                return;
            }

        }
    })
});


