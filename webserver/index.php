<?php

include('vendor/autoload.php');

use Facebook\InstantArticles\Transformer\Transformer;
use Facebook\InstantArticles\Elements\InstantArticle;
use Facebook\InstantArticles\Elements\Header;

ob_start();

\Logger::configure(
    [
        'rootLogger' => [
            'appenders' => ['facebook-instantarticles-transformer']
        ],
        'appenders' => [
            'facebook-instantarticles-transformer' => [
                'class' => 'LoggerAppenderConsole',
                'threshold' => 'off',
                'layout' => [
                    'class' => 'LoggerLayoutSimple'
                ]
            ]
        ]
    ]
);

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

// Output
ob_end_clean();

echo "<!-- Converted Instant Article Preview -->\n";
echo "<!-- URL: $url -->\n";
echo $instant_article->render(null, true);
