const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var fs = require('fs');
const { json } = require('body-parser');
var mysql = require('mysql');
const conn = mysql.createConnection({
	host: '193.123.254.109',		//db접속주소
    port: '3306',					//db접속포트
    user: 'root',					//db접속id
    password: '!Q2w3e4r5t6y7u',		//db접속pw
    database: 'kcMysql_DB'	
});

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}
let _url = null;
const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    let  day = new Date().getDay();
    let time = new Date().getHours();
    day =0;
time = 14;

    if (day === 0 && (13 <= time && time <= 16)) {
        res.cookie('check', 'false');
        if (req.cookies.name) {
            const name = unescape(req.cookies.name);
            const birthYear = req.cookies.year;
            console.log(name,birthYear);
            conn.query(`CALL insert_userinfo('${name}', '${birthYear}', '1', @WEEK)`, function(err, rows) {
                if (err) {
                    console.log(err);
                }
            });
            _url = '/html/approval.html';

        }
        else
            _url = '/html/index.html';
    }
    else
        _url = '/html/exception.html';
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
app.post('/check_attendance', (req,res) => { 
    const year = req.body.birthYear;
    const name = req.body.name;
    const expiredDate = new Date('December 31, 2021 23:59:59')

    conn.query(`CALL insert_userinfo('${name}', '${year}', '1', @WEEK);`, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.cookie('name', escape(name), { expires: expiredDate });
            res.cookie('year', year, { expires: expiredDate });
        }
    });

    res.redirect('/');
})
app.post('/password', (req,res) => {
    const password = req.body.password;
    if (password === 'jueun') {
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
app.get('/information', function (req, res) {

    //전체 데이터 가져오는 쿼리 작성
 conn.query(`SELECT
    A.USER_NM
   ,A.USER_AGE
   ,(CASE WHEN A.WEEK1 = 0 THEN 'O' END) AS WEEK1
   ,(CASE WHEN A.WEEK2 = 0 THEN 'O' END) AS WEEK2
   ,(CASE WHEN A.WEEK3 = 0 THEN 'O' END) AS WEEK3
   ,(CASE WHEN A.WEEK4 = 0 THEN 'O' END) AS WEEK4
   ,(CASE WHEN A.WEEK5 = 0 THEN 'O' END) AS WEEK5
   ,(CASE WHEN A.WEEK6 = 0 THEN 'O' END) AS WEEK6
   ,(CASE WHEN A.WEEK7 = 0 THEN 'O' END) AS WEEK7
   ,(CASE WHEN A.WEEK8 = 0 THEN 'O' END) AS WEEK8
   ,(CASE WHEN A.WEEK9 = 0 THEN 'O' END) AS WEEK9
   ,(CASE WHEN A.WEEK10 = 0 THEN 'O' END) AS WEEK10
   ,(CASE WHEN A.WEEK11 = 0 THEN 'O' END) AS WEEK11
   ,(CASE WHEN A.WEEK12 = 0 THEN 'O' END) AS WEEK12
   ,(CASE WHEN A.WEEK13 = 0 THEN 'O' END) AS WEEK13
   ,(CASE WHEN A.WEEK14 = 0 THEN 'O' END) AS WEEK14
   ,(CASE WHEN A.WEEK15 = 0 THEN 'O' END) AS WEEK15
   ,(CASE WHEN A.WEEK16 = 0 THEN 'O' END) AS WEEK16
   ,(CASE WHEN A.WEEK17 = 0 THEN 'O' END) AS WEEK17
   ,(CASE WHEN A.WEEK18 = 0 THEN 'O' END) AS WEEK18
   ,(CASE WHEN A.WEEK19 = 0 THEN 'O' END) AS WEEK19
   ,(CASE WHEN A.WEEK20 = 0 THEN 'O' END) AS WEEK20
   ,(CASE WHEN A.WEEK21 = 0 THEN 'O' END) AS WEEK21
   ,(CASE WHEN A.WEEK22 = 0 THEN 'O' END) AS WEEK22
   ,(CASE WHEN A.WEEK23 = 0 THEN 'O' END) AS WEEK23
   ,(CASE WHEN A.WEEK24 = 0 THEN 'O' END) AS WEEK24
   ,(CASE WHEN A.WEEK25 = 0 THEN 'O' END) AS WEEK25
   ,(CASE WHEN A.WEEK26 = 0 THEN 'O' END) AS WEEK26
   ,(CASE WHEN A.WEEK27 = 0 THEN 'O' END) AS WEEK27
   ,(CASE WHEN A.WEEK28 = 0 THEN 'O' END) AS WEEK28
   ,(CASE WHEN A.WEEK29 = 0 THEN 'O' END) AS WEEK29
   ,(CASE WHEN A.WEEK30 = 0 THEN 'O' END) AS WEEK30
   ,(CASE WHEN A.WEEK31 = 0 THEN 'O' END) AS WEEK31
   ,(CASE WHEN A.WEEK32 = 0 THEN 'O' END) AS WEEK32
   ,(CASE WHEN A.WEEK33 = 0 THEN 'O' END) AS WEEK33
   ,(CASE WHEN A.WEEK34 = 0 THEN 'O' END) AS WEEK34
   ,(CASE WHEN A.WEEK35 = 0 THEN 'O' END) AS WEEK35
   ,(CASE WHEN A.WEEK36 = 0 THEN 'O' END) AS WEEK36
   ,(CASE WHEN A.WEEK37 = 0 THEN 'O' END) AS WEEK37
   ,(CASE WHEN A.WEEK38 = 0 THEN 'O' END) AS WEEK38
   ,(CASE WHEN A.WEEK39 = 0 THEN 'O' END) AS WEEK39
   ,(CASE WHEN A.WEEK40 = 0 THEN 'O' END) AS WEEK40
   ,(CASE WHEN A.WEEK41 = 0 THEN 'O' END) AS WEEK41
   ,(CASE WHEN A.WEEK42 = 0 THEN 'O' END) AS WEEK42
   ,(CASE WHEN A.WEEK43 = 0 THEN 'O' END) AS WEEK43
   ,(CASE WHEN A.WEEK44 = 0 THEN 'O' END) AS WEEK44
   ,(CASE WHEN A.WEEK45 = 0 THEN 'O' END) AS WEEK45
   ,(CASE WHEN A.WEEK46 = 0 THEN 'O' END) AS WEEK46
   ,(CASE WHEN A.WEEK47 = 0 THEN 'O' END) AS WEEK47
   ,(CASE WHEN A.WEEK48 = 0 THEN 'O' END) AS WEEK48
   ,(CASE WHEN A.WEEK49 = 0 THEN 'O' END) AS WEEK49
   ,(CASE WHEN A.WEEK50 = 0 THEN 'O' END) AS WEEK50
   ,(CASE WHEN A.WEEK51 = 0 THEN 'O' END) AS WEEK51
   ,(CASE WHEN A.WEEK52 = 0 THEN 'O' END) AS WEEK52
FROM (
   SELECT
      B.USER_NM AS 'USER_NM',
      SUBSTRING(B.USER_AGE,3,2) AS 'USER_AGE',
      SUM(CASE WHEN A.WEEK_NUM = 1 THEN A.CHECK_GUBUN END) AS WEEK1,
      SUM(CASE WHEN A.WEEK_NUM = 2 THEN A.CHECK_GUBUN END) AS WEEK2,
      SUM(CASE WHEN A.WEEK_NUM = 3 THEN A.CHECK_GUBUN END) AS WEEK3,
      SUM(CASE WHEN A.WEEK_NUM = 4 THEN A.CHECK_GUBUN END) AS WEEK4,
      SUM(CASE WHEN A.WEEK_NUM = 5 THEN A.CHECK_GUBUN END) AS WEEK5,
      SUM(CASE WHEN A.WEEK_NUM = 6 THEN A.CHECK_GUBUN END) AS WEEK6,
      SUM(CASE WHEN A.WEEK_NUM = 7 THEN A.CHECK_GUBUN END) AS WEEK7,
      SUM(CASE WHEN A.WEEK_NUM = 8 THEN A.CHECK_GUBUN END) AS WEEK8,
      SUM(CASE WHEN A.WEEK_NUM = 9 THEN A.CHECK_GUBUN END) AS WEEK9,
      SUM(CASE WHEN A.WEEK_NUM = 10 THEN A.CHECK_GUBUN END) AS WEEK10,
      SUM(CASE WHEN A.WEEK_NUM = 11 THEN A.CHECK_GUBUN END) AS WEEK11,
      SUM(CASE WHEN A.WEEK_NUM = 12 THEN A.CHECK_GUBUN END) AS WEEK12,
      SUM(CASE WHEN A.WEEK_NUM = 13 THEN A.CHECK_GUBUN END) AS WEEK13,
      SUM(CASE WHEN A.WEEK_NUM = 14 THEN A.CHECK_GUBUN END) AS WEEK14,
      SUM(CASE WHEN A.WEEK_NUM = 15 THEN A.CHECK_GUBUN END) AS WEEK15,
      SUM(CASE WHEN A.WEEK_NUM = 16 THEN A.CHECK_GUBUN END) AS WEEK16,
      SUM(CASE WHEN A.WEEK_NUM = 17 THEN A.CHECK_GUBUN END) AS WEEK17,
      SUM(CASE WHEN A.WEEK_NUM = 18 THEN A.CHECK_GUBUN END) AS WEEK18,
      SUM(CASE WHEN A.WEEK_NUM = 19 THEN A.CHECK_GUBUN END) AS WEEK19,
      SUM(CASE WHEN A.WEEK_NUM = 20 THEN A.CHECK_GUBUN END) AS WEEK20,
      SUM(CASE WHEN A.WEEK_NUM = 21 THEN A.CHECK_GUBUN END) AS WEEK21,
      SUM(CASE WHEN A.WEEK_NUM = 22 THEN A.CHECK_GUBUN END) AS WEEK22,
      SUM(CASE WHEN A.WEEK_NUM = 23 THEN A.CHECK_GUBUN END) AS WEEK23,
      SUM(CASE WHEN A.WEEK_NUM = 24 THEN A.CHECK_GUBUN END) AS WEEK24,
      SUM(CASE WHEN A.WEEK_NUM = 25 THEN A.CHECK_GUBUN END) AS WEEK25,
      SUM(CASE WHEN A.WEEK_NUM = 26 THEN A.CHECK_GUBUN END) AS WEEK26,
      SUM(CASE WHEN A.WEEK_NUM = 27 THEN A.CHECK_GUBUN END) AS WEEK27,
      SUM(CASE WHEN A.WEEK_NUM = 28 THEN A.CHECK_GUBUN END) AS WEEK28,
      SUM(CASE WHEN A.WEEK_NUM = 29 THEN A.CHECK_GUBUN END) AS WEEK29,
      SUM(CASE WHEN A.WEEK_NUM = 30 THEN A.CHECK_GUBUN END) AS WEEK30,
      SUM(CASE WHEN A.WEEK_NUM = 31 THEN A.CHECK_GUBUN END) AS WEEK31,
      SUM(CASE WHEN A.WEEK_NUM = 32 THEN A.CHECK_GUBUN END) AS WEEK32,
      SUM(CASE WHEN A.WEEK_NUM = 33 THEN A.CHECK_GUBUN END) AS WEEK33,
      SUM(CASE WHEN A.WEEK_NUM = 34 THEN A.CHECK_GUBUN END) AS WEEK34,
      SUM(CASE WHEN A.WEEK_NUM = 35 THEN A.CHECK_GUBUN END) AS WEEK35,
      SUM(CASE WHEN A.WEEK_NUM = 36 THEN A.CHECK_GUBUN END) AS WEEK36,
      SUM(CASE WHEN A.WEEK_NUM = 37 THEN A.CHECK_GUBUN END) AS WEEK37,
      SUM(CASE WHEN A.WEEK_NUM = 38 THEN A.CHECK_GUBUN END) AS WEEK38,
      SUM(CASE WHEN A.WEEK_NUM = 39 THEN A.CHECK_GUBUN END) AS WEEK39,
      SUM(CASE WHEN A.WEEK_NUM = 40 THEN A.CHECK_GUBUN END) AS WEEK40,
      SUM(CASE WHEN A.WEEK_NUM = 41 THEN A.CHECK_GUBUN END) AS WEEK41,
      SUM(CASE WHEN A.WEEK_NUM = 42 THEN A.CHECK_GUBUN END) AS WEEK42,
      SUM(CASE WHEN A.WEEK_NUM = 43 THEN A.CHECK_GUBUN END) AS WEEK43,
      SUM(CASE WHEN A.WEEK_NUM = 44 THEN A.CHECK_GUBUN END) AS WEEK44,
      SUM(CASE WHEN A.WEEK_NUM = 45 THEN A.CHECK_GUBUN END) AS WEEK45,
      SUM(CASE WHEN A.WEEK_NUM = 46 THEN A.CHECK_GUBUN END) AS WEEK46,
      SUM(CASE WHEN A.WEEK_NUM = 47 THEN A.CHECK_GUBUN END) AS WEEK47,
      SUM(CASE WHEN A.WEEK_NUM = 48 THEN A.CHECK_GUBUN END) AS WEEK48,
      SUM(CASE WHEN A.WEEK_NUM = 49 THEN A.CHECK_GUBUN END) AS WEEK49,
      SUM(CASE WHEN A.WEEK_NUM = 50 THEN A.CHECK_GUBUN END) AS WEEK50,
      SUM(CASE WHEN A.WEEK_NUM = 51 THEN A.CHECK_GUBUN END) AS WEEK51,
      SUM(CASE WHEN A.WEEK_NUM = 52 THEN A.CHECK_GUBUN END) AS WEEK52
   FROM CHECK_INFO AS A RIGHT JOIN USER_INFO AS B ON A.USER_ID = B.USER_ID
   GROUP BY A.USER_ID, B.USER_NM
) AS A
ORDER BY A.USER_AGE ASC, A.USER_NM DESC`, (err, rows) => {
    if (err) {
        console.log(err);
        res.send("failed");
    } else {
        res.send(rows);
    }
 })

})

//관리자모드
//수정
app.post('/update', (req, res) => {
    console.log(req.body);
    var originalName = req.body.originalName; // 수정 전 이름
    var newName = req.body.newName; // 수정 후 이름
    var originalbirthYear = req.body.originalBirthYear; // 수정 전 또래
    var newBirthYear = req.body.newBirthYear; // 수정 후 또래
    console.log(originalName, newName, originalbirthYear, newBirthYear);
    conn.query(`call update_userinfo('${originalName}', '${originalbirthYear}', '${newName}', '${newBirthYear}', @Err)`,(err) => {
        if (err) {
            console.log("에러 발생");
        }else{
	    console.log(err);
	    res.send("succeed!");
    }})

})


//관리자모드
//사용자 추가
app.post('/create', (req, res) => {
    var createBirthYear = req.body.createBirthYear; // 추가하는 사용자 또래
    var createName = req.body.createName; // 추가하는 사용자 이름

    conn.query(`CALL insert_userinfo('${createBirthYear}', '${createName}', '1', @WEEK);`, function(err, rows) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/admin');
})

//관리자모드
//삭제
app.post('/delete', (req, res) => {
    var deleteBirthYear = req.body.deleteBirthYear; // 삭제할 사용자 또래
    var deleteName = req.body.deleteName; // 삭제할 사용자 이름
    console.log("delete", deleteBirthYear, deleteName);

    conn.query(`call delete_userinfo('${deleteName}', '${deleteBirthYear}')`, (err) => {
        if (err) {
            console.log("에러 발생");
        }
    })
    res.send("succeed");
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
