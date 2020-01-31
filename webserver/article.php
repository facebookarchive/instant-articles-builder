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

  $string_func = function($warning) {
    return $warning->__toString();
  };
  $response->warnings = array_map($string_func, $warnings);

  $properties = array(
    'styles-folder' => __DIR__.'/styles/' // Where the styles are stored
  );

  if ($instant_article->isValid()) {
    $amp_article = AMPArticle::create($instant_article, $properties);
    $amp_article->getObserver()->addFilter(
      'AMP_HEAD',
      function ($head) {
        $style_node = $head->ownerDocument->createElement('link');
        $style_node->setAttribute('rel', 'stylesheet');
        $style_node->setAttribute('href', 'style.css');
        $head->appendChild($style_node);
        return $head;
      }
    );

    $amp_article = $amp_article->render();

    $response->source = $instant_article->render(null, true);

    if ($amp_article) {
      $response->amp = $amp_article;
    }

    header('Content-type: application/json');
    echo json_encode($response);
    die();
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
    Open an article, then connect the required fields in the <em>Article</em>
    element to see a preview.
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
