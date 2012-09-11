<?php
function render_profile($name, $profileImage, $achievements) {
    $im = imageCreateFromPNG('bg.png');
    
    $white = imagecolorallocate($im, 255, 255, 255);
    $red = imagecolorallocate($im, 255, 0, 0);
    
    imageString($im, 2, 4, 4, 'sumochi', $white);
    
    
    imageString($im, 4, 4, 24, $name, $white);
    $profileimg = imageCreateFromString(file_get_contents($profileImage));
    $pi_w = imageSX($profileimg);
    $pi_h = imageSY($profileimg);
    imageCopyMerge($im, $profileimg, 4, 44, 0, 0, $pi_w, $pi_h, 100);
    
    imageString($im, 4, 108, 24, "Achievements", $white);
    
    $y = 40;
    $achievements = explode("\n", $achievements);
    foreach ($achievements as $line) {
        $line = trim($line);
        imageString($im, 3, 108, $y, $line, $white);
        $y += 12;
    }
    
    //imageString($im, 3, 140, 44, 'none', $red);
    
    header('Content-type: image/png');
    imagePNG($im);
    imageDestroy($im);
}
if (isset($_GET['name'])) {
    render_profile($_GET['name'], $_GET['image'], $_GET['achievements']);
} else if (isset($_POST['name'])) {
    echo "<!doctype html>\n<meta charset=utf-8>\n";
    echo '<tt><pre>[url=http://ajf.me/gg2/sumochi/][img]' . htmlspecialchars('http://ajf.me/gg2/sumochi/?name=' . urlencode($_POST['name']) . '&image=' . urlencode($_POST['image']) . '&achievements=' . urlencode($_POST['achievements'])) . '[/img][/url]</pre></code>';
} else {
    echo "<!doctype html>\n<meta charset=utf-8>\n";
    echo "<form method=POST>\n";
    echo "<label for=name>Name:</label><input type=text name=name id=name><br>\n";
    echo "<label for=image>Image URL:</label><input type=text name=image id=image><br>\n";
    echo "<label for=achievements>Achievements:</label><textarea name=achievements id=achievements></textarea><br>\n";
    echo "<input type=submit>\n";
}
