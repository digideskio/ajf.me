<?php

$html = <<< EOT
<!doctype html>

<meta charset=utf-8>
<meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel=stylesheet href=style.css>
<link rel="shortcut icon" href="data:image/x-icon;base64,AAABAAEAEBACAAEAAQCwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AP//AAD+fwAA/38AAP9/AADFbwAAuW8AAL1vAADBbwAA/W8AAL1vAADDQwAA/+8AAP9vAAD/8wAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">
<title>ajf.me</title>

<div id=wrapper>
    <header>
        <h1>Andrew Faulds</h1>
        <span id=tagline>digital <a href="http://en.wikipedia.org/wiki/Hacker_(programmer_subculture)">hacker</a></span>
    </header>
    <article>
        <canvas id=stars width=720 height=360><img src=stars-placeholder.png alt="Flying stars"></canvas>
        <div id=stars-superimpose>
            <p>Hi! I'm Andrew, I live in Scotland and I love JavaScript. You can email me at <a href="mailto:ajf@ajf.me">ajf@ajf.me</a>, or follow me on <a href="https://github.com/TazeTSchnitzel/">GitHub</a> and <a href="https://twitter.com/TazeTSchnitzel">Twitter</a>.</p>
            <p>If you're feeling generous, you can also donate to me: <a href="bitcoin:1JazMbBkXMZTACum7R1q4GonPfhoyuDN6c?label=Andrew+Faulds+(ajf.me)+Donation" class=bitcoin>1JazMbBkXMZTACum7R1q4GonPfhoyuDN6c</a></p>
            <p>I host the websites of my friends <a href="http://cats4gold.net">cats4gold</a> and <a href="http://orangestar.ajf.me">orangestar</a><a href=# id=whoosh title=whoosh>.</a> Some stuff on this site:</p>
            <ul>
                <li><a href=/colourcode>BBCode chat colour-coder</a>
                <li><a href=/websocket>WebSocket info</a>
                <li><a href=/hacks>Silly web hacks</a>
            </ul>
        </div>
        <a href="http://forum.legendsofequestria.com/index.php?action=profile;u=13692"><img src="data:image/gif;base64,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" alt=pony id=pony></a>
        <a href="http://www.ganggarrison.com/forums/index.php?action=profile;u=8164"><img src="data:image/gif;base64,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" alt=len id=len></a>
        <a href=#todo id=todo-launch>Todo</a>
        <div id=todo></div>
    </article>
    <footer>
        Copyright &copy; 2010-2012 Andrew Faulds
    </footer>
</div>

<!-- I don't care, Google. Your analytics will be at the end of the page! -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30656038-1']);
  _gaq.push(['_trackPageview']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
<script src=index.js></script>
EOT;

const FILENAME = '../items.json';

if (file_exists(FILENAME)) {
    $data = json_decode(file_get_contents(FILENAME));
} else {
    $data = new StdClass();
    $data->items = [];
    file_put_contents(FILENAME, json_encode($data));
}

function check_password() {
    $salt = 'not_exactly_a_super_secure_salt';
    $desired = '787b5b3a0895a55aa2a91a2ae2daa637d37fcb08';
    if (sha1($salt . $_POST['password']) !== $desired) {
        header('Content-Type: application/json');
        die('false');
    }
}

switch (isset($_REQUEST['p']) ? $_REQUEST['p'] : null) {
    case 'list':
        check_password();
        header('Content-Type: application/json');
        echo json_encode($data);
    break;
    case 'check_password':
        check_password();
        header('Content-Type: application/json');
        echo json_encode(true);
    break;
    case 'change_state':
        check_password();
        $name = $_POST['name'];
        $newState = ($_POST['state'] == 'true' ? TRUE : FALSE);
        $changes = 0;
        foreach ($data->items as $item) {
            if ($item->name == $name) {
                $item->state = $newState;
                $changes++;
            }
        }
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'del_item':
        check_password();
        $name = $_POST['name'];
        $changes = 0;
        $data->items = array_values(array_filter($data->items, function ($item) use ($name, &$changes) {
            if ($item->name == $name) {
                $changes++;
                return FALSE;
            }
            return TRUE;
        }));
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'add_item':
        check_password();
        $name = $_POST['name'];
        $data->items[] = [
            'name' => $name,
            'state' => false
        ];
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'result' => $data
        ]);
    break;
    default:
        header('Content-Type: text/html; charset=utf-8');
        echo $html;
    break;
}
