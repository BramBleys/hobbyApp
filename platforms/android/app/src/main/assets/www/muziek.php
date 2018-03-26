<?php
    $DB_HOST = 'db.sinners.be';
    $DB_USERNAME = 'brambleys';
    $DB_PASSWORD = 'BBtol123';
    $DB_DATABASE = 'brambleys';

// open connection to mysql
    $connection = mysqli_connect($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_DATABASE) or die("Error " . mysqli_error($connection));
    mysqli_set_charset($connection, "utf8");

// DB query
    $sql = "select * from muziek";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

// close the db connection
    mysqli_close($connection);

// create array
    $json = [];
    while($row =mysqli_fetch_assoc($result))
    {
        $json[] = $row;
    }

// send JSON to browser
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    echo json_encode($json);