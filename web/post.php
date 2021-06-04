<?php

$connect = mysql_connect(“localhost”, “noel”, “noel”); if (!connect) { die('Connection Failed: ' . mysql_error()); { mysql_select_db(“database_name”, $connect);

$user_info = “INSERT INTO testperson (name, email) VALUES ('$_POST[name]', '$_POST[email]')”; if (!mysql_query($user_info, $connect)) { die('Error: ' . mysql_error()); }

echo “Your information was added to the database.”;

mysql_close($connect); ?>