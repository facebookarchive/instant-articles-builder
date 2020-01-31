<?php

include('vendor/autoload.php');

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
  // noop
}

set_error_handler("exception_error_handler");

$markup = $_POST['markup'];
echo $markup;

die();

