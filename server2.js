const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var fs = require('fs');
const { json } = require('body-parser');
var mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: '193.123.254.109',		//db접속주소
    port: '3306',					//db접속포트
    user: 'root',					//db접속id
    password: '!Q2w3e4r5t6y7u',		//db접속pw
    database: 'kcMysql_DB'	
});

let _url = null;
const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
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

//0614 update
let newToday = new Date();
let newYear = newToday.getFullYear();
let newMonth = newToday.getMonth() + 1;
newMonth = newMonth >= 10 ? newMonth : '0' + newMonth;
let newDate = newToday.getDate();
newDate = newDate >= 10 ? newDate : '0' + newDate;
console.log("newDate", newDate)
let newString = String(newYear) + String(newMonth) + String(newDate);

let current_status = 'off'
app.get('/', async(req, res) => {
    let  day = new Date().getDay();
    let time = new Date().getHours();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    const  statusExpiredDate = new Date(2022,month,date,18,0,0);
    day = 0;
    time = 14;
    //time = 19;
   let check = true;
    const week = weekCount(new Date())-1;
    const id = req.query.id;
	console.log("current",current_status);
    if (day===0 && id) {
    	res.cookie('check', 'false');
	if(req.cookies.status){
		if(id){
			check = false;
		    res.redirect('/');
		}
		else
	
		_url = '/html/exception.html';
	}
        else if (req.cookies.name) {
            const name = unescape(req.cookies.name);
            const birthYear = req.cookies.year;
            console.log(name,birthYear);
 	    try {
	console.log("newstring",newString);
             //0614 update
               const result = await pool.query(`CALL insert_checkinfo('${name}','${birthYear}','${newString}', @ERCODE)`);
               console.log(">>>",result);	
		res.cookie('status','accepted',{expires: statusExpiredDate});
	       _url = '/html/approval.html';
            } catch (err) {
               console.log(err);
               res.send("failed");
            }        
	}
	else
            _url = '/html/index.html';
    }
    else{
        _url = '/html/exception.html';
	console.log("server off");
     }
	if(check){
	res.sendFile(__dirname + _url);
}
   
})
app.get('/error',(req,res) => {
	_url = '/html/error.html';
	res.sendFile(__dirname + _url);		
})
app.get('/admin', (req, res) => {
    if(req.cookies.check === 'true') {
        _url = '/html/manage.html';
        res.sendFile(__dirname + _url)
    }
    else
        res.redirect('/');
})
app.post('/check_attendance', async (req, res) => {
    const year = req.body.birthYear;
    const name = req.body.name;
    const id = req.body.id;
    const expiredDate = new Date('December 31, 2022 23:59:59')
    const week = weekCount(new Date())-1;
    
    try {
        //const result = await pool.query(`CALL insert_checkinfo('${name}','${year}','${date}', @ERCODE)`);
	//0614 update
	const result = await pool.query(`CALL insert_checkinfo('${name}','${year}','${newString}', @ERCODE)`);	

	console.log(result,result[1]);
	const check = await pool.query(`select @ERCODE`);
        const key = '@ERCODE';
        const value = check[0][0][key];
	if(value === '03'){
	   console.log("hihi");
           res.redirect(`/error/?id=${id}`);
	}
	else{
	console.log("********server id!!!***********",id);
	   res.cookie('name',escape(name),{expires: expiredDate});
	   res.cookie('year',year,{expires:expiredDate});
           res.redirect(`/?id=${id}`);
	}
	} catch (err) {
	    res.redirect(`/error/?id=${id}`);
         console.log(err);
    	}
    
})
app.post('/password', (req,res) => {
    const password = req.body.password;
    if (password === 'kcch1234!') {
        res.cookie('check','true');
        res.redirect('/admin');
    }
    else {
        res.cookie('check','false');
        _url = '/html/password.html';
        res.sendFile(__dirname + _url);
    }
})

//////////////////////////// 관리자모드 ///////////////////////////
//관리자모드
//전체 데이터 http://localhost:3000/information 으로 전송
app.get('/information', async function (req, res) {
    
    try {
	const query1  = await pool.query(`CALL select_checkinfo(@selectQuery)`);
	const query2 = await pool.query(`select @selectQuery`);
	const key = '@selectQuery';
        const value = query2[0][0][key];
	const result = await pool.query(value);
	res.send(result[0]);
	return result;    
	} catch (err) {
        	console.log("error",err);
        	res.send("failed");
    	}
})

//관리자모드
//수정
app.post('/update',async (req, res) => {
    console.log(req.body);
    var originalName = req.body.originalName; // 수정 전 이름
    var newName = req.body.newName; // 수정 후 이름
    var originalbirthYear = req.body.originalBirthYear; // 수정 전 또래
    var newBirthYear = req.body.newBirthYear; // 수정 후 또래
    console.log(originalName, newName, originalbirthYear, newBirthYear);
    try {
        const result = await pool.query(`call update_userinfo('${originalName}', '${originalbirthYear}', '${newName}', '${newBirthYear}', @Err)`);
        const result2 = await pool.query('select @Err');
	res.send("succeed");
	return result;
    } catch (err) {
        console.log(err);
        res.send("failed")
    }
})
app.post('/update__week',async (req,res)=>{
	var name  = req.body.name; // ?~H~X?| ~U ?| ~D ?~]??~D
   	var birthYear = req.body.birthYear; // ?~H~X?| ~U ?~[~D ?~]??~D
    	var date = req.body.date; // ?~H~X?| ~U ?| ~D ?~X~P?~^~X
    	var value = req.body.value; // ?~H~X?| ~U ?~[~D ?~X~P?~^~X
	console.log(name, birthYear, date, value);	
	 try {
        const result = await pool.query(`CALL update_checkinfo('${name}','${birthYear}','${date}','${value}', @ERCODE)`);
        const result2 = await pool.query('select @ERCODEr');
        res.send("succeed");
        return result;
    } catch (err) {
        console.log(err);
        res.send("failed")
    }

}
)


//0605 update
//날짜 th 수정
app.post('/update__date', async(req, res) =>{
    var olddate = req.body.olddate;
    var newdate = req.body.newdate;

    try {
        const result = await pool.query(`CALL update_daysinfo(${olddate}, ${newdate}, @ErCode)`);
        const result2 = await pool.query('select @ERCODEr');
        res.send("succeed");
        return result;
    } catch(err) {
        console.log(err);
        res.send("failed");
    }

})



//관리자모드
//날짜 추가
app.post('/createDate', (req, res) => {
    const date = req.body.createNewDate; //추가하는 날짜
    console.log(date);
    try {
        const result = pool.query(`CALL insert_daysinfo(${date}, @ErCode)`)
        console.log(result);
    } catch(err) {
	console.log(err);
    }
    res.redirect('/admin');
})


//관리자모드
//사용자 추가
app.post('/create', (req, res) => {
    const createBirthYear = req.body.createBirthYear; // 추가하는 사용자 또래
    const createName = req.body.createName; // 추가하는 사용자 이름
    const week = weekCount(new Date())-1;
    try {
        const result = pool.query(`CALL insert_userinfo('${createName}', '${createBirthYear}', '${week}', @WEEK)`)
        console.log(result);
    } catch (err) {
	console.log(err);
    }

    res.redirect('/admin');
})

//관리자모드
//삭제
app.post('/delete', async(req, res) => {
    var deleteBirthYear = req.body.deleteBirthYear; // 삭제할 사용자 또래
    var deleteName = req.body.deleteName; // 삭제할 사용자 이름
    console.log("delete", deleteBirthYear, deleteName);
   try {
        const result = await pool.query(`call delete_userinfo('${deleteName}', '${deleteBirthYear}')`);
        res.send("succeed!");
    } catch(err) {
        console.log(err);
        res.send("failed");
    }
})

//0605 update
//날짜 th 삭제
app.post('/delete__date', async(req, res) => {
    var date = req.body.deleteNewDate;
    console.log("delete", date);
    try {
        const result = await pool.query(`CALL delete_daysinfo(${date}, @ErCode)`);
        res.send("succeed!");
    } catch(err) {
        console.log(err);
        res.send("failed");
    }
    //res.redirect('/admin');
})

app.post('/status', (req, res) => {
    console.log(">>>",req.body.status)
    current_status = req.body.status;
    
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
