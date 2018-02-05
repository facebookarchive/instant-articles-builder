<?php

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;
use Facebook\InstantArticles\AMP\AMPArticle;

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}
set_error_handler("exception_error_handler");

$error = null;
$warnings = [];

try {
  // Read the URL parameter
  //----------------------
  $url = $_GET['url'];
  $rules = $_GET['rules'];
  $preview = $_GET['preview'];

  if (!$url || !$rules) {
    die('Invalid parameters');
  }

  if (filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
    invalidIA($preview);
  }

  $context_options = stream_context_create(array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
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

  if ($preview == "true") {
    $properties = array(
      'styles-folder' => __DIR__.'/' // Where the styles are stored
    );

    if ($instant_article->isValid()) {
      $amp_article = AMPArticle::create($instant_article, $properties)->render();

      if ($amp_article) {
        echo $amp_article;
        die();
      }
    }
    else {
      invalidIA($preview == "true");
    }
  }
  else {
    echo $instant_article->render(null, true);
  }
}
catch (Exception $e) {
  echo $e->getMessage();
  echo $stacktrace = $e->getTraceAsString();
  die();
}

function invalidIA($preview) {
  ?>
<?php if ($preview): ?>
<p>
  Open an article and fully configure the <em>Article Structure</em> rule to see the preview
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
<?php endif; ?>
<?php
  die();
}
