<?php

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
}
set_error_handler("exception_error_handler");

$error = null;

try {
  // Read the URL parameter
  //----------------------
  $url = $_GET['url'];
  $rules = $_GET['rules'];

  if (!$url || !$rules) {
    die('Invalid parameters');
  }

  // Fetch the URL
  //--------------
  $content = file_get_contents($url);


  // Load rules
  //-----------
  $transformer = new Transformer();
  $transformer->loadRules($rules);

  // Transform
  //----------
  $instant_article = InstantArticle::create();
  $transformer->transformString($instant_article, $content);
}
catch (Exception $e) {
  $error = $e->getMessage();
  $stacktrace = $e->getTraceAsString();
}
// Output





// --------------
// Template below
// --------------
?>
<!--

=================================
Converted Instant Article Preview
=================================

# Transfomed URL: <?php if (isset($url)) { echo $url; } ?>


<?php
if ($error) {
?>
======================================
Transformation failed due to an error:
======================================

# Error: <?php echo $error; ?>


===========
Stacktrace:
===========

<?php echo $stacktrace ?>


<?php
}
else {
?>

-->

<?php  echo $instant_article->render(null, true); ?>


<!--

<?php
}
?>
==========
Rules used
==========

<?php if (isset($rules)) { echo json_encode(json_decode($rules), JSON_PRETTY_PRINT); } ?>


-->
