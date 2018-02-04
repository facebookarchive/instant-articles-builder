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

  $warnings = $transformer->getWarnings();

  $properties = array(
    'styles-folder' => __DIR__.'/' // Where the styles are stored
  );

  $amp_article = AMPArticle::create($instant_article, $properties)->render();

  if ($amp_article) {
    echo $amp_article;
    die();
  }

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


<?php
if (count($warnings) > 0) {
?>
========
Warnings
========

<?php foreach ($warnings as $warning) {
 echo "- $warning\n";
}
?>

<?php
}
?>

-->
