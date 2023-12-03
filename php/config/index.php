<?php
    $hostname_ibs = "";
    $database_ibs = "useibs_plateau";
    $username_ibs = "useibs_plateau";
    $password_ibs = "useibs@2023";
    $ibsConnection = mysqli_connect($hostname_ibs, $username_ibs, $password_ibs, $database_ibs) or trigger_error(mysqli_error($ibsConnection),E_USER_ERROR);    