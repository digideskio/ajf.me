<?php

$html = <<< EOT
<!doctype html>

<meta charset=utf-8>
<meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1">
<title>todo</title>
<link rel=stylesheet href=/style.css>
<link rel=stylesheet href=style.css>

<main>
    <div id=todo></div>

    <button id=todo-launch>launch</button>
</main>

<script src=todos.js></script>
EOT;

const FILENAME = '../../todo-items.json';
const PASSWORD_FILENAME = '../../todo-password';

if (file_exists(FILENAME)) {
    $data = json_decode(file_get_contents(FILENAME));
} else {
    $data = new StdClass();
    $data->items = [];
    file_put_contents(FILENAME, json_encode($data));
}

function check_password($supplied_password) {
    $password_hash = file_get_contents(PASSWORD_FILENAME);
    if ($password_hash === FALSE) {
        error_log("Can't open password file!");
        return FALSE;
    }
    return password_verify($supplied_password, $password_hash);
}

if (!isset($_REQUEST['p'])) {
    header('Content-Type: text/html; charset=utf-8');
    echo $html;
    die();
}

if (!check_password($_POST['password'])) {
    header('Content-Type: application/json');
    die('false');
}

header('Content-Type: application/json');

switch ($_REQUEST['p']) {
    case 'list':
        echo json_encode($data);
    break;
    case 'check_password':
        echo json_encode(true);
    break;
    case 'change_state':
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
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'del_item':
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
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'add_item':
        $name = $_POST['name'];
        $data->items[] = [
            'name' => $name,
            'state' => false
        ];
        file_put_contents(FILENAME, json_encode($data));
        echo json_encode([
            'result' => $data
        ]);
    break;
    default:
        die('false');
    break;
}
