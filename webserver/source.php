<?php
// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
  // noop
}

set_error_handler("exception_error_handler");

try {
  // Read the URL parameter
  //----------------------
  $url = $_GET['url'];
  $rules = $_POST['rules'];

  if (!$url || !$rules) {
    invalidIA();
  }

  if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
    invalidIA();
  }

  $context_options = stream_context_create(array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
    'http'=>array(
      'header'=>"User-Agent: facebookexternalhit/1.1\r\n"
    ),
  ));

  // Fetch the URL
  //--------------
  $content = @file_get_contents($url, false, $context_options);

  if ($content === false) {
    invalidIA();
  }

  // Load rules
  //-----------
  $transformer = new Transformer();
  $transformer->loadRules($rules);

  // Transform
  //----------
  $instant_article = InstantArticle::create();
  $transformer->transformString($instant_article, $content);

  // Print source
  //-------------
  echo $instant_article->render(null, true);
}
catch (Exception $e) {
  echo $e->getMessage();
  echo $stacktrace = $e->getTraceAsString();
  die();
}

function invalidIA() {
  echo 'Open an article and fully configure the <em>Article Structure</em>';
  echo 'rule to see the source of your Instant Article here.';
  die();
}
