<?php
    $DB_HOST = 'db.sinners.be';
    $DB_USERNAME = 'brambleys';
    $DB_PASSWORD = 'BBtol123';
    $DB_DATABASE = 'brambleys';

    $connection = mysqli_connect($DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_DATABASE) or die("Error " . mysqli_error($connection));
    mysqli_set_charset($connection, "utf8");

    $titel = $_POST['titel'];
    $artiest = $_POST['artiest'];
    $link = $_POST['link'];
    $instrument = $_POST['instrument'];
    $categorie = $_POST['categorie'];

    $sql = "INSERT INTO muziek (artiest, titel, link, instrument, categorie) VALUES ('$artiest', '$titel', '$link', '$instrument', '$categorie')";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

    mysqli_close($connection);

