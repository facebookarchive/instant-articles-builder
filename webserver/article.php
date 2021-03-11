<?php

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;
use Facebook\InstantArticles\AMP\AMPArticle;

$mc;

define("CACHE_KEY_TYPE_IA", "ia");
define("CACHE_KEY_TYPE_AMP", "amp");
define("CACHE_KEY_TYPE_URL", "url");
define("CACHE_KEY_TYPE_WARNINGS", "warnings");

define("CACHE_KEY_HASH_ALGO", "sha256");

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
  // noop
}

function try_init_cache() {
  if (class_exists(Memcached)) {
    global $mc;
    $mc = new Memcached();
    $mc->addServer("memcached", 11211);
  }
}

function try_get_cached_value($key, $cache_type) {
  if (!class_exists(Memcached))
    return null;

  // Need to create a valid key for memcached
  $hashed_key = hash(CACHE_KEY_HASH_ALGO, $cache_type . ": " . $key, false);

  global $mc;
  $value = $mc->get($hashed_key);
  if (!$value)
    return null;

  return $value;
}

function try_set_cached_value($key, $value, $cache_type){
  if (!class_exists(Memcached))
    return;

  // Need to use a valid key for memcached
  $hashed_key = hash(CACHE_KEY_HASH_ALGO, $cache_type . ": " . $key, false);

  global $mc;
  $mc->set($hashed_key, $value);
}

function get_html_markup($url) {
  $cache_key = $url;

  $possible_html_markup = try_get_cached_value($cache_key, CACHE_KEY_TYPE_URL);

  // Cache hit
  if (!is_null($possible_html_markup))
    return $possible_html_markup;

  // Cache miss
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

  try_set_cached_value($cache_key, $content, CACHE_KEY_TYPE_URL);

  return $content;
}

function get_instant_article($html_markup, $url, $rules) {
  $cache_key = $rules . $url;

  $possible_instant_article = try_get_cached_value($cache_key, CACHE_KEY_TYPE_IA);

  // Cache hit
  if (!is_null($possible_instant_article))
    return $possible_instant_article;

  // Cache miss
  // Load rules
  //-----------
  $transformer = new Transformer();
  $transformer->loadRules($rules);

  // Transform
  //----------
  $instant_article = InstantArticle::create();
  $transformer->transformString($instant_article, $html_markup);

  $warnings = $transformer->getWarnings();

  $string_func = function($warning) {
    return $warning->__toString();
  };
  $warnings = array_map($string_func, $warnings);

  try_set_cached_value($cache_key, $warnings, CACHE_KEY_TYPE_WARNINGS);

  try_set_cached_value($cache_key, $instant_article, CACHE_KEY_TYPE_IA);

  return $instant_article;
}

function get_amp_markup($instant_article, $url, $rules) {
  $cache_key = $rules . $url;

  $possible_amp_markup = try_get_cached_value($cache_key, CACHE_KEY_TYPE_AMP);

  // Cache hit
  if (!is_null($possible_amp_markup))
    return $possible_amp_markup;

  // Cache miss
  $properties = array(
    'styles-folder' => __DIR__.'/styles/' // Where the styles are stored
  );

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

  $amp_markup = $amp_article->render();

  try_set_cached_value($cache_key, $amp_markup, CACHE_KEY_TYPE_AMP);

  return $amp_markup;
}

set_error_handler("exception_error_handler");

try_init_cache();

try {
  // Read the URL parameter
  //----------------------
  $url = $_GET['url'];
  $rules = $_POST['rules'];

  if (!$url || !$rules || filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
    $response->error = invalidIA();
    header('Content-type: application/json');
    echo json_encode($response);
    die();
  }

  $html_markup = get_html_markup($url);
  $instant_article = get_instant_article($html_markup, $url, $rules);

  if ($instant_article->isValid()) {
    $amp_markup = get_amp_markup($instant_article, $url, $rules);

    if ($amp_markup) {
      $response->amp = $amp_article;
    }

  } else {
    $response->error = invalidIA();
  }

  header('Content-type: application/json');
  echo json_encode($response);
  die();
}
catch (Exception $e) {
  echo $e->getMessage();
  echo $stacktrace = $e->getTraceAsString();
  die();
}

function invalidIA () {
  return <<<HTML
    <!doctype html>
    <html>
      <body>
        <p>
          Open an article, then connect the required fields in the <em>Article</em>
          element to see a preview.
        </p>
        <style>
          html { height: 100%; }
          body {
            display: flex;
            align-items: center;
            font-family: sans-serif;
            color: #ccc;
            height: 100%;
          }
          p {
            max-width: 300px;
            margin: auto;
            text-align: center;
          }
        </style>
      </body>
    </html>
  HTML;
}
