<?php

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;
use Facebook\InstantArticles\AMP\AMPArticle;

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
  $content = file_get_contents($url, false, $context_options);


  // Load rules
  //-----------
  $transformer = new Transformer();
  $transformer->loadRules($rules);

  // Transform
  //----------
  $instant_article = InstantArticle::create();
  $transformer->transformString($instant_article, $content);

  $warnings = $transformer->getWarnings();

  $properties = array(
    'styles-folder' => __DIR__.'/styles/' // Where the styles are stored
  );

  if ($instant_article->isValid()) {
    $amp_article = AMPArticle::create($instant_article, $properties)->render();

    if ($amp_article) {
      echo $amp_article;
      die();
    }
  }
  else {
    invalidIA();
  }
}
catch (Exception $e) {
  echo $e->getMessage();
  echo $stacktrace = $e->getTraceAsString();
  die();
}

function invalidIA() {
  ?>
  <p>
    Open an article and fully configure the <em>Article Structure</em>
    rule to see the preview of your Instant Article here.
  </p>
  <style>
    body {
      display: flex;
      align-items: center;
      font-family: sans-serif;
      color: #ccc;
    }
    p {
      max-width: 300px;
      margin: auto;
      text-align: center;
    }
  </style>
  <?php
  die();
}
