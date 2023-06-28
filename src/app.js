const express=require('express')
const port=3000;
const app=express()
const conn=require("./db/conn")
app.use(express.json());
app.use(express.urlencoded({extended:false}));
conn.connect(function(err){
    if(err) throw err;
    console.log("database connection done");
})



app.get("/api/v1/longest-duration-movies",(req,res)=>{
    var sql="select * from movies order by runtimeMinutes desc limit 10 ";
    conn.query(sql,function(err,result){
        if(err) throw err;
        res.send(result);
    })
})

app.post("/api/v1/new-movie",(req,res)=>{
     const data=req.body;
     //console.log(data);
     var sql="insert into movies set ?";
     conn.query(sql,data,function(err,result){
        if(err) throw err;
        res.send("success! data is inserted");
     })
})

app.get("/api/v1/top-rated-movies",(req,res)=>{
    var sql="select m.tconst,m.primaryTitle,m.genres,r.averageRating from movies m inner join ratings r on m.tconst=r.tconst where r.averageRating>6 "
    conn.query(sql,function(err,result){
        if(err) throw err;
        res.send(result);
    })
})
app.get("/api/v1/genre-movies-with-subtotals",(req,res)=>{
var sql=`SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Documentary'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Documentary'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Animation'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Animation'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Short'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Short'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Sport'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Sport'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='News'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='News'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Family'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Family'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Fantasy'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Fantasy'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Comedy'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Comedy'
UNION ALL
SELECT m.genres,m.primaryTitle,r.numVotes FROM movies m INNER JOIN ratings r 
ON m.tconst=r.tconst
WHERE m.genres='Action'
UNION ALL
SELECT NUll,'total',SUM(r.numVotes) FROM movies m INNER JOIN ratings r
ON m.tconst=r.tconst
WHERE m.genres='Action'
`;
conn.query(sql,function(err,result){
    if(err) throw err;
    res.send(result);
})
})
app.post("/api/v1/update-runtime-minutes",(req,res)=>{
    var sql="UPDATE movies SET runtimeMinutes=CASE genres WHEN 'Documentary' THEN runtimeMinutes+15 WHEN 'Animation' THEN runtimeMinutes+30 ELSE runtimeMinutes+45 END; "
    conn.query(sql,function(err,result){
        if(err) throw err;
        res.send("successfull updated")
    })
})
app.listen(port,()=>{
    console.log("server is running on port 3000");
})
//select movies.genres,movies.primaryTitle,ratings.numVotes from movies inner join ratings on movies.tconst=ratings.tconst where movies.genres='Action' union all select '','totalvotes',sum(ratings.numVotes)  from movies inner join ratings on movies.tconst=ratings.tconst where movies.genres='Action'  "
//UPDATE movies SET runtimeminutes=(CASE genres WHEN "Documentary" THEN runtimeminutes+15 WHEN "Animation" THEN runtimeminutes+30 ELSE runtimeminutes+45 END;
// SELECT const, genres,runtimeminutes
// FROM movies
// WHERE genres = 'Animation'
// UNION ALL
// SELECT NULL,'total',SUM(runtimeminutes)
// FROM movies WHERE genres='Animation'

// ;