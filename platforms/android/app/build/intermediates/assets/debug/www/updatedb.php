<?php
    $DB_HOST = 'db.sinners.be';
    $DB_USERNAME = 'brambleys';
    $DB_PASSWORD = 'BBtol123';
    $DB_DATABASE = 'brambleys';

    $connection = mysqli_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_DATABASE) or die("Error " . mysqli_error($connection));
    mysqli_set_charset($connection, "utf8");

    $type = $_POST['type'];
    $oefening = $_POST['oefening'];
    $type = $_POST['type'];
    $gewicht = $_POST['gewicht'];
    $welkGewicht = $_POST['welkGewicht'];

    $sql = "UPDATE fitness SET " . $welkGewicht . " = '$gewicht' WHERE oefeningNaam = '$oefening'";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

    mysqli_close($connection);

